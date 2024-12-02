<template>
  <div class="app">
    <el-config-provider :locale="zhCn">
      <NavBar v-if="!$route.meta.hideTabBar"></NavBar>
      <router-view :key="mainStore.refreshPage"></router-view>
      <Transition appear>
        <LoginPanel
          v-if="mainStore.isShowLogin"
          @close="mainStore.isShowLogin = false"
        ></LoginPanel>
      </Transition>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import useMainStore from '@/stores/module/main'
import NavBar from './components/main-nav-bar/src/nav-bar.vue'
import LoginPanel from '@/views/login-page/panel/main-panel.vue'
import { ElConfigProvider } from 'element-plus' //elme 组件显示中文
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import localStorage from '@/utils/local-storage'

const mainStore = useMainStore()

//检测浏览器选项卡切换变化 如果其他选项卡退出状态 激活页面要刷新权限
window.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'visible') {
    const token = localStorage.getCache('refreshToken') ?? ''
    if (token == mainStore.refreshToken) return
    location.reload()
  }
})
</script>

<style scoped lang="less">
.app {
  height: 100%;
  width: 100%;
}
</style>
