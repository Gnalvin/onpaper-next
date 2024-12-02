const rankPage = () => import('@/views/rank-page/rank-page.vue')

export default {
  path: '/rank',
  name: 'RankPage',
  redirect: { name: 'ArtworkRank' },
  component: rankPage,
  children: [
    {
      path: 'artwork',
      name: 'ArtworkRank',
      component: () =>
        import('@/views/rank-page/cpns/artwork/artwork-rank.vue'),
      meta: {
        title: '作品排行榜 - 纸上'
      }
    },
    {
      path: 'painter',
      name: 'PainterRank',
      component: () => import('@/views/rank-page/cpns/user/user-rank.vue'),
      meta: {
        title: '用户排行榜 - 纸上'
      }
    }
  ]
}
