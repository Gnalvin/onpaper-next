export default {
  path: '/mobile',
  name: 'Mobile',
  component: () => import('@/views/static-page/mobile/mobile-page.vue'),
  meta: {
    // 隐藏导航栏
    hideTabBar: true
  }
}
