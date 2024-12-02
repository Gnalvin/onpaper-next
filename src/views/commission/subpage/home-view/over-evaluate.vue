<template>
  <Transition mode="out-in" name="loading">
    <template v-if="cStore.evaluate.length">
      <div
        class="evaluate"
        v-lazy-loading="loadMore"
        :lazy-loading-immediate="false"
        :lazy-loading-delay="300"
        :lazy-loading-distance="200"
        :lazy-loading-disabled="cStore.isEnd || isFreeze"
      >
        <Waterfall
          :array-item="cStore.evaluate"
          :min-width="250"
          :columns="2"
          :lazy-load="true"
          :load-more="loadMore"
        >
          <template v-slot:default="{ item }">
            <EvaluateCard
              :evaluate="item"
              :is-owner="mainStore.userId === item.userId"
              @report="handleShowReport"
              @show-detail="handleShowDetail"
            ></EvaluateCard>
          </template>
        </Waterfall>
      </div>
    </template>
    <template v-else>
      <Transition mode="out-in" name="loading">
        <div class="waiting" v-if="cStore.waiting">
          <el-skeleton :rows="8" animated />
          <el-skeleton :rows="8" animated style="margin-top: 30px" />
        </div>
        <div class="no-have" v-else>目前没有收到评价</div>
      </Transition>
    </template>
  </Transition>

  <ViewPanel v-if="showDetail" @close="handleShowDetail" ref="viewPanelEl">
    <PlanDetail @close="closePage"></PlanDetail>
  </ViewPanel>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import EvaluateCard from './cpns/evaluate-card.vue'
import Waterfall from '@/components/waterfall/waterfall-wrap.vue'
import { ViewPanel } from '@/components/view-panel'
import PlanDetail from './cpns/plan-detail.vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import useDetailStore from '@/stores/module/commission/detail'
import useCommissionStore from '@/stores/module/commission'
import useMainStore from '@/stores/module/main'
import { ReportPanel } from '@/components/report'

const route = useRoute()
const mainStore = useMainStore()
const detailStore = useDetailStore()
const cStore = useCommissionStore()

let page = 1
cStore.evaluate = []
cStore.isEnd = false

//冻结 v-lazy-loading 避免重复请求
const isFreeze = ref(false)
watch(
  () => route.params.userId,
  async (val) => {
    if (!val || route.name != 'CommissionHomeEvaluate') return
    isFreeze.value = true
    await cStore.getUserReceiveEvaluateAction(val as string, page)
    isFreeze.value = false
  },
  { immediate: true }
)
const loadMore = () => {
  page += 1
  cStore.getUserReceiveEvaluateAction(route.params.userId as string, page)
}

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

//举报方案
const handleShowReport = (evaluateId: string, userId: string) => {
  if (!mainStore.verifyIsLogin()) return
  ReportPanel({
    msgId: evaluateId,
    msgType: 'ev',
    defendant: userId
  })
}
</script>

<style scoped lang="less">
.waiting {
  border-radius: 10px;
  padding: 0 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--surface-color4);
}
.no-have {
  border-radius: 10px;
  height: 100%;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
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
