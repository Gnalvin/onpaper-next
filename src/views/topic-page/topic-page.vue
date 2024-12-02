<template>
  <div class="topic-page">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import useUploadTrendStore from '@/stores/module/upload/trend'
import useTopicStore from '@/stores/module/topic-page'
import useTrendStore from '@/stores/module/trend'

const topicStore = useTopicStore()
const trendStore = useTrendStore()
const uploadTrendStore = useUploadTrendStore()

onUnmounted(() => {
  topicStore.$reset()
  trendStore.$reset()
  uploadTrendStore.$reset()
})
</script>

<style scoped lang="less">
.topic-page {
  display: flex;
  padding-top: 50px;
  min-height: calc(100vh - 50px);
  background-color: var(--bgc4);
  justify-content: center;
}
</style>
