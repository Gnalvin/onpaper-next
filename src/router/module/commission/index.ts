const CommissionPage = () => import('@/views/commission/commission-page.vue')

export default {
  path: '/commission',
  name: 'CommissionPage',
  redirect: 'commission/',
  component: CommissionPage,
  children: [
    {
      path: 'accept',
      name: 'CommissionAccept',
      component: () =>
        import('@/views/commission/subpage/accept-view/accept-page.vue'),
      meta: {
        // 验证登陆
        authLogin: true,
        title: '创建接稿方案 - 纸上'
      }
    },
    {
      path: 'edit',
      name: 'CommissionAcceptEdit',
      component: () =>
        import('@/views/commission/subpage/accept-view/accept-page.vue'),
      meta: {
        // 验证登陆
        authLogin: true,
        title: '编辑接稿方案 - 纸上'
      }
    },
    {
      path: 'invite/:userId',
      name: 'CommissionInvite',
      component: () =>
        import('@/views/commission/subpage/invite-view/invite-page.vue'),
      meta: {
        // 验证登陆
        authLogin: true,
        title: '创建约稿方案 - 纸上'
      }
    },
    {
      path: 'u/:userId',
      name: 'CommissionHome',
      component: () =>
        import('@/views/commission/subpage/home-view/home-page.vue'),
      redirect: { name: 'CommissionHomePlan' },
      children: [
        {
          path: 'plan',
          name: 'CommissionHomePlan',
          component: () =>
            import('@/views/commission/subpage/home-view/user-plan.vue')
        },
        // 我的企划
        {
          path: 'invite',
          name: 'CommissionHomeInvite',
          component: () =>
            import('@/views/commission/subpage/home-view/plan-item-wrap.vue')
        },
        // 收到邀请
        {
          path: 'accept',
          name: 'CommissionHomeAccept',
          component: () =>
            import('@/views/commission/subpage/home-view/plan-item-wrap.vue')
        },
        {
          path: 'evaluate',
          name: 'CommissionHomeEvaluate',
          component: () =>
            import('@/views/commission/subpage/home-view/over-evaluate.vue')
        }
      ]
    }
  ]
}
