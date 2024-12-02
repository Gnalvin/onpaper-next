<template>
  <div class="rank-wrap">
    <div class="rank-nav">
      <router-link :to="{ name: 'ArtworkRank' }">
        <span class="artwork"> 热门作品 </span>
      </router-link>
      <router-link :to="{ name: 'PainterRank' }">
        <span class="painter"> 优秀画师 </span>
      </router-link>
    </div>
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component @scrollTop="handleScrollTop" :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <TopButton ref="topButtonEl"></TopButton>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import useRankPage from '@/stores/module/rank-page'
import TopButton from '@/components/top-button/top-button.vue'

const route = useRoute()
const rankStore = useRankPage()

const moveStyle = reactive({
  x: '0%'
})
// 当路由变化时,修改黄色下标移动的函数
watch(
  () => route.name,
  (newValue) => {
    const x = newValue === 'ArtworkRank' ? 0 : 100
    moveStyle.x = x + '%'
  },
  { immediate: true }
)

// 滚动到顶部
const topButtonEl = ref<InstanceType<typeof TopButton>>()
const handleScrollTop = () => {
  topButtonEl.value?.toTop()
}

onUnmounted(() => {
  rankStore.$reset()
})
</script>

<style scoped lang="less">
.rank-wrap {
  display: flex;
  flex-direction: column;
  background-color: var(--bgc);
  padding-bottom: 100px;
}
.rank-nav {
  padding-top: 55px;
  position: relative;
  display: flex;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  span {
    display: block;
    font-size: 18px;
    line-height: 26px;
    font-weight: 600;
    padding: 20px;
    cursor: pointer;
    color: var(--color-text2);
  }
}
.artwork {
  position: relative;
}
.artwork::after {
  content: '';
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateX(v-bind('moveStyle.x'));
  transition: transform 0.16s ease-in-out 0s;
  background: var(--color-text4-hover);
  height: 4px;
  border-radius: 2px;
}
.router-link-exact-active {
  span {
    color: var(--color-text4-hover) !important;
  }
}
.content {
  margin-top: 40px;
  padding: 0 85px 0 65px;
}
</style>
