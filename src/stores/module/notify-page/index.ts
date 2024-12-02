import { defineStore } from 'pinia'
import type { INotifyState } from './type'
import {
  getUnreadCountRequest,
  getLikeAndCollectRequest,
  getFocusNotifyRequest,
  getCommentRequest,
  getCommissionRequest
} from '@/service/notify-page'
import { postUserFocusRequest } from '@/service/common'
import {
  postCommentRequest,
  getOneRootCommentRequest,
  getChildCommentRequest,
  postLikeCommentRequest
} from '@/service/comment'
import type { IPostCommentData, IPostLikeData } from '@/service/comment/type'
import { changeChildComment, addOwnComment, handleCommentLike } from './handle'
import { formatPicUrl } from '@/utils/data-format'
import { notification } from '@/components/notification'

const useStore = defineStore('notify', {
  state: (): INotifyState => ({
    unread: {
      like: 0,
      at: 0,
      follow: 0,
      collect: 0,
      comment: 0,
      commission: 0
    },
    notify: [],
    notifyType: 'likeAndCollect',
    isEnd: false,
    noHavMsg: false,
    commentDetail: null,
    childCommentEnd: false
  }),
  actions: {
    // 获取未读消息
    async getUnreadCountAction() {
      const res = await getUnreadCountRequest()
      if (res.status === 200) {
        this.unread = res.data
      }
    },
    async getNotifyAction() {
      // 最后一个msgid 做分页
      const lastFeed = this.notify[this.notify.length - 1]
      const nextId = lastFeed ? lastFeed.notifyId : '0'
      if (this.notifyType === 'likeAndCollect') {
        this.unread.like = 0
        this.unread.collect = 0
        this.getLikeAndCollectAction(nextId)
      } else if (this.notifyType === 'focus') {
        this.unread.follow = 0
        this.getFocusAction(nextId)
      } else if (this.notifyType === 'comment') {
        this.unread.at = 0
        this.unread.comment = 0
        this.getCommentNotifyAction(nextId)
      } else {
        this.unread.commission = 0
        this.getCommissionAction(nextId)
      }
    },
    // 获取点赞或收藏提醒
    async getLikeAndCollectAction(nextId: string) {
      const res = await getLikeAndCollectRequest(nextId)
      if (res.status === 200) {
        const length = res.data.length
        if (length < 20) this.isEnd = true
        if (length == 0) this.noHavMsg = true
        res.data.forEach((item) => {
          const cover = item.content.cover
          const author = item.content.author
          if (item.targetType == 'aw' || item.content.ownType == 'aw') {
            item.content.cover = formatPicUrl(cover, author, 'cover', 'm')
          } else {
            item.content.cover = cover
              ? formatPicUrl(cover, author, 'trends', 'xs')
              : ''
          }

          const { avatar, userId } = item.sender
          item.sender.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
          this.notify.push(item)
        })
      }
    },
    //  获取关注提醒
    async getFocusAction(nextId: string) {
      const res = await getFocusNotifyRequest(nextId)
      if (res.status === 200) {
        const length = res.data.length
        if (length < 20) this.isEnd = true
        if (length == 0) this.noHavMsg = true
        res.data.forEach((item) => {
          const { avatar, userId } = item.sender
          item.sender.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
          this.notify.push(item)
        })
      }
    },
    // 获取评论提醒
    async getCommentNotifyAction(nextId: string) {
      const res = await getCommentRequest(nextId)
      if (res.status == 200) {
        const length = res.data.length
        if (length < 20) this.isEnd = true
        if (length == 0) this.noHavMsg = true
        res.data.forEach((item) => {
          const cover = item.content.cover
          const author = item.content.author
          if (item.content.ownType == 'aw') {
            item.content.cover = formatPicUrl(cover, author, 'cover', 'm')
          } else {
            item.content.cover = cover
              ? formatPicUrl(cover, author, 'trends', 'xs')
              : ''
          }
          const { avatar, userId } = item.sender
          item.sender.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
          this.notify.push(item)
        })
      }
    },
    // 获取约稿提醒
    async getCommissionAction(nextId: string) {
      const res = await getCommissionRequest(nextId)
      if (res.status === 200) {
        const length = res.data.length
        if (length < 20) this.isEnd = true
        if (length == 0) this.noHavMsg = true
        res.data.forEach((item) => {
          const { cover, owner } = item.content
          const { avatar, userId } = item.sender
          item.content.cover = formatPicUrl(cover, owner, 'commission', '')
          item.sender.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
          this.notify.push(item)
        })
      }
    },
    //发布评论信息
    async postCommentAction(payload: IPostCommentData) {
      const result = await postCommentRequest(payload)
      if (result.status === 200) {
        addOwnComment(result.data)
        notification({
          type: 'success',
          title: '回复评论',
          zIndex: 10000,
          message: '回复成功 ~'
        })
      }
    },
    // 查看评论详情
    async getCommentDetail(rid: string, type: 'aw' | 'tr') {
      const res = await getOneRootCommentRequest(rid, type)
      if (res.status == 200) {
        const { avatar, userId } = res.data
        res.data.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
        this.commentDetail = res.data
      }
      return res
    },
    //获取评论数据的子评论
    async getChildCommentAction(type: 'aw' | 'tr') {
      //如果最后一组评论已经获取到不再发送
      if (this.childCommentEnd) return
      const rootId = this.commentDetail!.cId
      let childComments = this.commentDetail!.childComments
      if (childComments == null) {
        childComments = []
        this.commentDetail!.childComments = []
      }
      const last = childComments[childComments.length - 1]
      const { cId = '0', sore = 1 } = last || {}
      const result = await getChildCommentRequest(rootId, type, cId, sore)
      if (result.status === 200) {
        changeChildComment(result.data)
      }
      if (result.status === 1017) {
        this.childCommentEnd = true
      }
    },
    // 点赞评论
    async postLikeCommentAction(data: IPostLikeData) {
      const res = await postLikeCommentRequest(data)
      if (res.status === 200) {
        handleCommentLike(res.data)
      }
    },
    //关注请求
    async postUserFocusAction(isFocus: 0 | 1 | 2, userId: string) {
      const isCancel = isFocus > 0
      const result = await postUserFocusRequest(userId, isCancel)
      if (result.status === 200) {
        const notify = this.notify.find((i) => i.sender.userId == userId)
        if (!notify) return
        if (!result.data.isCancel) {
          notify.content.isFocus = 2
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          notify.content.isFocus = 0
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
        }
      }
    }
  }
})

export default useStore
