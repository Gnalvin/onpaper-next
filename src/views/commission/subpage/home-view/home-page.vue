<template>
  <div class="profile" v-title="pageTitle">
    <NavBar></NavBar>
    <div class="container">
      <div class="skeleton" v-if="!cStore.userPanel">
        <el-skeleton :rows="8" style="margin-top: 30px" animated />
        <el-skeleton
          style="width: 300px; margin-top: 50px"
          :rows="3"
          animated
        />
      </div>
      <RouterView v-else :key="$route.name!"></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCommissionStore from '@/stores/module/commission'
import NavBar from './nav-bar.vue'

const route = useRoute()
const router = useRouter()
const cStore = useCommissionStore()
//页面标题
const pageTitle = computed(
  () => `@${cStore.userPanel?.userName} 的约稿页 - 纸上`
)
watch(
  () => route.params.userId,
  (val) => {
    if (!val) return
    cStore.$reset()
    cStore.getUserProfileAction(val as string)
  },
  { immediate: true }
)
onUnmounted(() => {
  cStore.$reset()
})
// 用户不存在
watch(
  () => cStore.userNoExist,
  (val) => {
    if (val) {
      router.push({ name: 'NotFount' })
    }
  }
)
</script>

<style scoped lang="less">
.profile {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 65px - 60px);
  padding: 20px 30px 40px;
}

.skeleton {
  border-radius: 10px;
  padding: 30px;
  background-color: var(--surface-color4);
  min-height: 70vh;
}
.container {
  flex: 1;
  max-width: 900px;
}
</style>
