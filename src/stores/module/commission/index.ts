import { defineStore } from 'pinia'
import type { ICommissionState } from './type'
import {
  postAcceptPlanRequest,
  getAcceptPlanRequest,
  postInvitePlanRequest,
  getReceivePlanRequest,
  getSendPlanRequest,
  getUserReceiveEvaluateRequest,
  updateCommissionStatusRequest,
  checkAcceptPermissionRequest
} from '@/service/commission'
import { getUserPanelRequest } from '@/service/common'
import { formatPicUrl } from '@/utils/data-format'
import useMainStore from '@/stores/module/main'
import { hasOwn } from '@/utils/verify-type'

const useCommissionStore = defineStore('commissionPage', {
  state: (): ICommissionState => ({
    // 接稿计划
    acceptPlan: {
      planId: '0',
      name: '',
      intro: '',
      preference: '',
      refuse: '',
      money: '',
      change: 3,
      payment: '4',
      contactType: 'QQ',
      contact: '',
      finish: 7,
      fileType: ['JPG', 'PNG']
    },
    // 约稿计划
    invitePlan: {
      planId: '',
      artistId: '',
      name: '',
      intro: '',
      purpose: '',
      money: '',
      openOption: 'appoint',
      fileType: ['JPG', 'PNG'],
      contactType: 'QQ',
      contact: '',
      date: '',
      fileSize: 'diy',
      color: 'RGB',
      payment: '4',
      category: '',
      feedBack: 0,
      fileList: []
    },
    userPlan: null,
    userNoPlan: false,
    useStopPlan: false,
    userPanel: null,
    userInvitePlans: [],
    planStatus: 0,
    isEnd: false,
    userNoExist: false,
    evaluate: [],
    acceptPermission: null,
    waiting: false
  }),
  actions: {
    // 上传接稿方案
    async postAcceptPlanAction() {
      this.acceptPlan.intro = this.acceptPlan.intro.trim()
      this.acceptPlan.preference = this.acceptPlan.preference.trim()
      this.acceptPlan.refuse = this.acceptPlan.refuse.trim()
      const res = await postAcceptPlanRequest(this.acceptPlan)
      return res
    },
    // 查看用户接稿方案
    async getUserPlanAction(userId: string) {
      const res = await getAcceptPlanRequest(userId)
      if (res.status === 200) {
        const { userId, avatar } = res.data
        res.data.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
        this.userPlan = res.data
      } else if (res.status === 1033) {
        this.userNoPlan = true
        this.userPlan = null
      } else if (res.status === 1035) {
        this.useStopPlan = true
        this.userPlan = null
      }
    },
    //获取用户面板资料
    async getUserProfileAction(userId: string) {
      //发送网络请求
      const result = await getUserPanelRequest(userId)
      if (result.status === 200) {
        const { avatar, banner, userId } = result.data
        result.data.avatar = formatPicUrl(avatar, userId, 'avatars', '')
        result.data.banner = formatPicUrl(banner, userId, 'banners', 's')
        this.userPanel = result.data
      } else if (result.status === 1003) {
        this.userNoExist = true
      }
    },
    //上传约稿方案
    async postInvitePlanAction() {
      this.invitePlan.artistId = this.userPlan!.userId
      this.invitePlan.planId = this.userPlan!.planId
      const res = await postInvitePlanRequest(this.invitePlan)
      return res
    },
    // 查看收到的约稿邀请
    async getUserInvitePlanAction(pType: string) {
      if (!this.userPanel) return
      const last = this.userInvitePlans[this.userInvitePlans.length - 1]
      const next = last ? String(Date.parse(last.updateAt)) : '0'
      let res
      if (pType == 'send') {
        const mainStore = useMainStore()
        res = await getSendPlanRequest(mainStore.userId, this.planStatus, next)
      } else {
        const userId = this.userPanel!.userId
        res = await getReceivePlanRequest(userId, this.planStatus, next)
      }
      this.waiting = false
      if (res.status === 200) {
        if (res.data.length < 10) this.isEnd = true
        res.data.forEach((item) => {
          if (item.fileList.length) {
            const fileName = item.fileList[0].fileName
            item.fileList[0].fileName = formatPicUrl(
              fileName,
              item.userId,
              'commission'
            )
          }
        })
        this.userInvitePlans.push(...res.data)
      }
    },
    // 获取完稿评价
    async getUserReceiveEvaluateAction(userId: string, page: number) {
      if (page == 1) this.waiting = true
      const res = await getUserReceiveEvaluateRequest(userId, page)
      this.waiting = false
      if (res.status === 200) {
        this.evaluate.push(...res.data)
        if (res.data.length < 15) this.isEnd = true
      }
    },
    //更新约稿状态
    async updateCommissionStatusAction() {
      const { userId, commission } = this.userPanel!
      const res = await updateCommissionStatusRequest(userId, !commission)

      return res
    },
    //获取已有的接稿计划准备编辑
    async getEditPlanAction() {
      const mainStore = useMainStore()
      const res = await getAcceptPlanRequest(mainStore.userId)
      if (res.status === 200) {
        // 结构需要编辑的数据
        for (const key in res.data) {
          if (hasOwn(this.acceptPlan, key)) {
            const item = res.data[key]
            this.acceptPlan[key] = item
          }
        }
      } else if (res.status === 1033) {
        this.userNoPlan = true
      }
    },
    //检测是否可以开启约稿
    async checkAcceptPermissionAction() {
      const res = await checkAcceptPermissionRequest()
      if (res.status === 200) {
        this.acceptPermission = res.data
      }
    }
  }
})

export default useCommissionStore
