<template>
  <div class="topic">
    <div v-if="topicRes">
      <template v-for="item in topicRes" :key="item.topicId">
        <RouterLink
          @click="handleResClick"
          :to="{
            name: 'topicDetail',
            params: { topicId: item.topicId }
          }"
        >
          <div class="suggest">
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                fill="#1bad1b"
                stroke="#1bad1b"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path
                d="M16.6045 19.8201H33.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.8467 15.7378L18.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M28.8467 15.7378L25.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6045 28H31.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="content">
              <span class="text" v-html="$xss(item.showText, xssOpt)"></span>
              <span class="count">
                {{ $filters.formatNum(item.count) }} 次讨论</span
              >
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
    <div class="res" v-else>
      <div class="not-found">没有找到相关的话题</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated } from 'vue'
import useSearchStore from '@/stores/module/nav-bar/module/search'
//v-html 白名单
const xssOpt = {
  whiteList: {
    span: ['style']
  }
}
const emits = defineEmits(['close'])
const searchStore = useSearchStore()
const topicRes = computed(() => searchStore.searchTopicResult)

const handleResClick = () => {
  emits('close')
}
//每次激活组件发送请求
onActivated(() => {
  searchStore.searchAction()
})
</script>

<style scoped lang="less">
.topic {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  .suggest {
    cursor: pointer;
    font-size: 14px;
    padding: 9px 3px;
    margin-bottom: 5px;
    line-height: 18px;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    border-radius: 3px;
    &:hover {
      background-color: var(--surface-color3);
    }
    .content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .count {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--color-text3);
      }
    }
    svg {
      stroke: #fefefe;
      margin-right: 10px;
    }
  }
}
</style>
