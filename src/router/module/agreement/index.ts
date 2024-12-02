const userTerms = () =>
  import('@/views/static-page/agreement/terms/user-terms.vue')
const privacyTerms = () =>
  import('@/views/static-page/agreement/terms/privacy-terms.vue')
const communityTerms = () =>
  import('@/views/static-page/agreement/terms/community-terms.vue')
const commissionTerms = () =>
  import('@/views/static-page/agreement/terms/commission-terms.vue')

export default {
  path: '/terms',
  name: 'TermPage',
  component: () => import('@/views/static-page/agreement/terms-page.vue'),
  redirect: { name: 'userTerms' },
  children: [
    {
      path: 'user-term',
      name: 'userTerms',
      component: userTerms,
      meta: {
        title: '用户协议 - 纸上'
      }
    },
    {
      path: 'privacy',
      name: 'privacyTerms',
      component: privacyTerms,
      meta: {
        title: '隐私政策 - 纸上'
      }
    },
    {
      path: 'commission',
      name: 'commissionTerms',
      component: commissionTerms,
      meta: {
        title: '社区约稿规范 - 纸上'
      }
    },
    {
      path: 'community',
      name: 'communityTerms',
      component: communityTerms,
      meta: {
        title: '社区规范 - 纸上'
      }
    }
  ],
  meta: {
    // 隐藏导航栏
    hideTabBar: true
  }
}
