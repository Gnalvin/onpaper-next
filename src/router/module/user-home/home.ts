export default {
  path: '/u/:userId',
  name: 'userHome',
  redirect: { name: 'userHomeTrend' },
  component: () => import('@/views/user-home/user-home.vue'),
  children: [
    // {
    //   path: '',
    //   name: 'userHomeMain',
    //   component: () => import('@/views/user-home/cpns/show/cpns/main-part.vue')
    // },
    {
      path: 'trend',
      name: 'userHomeTrend',
      component: () => import('@/views/user-home/cpns/show/cpns/trend-part.vue')
    },
    {
      path: 'artwork',
      name: 'userHomeArtwork',
      component: () =>
        import('@/views/user-home/cpns/show/cpns/artwork-part.vue')
    },
    {
      path: 'collect',
      name: 'userHomeCollect',
      component: () =>
        import('@/views/user-home/cpns/show/cpns/collect-part.vue')
    },
    {
      path: 'commission',
      name: 'userHomeCommission',
      component: () =>
        import('@/views/user-home/cpns/show/cpns/commission-part.vue')
    }
  ],
  meta: {
    //路由跳转时不自动跳转到顶部
    noRouterToTop: true
  }
}
