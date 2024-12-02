import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { mapMenusToRoutes } from './utils/index'
import wlRequest from '@/service'
import NProgress from 'nprogress' // 引入nprogress插件
import useMainStore from '@/stores/module/main'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFount',
    component: () => import('@/views/not-found/not-found.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true,
  scrollBehavior(to) {
    // noRouterToTop 路由进入时不自动调整顶部
    if (to.meta.noRouterToTop) return
    // 始终滚动顶部
    return { top: 0 }
  }
})

// 加载 router 文件下面所有路由
const dirRoutes = mapMenusToRoutes()
dirRoutes.forEach((route) => {
  router.addRoute(route)
})

//全局前置守卫
router.beforeEach((to, from, next) => {
  const mainStore = useMainStore()
  NProgress.start()
  // 页面切换时也需要清空之前缓存的 pendingRequests 对象
  wlRequest.clearRequestList()
  // 移动端允许展示的页面
  const exclude = ['userTerms', 'privacyTerms', 'commissionTerms', 'Mobile']
  if (mainStore.isMobile && exclude.indexOf(to.name as string) == -1)
    return next({ name: 'Mobile' })
  // 如果是要验证登陆的页面 没登陆跳转登陆页
  if (to.meta.authLogin && mainStore.userId == '') {
    next({ name: 'LoginPage' })
  } else {
    next()
  }
})

//全局后置守卫
router.afterEach((to) => {
  NProgress.done()
  // 修改页面标题
  document.title = (to.meta.title as string) || '纸上 - 为绘画梦想助力'
})
export default router
