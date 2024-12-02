<template>
  <div class="plan">
    <div class="container" v-if="isShowForm">
      <Form></Form>
      <Suggest></Suggest>
    </div>
    <template v-else-if="!isShowForm && !cStore.acceptPermission">
      <div class="waiting">
        <el-skeleton :rows="18" animated />
      </div>
    </template>
    <template v-else-if="!cStore.acceptPermission?.isOk">
      <div class="no-see">
        <span>为了让约稿者更好地了解您的创作风格</span>
        <span>
          在开启接稿功能前，请至少<span style="color: #fc638c"
            >发布 5 个公开作品
          </span>
        </span>
        <span>目前公开作品数：{{ cStore.acceptPermission?.artCount }} 个</span>
        <span class="tip" @click="handleUpload">点击上传作品</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useMainStore from '@/stores/module/main'
import Suggest from './accept-suggest.vue'
import Form from './accept-form.vue'
import useCommissionStore from '@/stores/module/commission'

const mainStore = useMainStore()
const cStore = useCommissionStore()
const route = useRoute()
const router = useRouter()

const isShowForm = computed(() => {
  //  如果是编辑页面直接显示，如果可以接稿 直接显示
  return route.name == 'CommissionAcceptEdit' || cStore.acceptPermission?.isOk
})

// 如果是编辑计划 需要请求计划详情
watch(
  () => route.name,
  async (val) => {
    if (val == 'CommissionAccept') {
      cStore.checkAcceptPermissionAction()
      return
    }
    if (val != 'CommissionAcceptEdit') return
    await cStore.getEditPlanAction()
    // 没有创建方案的 不需编辑 跳到主页
    if (cStore.userNoPlan) {
      router.replace({
        name: 'CommissionHomePlan',
        params: { userId: mainStore.userId }
      })
    }
  },
  { immediate: true }
)

const handleUpload = () => {
  router.replace({ name: 'UploadPage' })
}

onUnmounted(() => {
  cStore.$reset()
})
</script>

<style scoped lang="less">
.container {
  display: flex;
  max-width: 1250px;
  padding: 40px 75px;
  margin: 0px auto;
}

.no-see {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100vh - 65px);
  background-color: var(--surface-color4);
  font-size: 16px;
  font-weight: 500;
  line-height: 2.2;
  color: var(--color-text1);
  .tip {
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    color: var(--color-text4-hover);
  }
}

.waiting {
  display: flex;
  padding: 0 100px;
  background-color: var(--surface-color4);
  min-height: calc(100vh - 65px);
  align-items: center;
}

@media (max-width: 1250px) {
  .container {
    padding: 40px 55px;
  }
}
@media (max-width: 1150px) {
  .container {
    padding: 40px 25px;
  }
}
</style>
