import { defineStore } from 'pinia'
import type { ICommissionDetailState } from './type'
import { formatPicUrl, objCompare } from '@/utils/data-format'
import useCommissionStore from '.'
import useMainStore from '../main'
import {
  getPlanDetailRequest,
  patchPlanNextRequest,
  getUserContactRequest,
  postEvaluateRequest
} from '@/service/commission'
import type { IPlanNext } from '@/service/commission/type'
import { notification } from '@/components/notification'

const useCommissionDetailStore = defineStore('commissionDetail', {
  state: (): ICommissionDetailState => ({
    planDetail: null,
    contact: null,
    evaluate: {
      inviteId: '',
      receiver: '',
      rate1: 0,
      rate2: 0,
      rate3: 0,
      sender: '',
      text: '',
      status: null
    },
    waiting: false
  }),
  actions: {
    // 获取约稿计划详情
    async getPlanDetailAction(inviteId: string) {
      const res = await getPlanDetailRequest(inviteId)
      if (res.status === 200) {
        res.data.fileList.forEach((i) => {
          i.fileName = formatPicUrl(i.fileName, res.data.userId, 'commission')
        })
        res.data.fileList.sort(objCompare('sort'))
        res.data.evaluates?.forEach((i) => {
          if (i.sender == i.inviteOwn) {
            i.avatar = res.data.sender.avatar
            i.userName = res.data.sender.userName
          } else {
            i.avatar = res.data.artist.avatar
            i.userName = res.data.artist.userName
          }
        })
        this.planDetail = res.data
      }
    },
    // 更新约稿下一步状态
    async updatePlanNextStatusAction(data: IPlanNext) {
      const res = await patchPlanNextRequest(data)
      if (res.status === 200) {
        this.planDetail!.status = data.status
        // 展示的计划卡片状态也更新
        const cStore = useCommissionStore()
        const card = cStore.userInvitePlans.find(
          (i) => i.inviteId === data.inviteId
        )
        if (card) card.status = data.status
        notification({
          title: '约稿方案',
          message: '状态更新成功',
          type: 'success'
        })
      } else {
        notification({
          title: '约稿方案',
          message: '出错了... 请稍刷新再试',
          type: 'error'
        })
      }
    },
    // 查看双方联系方式
    async getUserContactAction() {
      const res = await getUserContactRequest(this.planDetail!.inviteId)
      if (res.status === 200) {
        this.contact = res.data
      }
    },
    // 发送评价
    async postEvaluateAction() {
      const mainStore = useMainStore()
      this.evaluate.inviteId = this.planDetail!.inviteId
      this.evaluate.sender = mainStore.userId
      // 如果当前用户是画师 则评论接受者是 约稿者，反之
      this.evaluate.receiver =
        mainStore.userId == this.planDetail!.artistId
          ? this.planDetail!.userId
          : this.planDetail!.artistId
      const res = await postEvaluateRequest(this.evaluate)
      if (res.status === 200) {
        this.planDetail!.status = res.data.status
        // 展示的计划卡片状态也更新
        const cStore = useCommissionStore()
        const card = cStore.userInvitePlans.find(
          (i) => i.inviteId === res.data.inviteId
        )
        if (card) {
          card.status = res.data.status
          card.needEvaluate = false
        }
        notification({
          title: '约稿方案',
          message: '评价成功～',
          type: 'success'
        })
      } else {
        notification({
          title: '约稿方案',
          message: '出错了... 请稍刷新再试',
          type: 'error'
        })
      }
    }
  }
})

export default useCommissionDetailStore
