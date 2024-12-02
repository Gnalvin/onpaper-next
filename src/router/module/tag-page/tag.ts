const tagPage = () => import('@/views/tag-page/tag-page.vue')

export default {
  path: '/tag/:tagName',
  name: 'TagPage',
  component: tagPage
}
