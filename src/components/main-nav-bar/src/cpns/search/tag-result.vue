<template>
  <div class="tag">
    <div class="title">精确匹配</div>
    <div class="res" v-if="tagRes.searchData">
      <span class="item" v-for="item in tagRes.searchData" :key="item.tagId">
        <RouterLink
          @click="handleResClick(item.tagName, item.tagId)"
          :to="{
            name: 'TagPage',
            params: { tagName: item.tagName },
            query: { query: item.tagId }
          }"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 16H42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 6L16 42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M32 6V42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 32H42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ item.tagName }}
          <span class="count">
            {{ $filters.formatNum(item.artCount) }} 个作品</span
          >
        </RouterLink>
      </span>
    </div>
    <div class="res" v-else>
      <div class="not-found">
        没有找到与 #{{ searchStore.searchText }} 相关的作品
      </div>
    </div>
    <div class="title">推荐搜索</div>
    <div class="res" v-if="tagRes.likeData">
      <span class="item" v-for="item in tagRes.likeData" :key="item.tagId">
        <RouterLink
          @click="handleResClick(item.tagName, item.tagId)"
          :to="{
            name: 'TagPage',
            params: { tagName: item.tagName },
            query: { query: item.tagId }
          }"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 16H42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 6L16 42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M32 6V42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 32H42"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span v-html="$xss(item.showName, xssOpt)" class="text"></span>
          <span class="count">
            {{ $filters.formatNum(item.artCount) }} 个作品</span
          >
        </RouterLink>
      </span>
    </div>
    <div class="res" v-else>
      <div class="not-found">没有相关推荐</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, inject } from 'vue'
import useSearchStore from '@/stores/module/nav-bar/module/search'
//v-html 白名单
const xssOpt = {
  whiteList: {
    span: ['style']
  }
}

const searchStore = useSearchStore()
const emits = defineEmits(['close'])
const tagRes = computed(() => searchStore.searchTagResult)

//每次激活组件发送请求
onActivated(() => {
  searchStore.searchAction()
})
//当点击 结果item 时
const saveSearch = inject<(t: string, i: string) => void>('saveSearch')
const handleResClick = (t: string, i: string) => {
  if (saveSearch) saveSearch(t, i)
  emits('close')
}
</script>

<style scoped lang="less">
.tag {
  display: flex;
  flex-direction: column;
  font-size: 15px;
  font-weight: 400;
  .title {
    margin: 10px 0;
    font-weight: 400;
    font-size: 16px;
  }
  .item {
    position: relative;
    border-radius: 5px;
    a {
      display: flex;
      align-items: center;
      padding: 10px;
    }
    svg {
      margin-right: 10px;
      stroke: var(--color-regular);
    }
    .count {
      position: absolute;
      right: 10px;
      font-size: 12px;
    }
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-width: 200px;
    }
    &:hover {
      background-color: var(--surface-color3);
    }
  }
  .not-found {
    font-size: 13px;
    padding: 10px 0;
  }
}
</style>
