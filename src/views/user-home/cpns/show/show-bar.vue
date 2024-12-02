<template>
  <div class="nav-wrap">
    <div class="container" id="showBar" ref="showBarEl">
      <ul class="nav">
        <template v-for="item in category" :key="item.text">
          <li>
            <router-link :to="item.path" replace>{{ item.text }}</router-link>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue'
import useUserHomeStore from '@/stores/module/user-home'
import { useRoute } from 'vue-router'

const route = useRoute()
const userHomeStore = useUserHomeStore()

const moveStyle = reactive({
  x: '0%'
})
const category = computed(() => {
  return [
    // {
    //   text: '主页',
    //   path: {
    //     name: 'userHomeMain',
    //     query: userHomeStore.historyQuery.main
    //   }
    // },
    {
      text: '动态',
      path: {
        name: 'userHomeTrend',
        query: userHomeStore.historyQuery.trend
      }
    },
    {
      text: '作品',
      path: {
        name: 'userHomeArtwork',
        query: userHomeStore.historyQuery.artwork
      }
    },
    {
      text: '收藏',
      path: {
        name: 'userHomeCollect',
        query: userHomeStore.historyQuery.collect
      }
    },
    {
      text: '约稿',
      path: {
        name: 'userHomeCommission'
      }
    }
  ]
})

// 当路由变化时,修改黄色下标移动的函数
watch(
  () => route.name,
  (newValue) => {
    const index = category.value.findIndex((item) => {
      return item.path.name === newValue
    })
    const x = index * 25
    moveStyle.x = x + '%'
  },
  { immediate: true }
)

// 获取导航栏在页面的高度
const showBarEl = ref<HTMLDivElement>()
const getBarHeight = () => {
  return showBarEl.value!.offsetTop
}
defineExpose({
  getBarHeight
})
</script>

<style scoped lang="less">
.nav-wrap {
  transition: background-color 0.5s ease;
}
.container {
  display: flex;
  justify-content: center;
  margin: 0px auto;
  transition: background-color 0.5s ease;
}
.nav {
  position: relative;
  display: flex;
  margin-top: 5px;
  a {
    line-height: 46px;
    height: 46px;
    padding: 0 24px;
    font-weight: 600;
    font-size: 16px;
    color: var(--black-color);
    transition: color 0.16s ease-in-out 0s;
    &:hover {
      color: var(--color-text1);
    }
  }
}

.router-link-exact-active {
  color: var(--color-text1) !important;
}

ul::after {
  content: '';
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 4px;
  transition: transform 0.16s ease-in-out 0s;
  width: 100%;
  transform: translateX(v-bind('moveStyle.x'));
  background: linear-gradient(
    to right,
    var(--color-text4-hover) 0%,
    var(--color-text4-hover) 25%,
    rgba(255, 255, 255, 0) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0) 75%,
    rgba(255, 255, 255, 0) 75%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
