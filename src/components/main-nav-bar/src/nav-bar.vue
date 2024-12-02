<template>
  <div class="main-nav-bar">
    <div class="background-mask"></div>
    <div class="content" :style="transparentStyle">
      <LeftPart
        @show-sidebar="handleSidebarShow"
        :isWhiteColor="isChangeStyle"
      ></LeftPart>
      <SearchPart :isWhiteColor="isChangeStyle"></SearchPart>
      <RightPart
        class="right"
        :isWhiteColor="isChangeStyle"
        @showCode="handleShowCode"
        @showFeedback="handleShowFeedback"
      ></RightPart>
    </div>
  </div>

  <SideBar v-if="isShowSidebar" @close="isShowSidebar = false"></SideBar>
  <InvitationCode v-if="isShowCode" @close="handleShowCode"></InvitationCode>
  <FeedbackItem v-if="isFeedback" @close="handleShowFeedback"></FeedbackItem>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed, type CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import LeftPart from './cpns/left-part.vue'
import SearchPart from './cpns/search/search-part.vue'
import RightPart from './cpns/right-part.vue'
import { SideBar } from '../../sidebar/index'
import InvitationCode from './cpns/code/invitation-code.vue'
import FeedbackItem from '@/components/feedback/feedback-item.vue'
import useNavBarStore from '@/stores/module/nav-bar'
import useHomePageStore from '@/stores/module/home-page'
import { stopBodyScroll } from '@/utils/stopScroll'

const navBarStore = useNavBarStore()
navBarStore.getUserNavDataAction()

const homePageStore = useHomePageStore()

const route = useRoute()

const isShowSidebar = ref(false)
const handleSidebarShow = () => {
  // 如果是在主页 不展示侧边栏
  if (route.meta.hideSideBar) {
    homePageStore.sidebar = homePageStore.sidebar == 'small' ? 'big' : 'small'
    return
  }
  isShowSidebar.value = !isShowSidebar.value
}
const transparentStyle = reactive<CSSProperties>({})
const isChangeStyle = computed(() => {
  return navBarStore.isTransparentNav && !navBarStore.isShowPanel
})
watch(
  [() => navBarStore.isTransparentNav, () => navBarStore.isShowPanel],
  () => {
    if (isChangeStyle.value) {
      transparentStyle.backgroundColor = 'transparent'
    } else {
      transparentStyle.backgroundColor = 'var(--surface-color4)'
    }
  },
  { immediate: true }
)

// 展示邀请码
const isShowCode = ref(false)
const handleShowCode = () => {
  isShowCode.value = !isShowCode.value
  stopBodyScroll(isShowCode.value)
}

// 展示意见反馈
const isFeedback = ref(false)
const handleShowFeedback = () => {
  isFeedback.value = !isFeedback.value
  stopBodyScroll(isFeedback.value)
}
</script>

<style scoped lang="less">
.main-nav-bar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  min-width: 1050px;
}
.background-mask {
  position: absolute;
  width: 100%;
  height: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}
.content {
  font-weight: 600;
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 55px;
  color: var(--color-text1);
  box-shadow: #00000050 0px -2px 6px;
  transition: background-color 0.5s ease;
}
</style>
