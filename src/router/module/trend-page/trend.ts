const trendPage = () => import('@/views/trend-page/trend-page.vue')
const trendDetail = () => import('@/views/trend-page/area/trend-detail.vue')
const trendHome = () => import('@/views/trend-page/area/full-area.vue')
export default {
  path: '/trend',
  name: 'trendPage',
  redirect: { name: 'trendHome' },
  component: trendPage,
  children: [
    {
      path: 'home',
      name: 'trendHome',
      component: trendHome
    },
    {
      path: ':user/:trendId',
      name: 'trendDetail',
      component: trendDetail
    }
  ],
  meta: {
    //路由跳转时不自动跳转到顶部
    noRouterToTop: true,
    title: '动态首页 - 纸上'
  }
}
