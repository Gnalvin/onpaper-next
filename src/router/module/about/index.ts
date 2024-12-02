export default {
  path: '/about',
  name: 'AboutUs',
  component: () => import('@/views/static-page/about/about-us.vue'),
  meta: {
    // 隐藏导航栏
    hideTabBar: true,
    title: '关于我们 - 纸上'
  }
}
