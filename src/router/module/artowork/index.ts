const artworkDetail = () =>
  import('@/views/artwork/artwork-detail/artwork-detail.vue')
const artworkPage = () => import('@/views/artwork/artwork-page.vue')
const artworkShow = () =>
  import('@/views/artwork/artwork-show/artwork-show.vue')

export default {
  path: '/artwork/',
  name: 'ArtworkPage',
  component: artworkPage,
  redirect: { name: 'ArtworkShow' },
  children: [
    {
      path: 'detail/:artId',
      name: 'ArtworkDetail',
      component: artworkDetail
    },
    {
      path: 'show',
      name: 'ArtworkShow',
      component: artworkShow,
      meta: {
        title: '作品展示 - 纸上'
      }
    }
  ]
}
