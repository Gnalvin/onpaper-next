<template>
  <div class="invite">
    <div class="plan-nav">
      <div
        class="item"
        :class="{ chose: cStore.planStatus == item.value }"
        v-for="item in choseNavList"
        :key="item.value"
        @click="cStore.planStatus = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <Transition mode="out-in" name="loading" appear>
      <template v-if="plans.length">
        <div
          class="plan-wrap"
          v-lazy-loading="loadMore"
          :lazy-loading-immediate="false"
          :lazy-loading-distance="500"
          :lazy-loading-delay="500"
          :lazy-loading-disabled="isFreeze || cStore.isEnd"
        >
          <template v-for="item in plans" :key="item.inviteId">
            <PlanItem :plan="item" @go-to-detail="handleShowDetail"></PlanItem>
          </template>
        </div>
      </template>
      <template v-else>
        <div style="flex-grow: 1">
          <Transition mode="out-in" name="loading" appear>
            <div class="waiting" v-if="cStore.waiting">
              <el-skeleton :rows="6" animated />
              <el-skeleton :rows="8" animated style="margin-top: 30px" />
            </div>
            <div class="no-have" v-else>
              目前没有 {{ navText }} 的
              {{ queryType == 'receive' ? '邀请' : '企划' }}
            </div>
          </Transition>
        </div>
      </template>
    </Transition>
  </div>
  <ViewPanel v-if="showDetail" @close="handleShowDetail" ref="viewPanelEl">
    <PlanDetail @close="closePage"></PlanDetail>
  </ViewPanel>
  <TopButton></TopButton>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useDetailStore from '@/stores/module/commission/detail'
import useCommissionStore from '@/stores/module/commission'
import { ViewPanel } from '@/components/view-panel'
import TopButton from '@/components/top-button/top-button.vue'
import PlanItem from './cpns/plan-item.vue'
import PlanDetail from './cpns/plan-detail.vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import { choseNavList } from '../config'

const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()
const cStore = useCommissionStore()
// 重置参数
cStore.userInvitePlans = []
cStore.planStatus = 0
cStore.isEnd = false

const queryType = computed(() => {
  if (route.name == 'CommissionHomeInvite') return 'send'
  return 'receive'
})

const plans = computed(() => cStore.userInvitePlans)
const loadMore = () => {
  cStore.getUserInvitePlanAction(queryType.value)
}

//冻结 v-lazy-loading 避免重复请求
const isFreeze = ref(false)
watch(
  () => cStore.planStatus,
  async () => {
    cStore.waiting = true
    cStore.userInvitePlans = []
    isFreeze.value = true
    cStore.isEnd = false
    await cStore.getUserInvitePlanAction(queryType.value)
    isFreeze.value = false
  },
  { immediate: true }
)
//显示详情
const showDetail = ref(false)
const handleShowDetail = (inviteId: string) => {
  showDetail.value = !showDetail.value
  stopBodyScroll(showDetail.value, false)
  if (showDetail.value) {
    detailStore.getPlanDetailAction(inviteId)
  } else {
    detailStore.$reset()
  }
}
const viewPanelEl = ref<InstanceType<typeof ViewPanel>>()
const closePage = () => {
  viewPanelEl.value?.closePage()
}

watch(
  () => route.name,
  (val) => {
    //不是自己的页面不许查看我的约稿
    if (val === 'CommissionHomeInvite' && !cStore.userPanel!.isOwner) {
      router.replace({ name: 'CommissionHomePlan', params: route.params })
    }
  },
  { immediate: true }
)

const navText = computed(() => {
  return choseNavList.find((i) => i.value == cStore.planStatus)?.label
})
</script>

<style scoped lang="less">
.invite {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.plan-wrap {
  display: grid;
  grid-template-columns: 50% 50%;
}
.plan-nav {
  display: flex;
  padding: 10px;
  background-color: var(--bgc3);
  .item {
    cursor: pointer;
    padding: 5px 15px;
    margin-right: 15px;
    font-size: 13px;
    font-weight: 500;
    border: 1.5px solid var(--border-color1);
    border-radius: 20px;
    &:hover {
      border-color: var(--primary-middle-color);
      color: var(--primary-middle-color);
    }
  }
}
.chose {
  border-color: var(--primary-middle-color) !important;
  color: var(--primary-middle-color);
}
.no-have {
  height: 100%;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--surface-color4);
}
.waiting {
  height: 100%;
  border-radius: 10px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--surface-color4);
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.2s ease;
}
</style>
