const notifyPage = () => import('@/views/notify-page/notify-page.vue')

export default {
  path: '/notify',
  name: 'NotifyPage',
  component: notifyPage,
  meta: {
    // 验证登陆
    authLogin: true,
    title: '消息中心 - 纸上'
  }
}
