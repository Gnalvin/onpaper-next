const intercept = () => import('@/views/jump-intercept/jump-intercept.vue')

export default {
  path: '/jump',
  name: 'JumpIntercept',
  component: intercept,
  meta: {
    title: '即将跳转页面 - 安全提示 - 纸上'
  }
}
