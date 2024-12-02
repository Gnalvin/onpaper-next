const topicDetail = () => import('@/views/topic-page/detail/topic-detail.vue')
const topicPage = () => import('@/views/topic-page/topic-page.vue')

export default {
  path: '/topic',
  name: 'topicPage',
  redirect: { name: 'topicDiscover' },
  component: topicPage,
  children: [
    {
      path: 'search/:topicId',
      name: 'topicDetail',
      component: topicDetail
    }
  ],
  meta: {
    title: '话题详情 - 纸上'
  }
}
