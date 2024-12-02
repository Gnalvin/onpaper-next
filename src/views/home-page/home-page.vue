<template>
  <div class="home-wrap" ref="HomeWrap">
    <div
      class="container"
      :class="{
        'small-bar': homeStore.sidebar == 'small'
      }"
    >
      <div class="sidebar">
        <SideBar
          :bar-style="homeStore.sidebar"
          @click-item="reSetSidebarStyle"
        ></SideBar>
      </div>
      <div class="content">
        <router-view> </router-view>
      </div>
    </div>
    <TopButton ref="topButtonEl"></TopButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopButton from '@/components/top-button/top-button.vue'
import SideBar from '@/components/sidebar/src/sidebar-content.vue'
import useHomePageStore from '@/stores/module/home-page'
import { throttle } from '@/utils/throttle'

const homeStore = useHomePageStore()
const route = useRoute()

// 如果 视口大小超过1250px 使用大的 SideBar
const reSetSidebarStyle = () => {
  if (document.documentElement.clientWidth > 1350) {
    homeStore.sidebar = 'big'
  } else {
    homeStore.sidebar = 'small'
  }
}
onMounted(() => {
  // 首次挂载的时候 查看宽度是否应该显示大 SideBar
  reSetSidebarStyle()
  //监听浏览器变化
  window.onresize = throttle(reSetSidebarStyle, 300)
  topButtonEl.value?.toTop('auto')
})
//组件销毁时 取消监听
onUnmounted(() => {
  window.onresize = null
})

// 每次切换页面都回到顶部
const topButtonEl = ref<InstanceType<typeof TopButton>>()
watch(
  () => route.name,
  () => {
    topButtonEl.value?.toTop('auto')
  }
)
</script>

<style scoped lang="less">
.home-wrap {
  width: 100%;
  background-color: var(--bgc);

  .container {
    padding-top: 65px;
    display: flex;
    position: relative;
    .sidebar {
      position: fixed;
      width: 240px;
    }
    .content {
      width: calc(100% - 240px);
      margin-left: 240px;
    }
  }
}
.small-bar {
  .sidebar {
    width: 100px !important;
  }
  .content {
    flex: 1;
    width: calc(100% - 100px) !important;
    margin-left: 100px !important;
  }
}
</style>
