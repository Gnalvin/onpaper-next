export default {
  path: '/login',
  name: 'LoginPage',
  component: () => import('@/views/login-page/login-page.vue'),
  meta: {
    // 隐藏导航栏
    hideTabBar: true,
    title: '用户登录/注册 - 纸上'
  }
}
