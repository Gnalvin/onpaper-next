export default {
  path: '/',
  name: 'HomePage',
  component: () => import('@/views/home-page/home-page.vue'),
  redirect: { name: 'mainHome' },
  children: [
    {
      path: '/',
      name: 'mainHome',
      component: () => import('@/views/home-page/subarea/home/home-area.vue')
    },
    {
      path: 'home/discover',
      name: 'homeDiscover',
      component: () =>
        import('@/views/home-page/subarea/discover/discover-area.vue'),
      meta: {
        title: '发现更多作品 - 纸上'
      }
    },
    {
      path: 'home/focus',
      name: 'homeFocus',
      component: () => import('@/views/home-page/subarea/focus/focus-area.vue'),
      meta: {
        // 验证登陆
        authLogin: true,
        title: '关注用户作品 - 纸上'
      }
    },
    {
      path: 'home/collect',
      name: 'homeCollect',
      component: () =>
        import('@/views/home-page/subarea/collect/collect-area.vue'),
      meta: {
        // 验证登陆
        authLogin: true,
        title: '我的收藏 - 纸上'
      }
    }
  ],
  beforeEnter: () => {
    // 每次进入首页 滚动到顶部
    document.getElementById('app')?.scrollTo(0, 0)
    return true
  },
  meta: {
    // 隐藏弹出的侧边栏
    hideSideBar: true
  }
}
