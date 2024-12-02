export default {
  path: '/manage',
  name: 'accountManage',
  redirect: { name: 'manageProfile' },
  component: () => import('@/views/manage-page/manage-page.vue'),
  children: [
    {
      path: 'profile',
      name: 'manageProfile',
      component: () =>
        import('@/views/manage-page/edit-profile/edit-profile.vue'),
      meta: {
        title: '设置 - 个人资料'
      }
    },
    {
      path: 'safety',
      name: 'safetySetting',
      component: () =>
        import('@/views/manage-page/safety-setting/safety-setting.vue'),
      meta: {
        title: '设置 - 安全设置'
      }
    },
    {
      path: 'notification',
      name: 'pushSetting',
      component: () =>
        import('@/views/manage-page/push-setting/push-setting.vue'),
      meta: {
        title: '设置 - 推送通知'
      }
    }
  ],
  meta: {
    // 验证登陆
    authLogin: true
  }
}
