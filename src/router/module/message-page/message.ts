const messagePage = () => import('@/views/message/message-page.vue')

export default {
  path: '/message',
  name: 'MessagePage',
  component: messagePage,
  meta: {
    // 验证登陆
    authLogin: true,
    title: '我的私信 - 纸上'
  }
}
