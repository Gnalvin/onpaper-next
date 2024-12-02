<template>
  <div class="trend">
    <div class="container">
      <NavBar @scroll-top="handleScrollTop"></NavBar>
      <main class="main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
  <TopButton ref="topButtonEL"></TopButton>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import TopButton from '@/components/top-button/top-button.vue'
import useTrendStore from '@/stores/module/trend'
import NavBar from './nav-bar.vue'
const trendStore = useTrendStore()
trendStore.getHotTopicAction()

onUnmounted(() => {
  trendStore.$reset()
})

const topButtonEL = ref<InstanceType<typeof TopButton>>()
const handleScrollTop = () => {
  topButtonEL.value?.toTop('auto')
}
</script>

<style scoped lang="less">
.trend {
  display: flex;
  padding-top: 50px;
  min-height: calc(100vh - 50px);
  background-color: var(--bgc4);
}
.container {
  display: flex;
  margin: 0 auto;
  padding-top: 15px;
}

.main {
  display: flex;
}
</style>
