import { defineStore } from 'pinia'
import type { ITrendDetailStore, IShowTrend } from './type'
import { getTrendDetailRequest } from '@/service/trend-page'
import {
  postCommentRequest,
  getRootCommentRequest,
  getChildCommentRequest,
  postLikeCommentRequest,
  deleteCommentRequest
} from '@/service/comment'
import { postUserFocusRequest } from '@/service/common'
import {
  formatTrendData,
  saveComment,
  addRootComment,
  addOwnComment,
  changeChildComment,
  handleCommentLike,
  handleCommentDelete
} from './handle'
import { notification } from '@/components/notification'
import type { IPostCommentData, IPostLikeData } from '@/service/comment/type'

const useTrendDetailStore = defineStore('trendDetail', {
  state: (): ITrendDetailStore => ({
    trendDetail: null,
    comments: [],
    commentDetail: null,
    commentEnd: false,
    zeroComment: false,
    childCommentEnd: false,
    isNoExist: false
  }),
  actions: {
    // 获取动态详情
    async getTrendDetailAction(trendId: string, type: string) {
      const res = await getTrendDetailRequest(trendId, type)
      if (res.status === 1021) {
        this.isNoExist = true
        return
      }
      if (res.status === 200 && res.data) {
        this.trendDetail = formatTrendData(res.data as IShowTrend)
      }
    },
    //获取动态评论
    async getTrendCommentAction(trendId: string, type: string) {
      //每次获取数据重置数据
      this.zeroComment = false
      this.commentEnd = false
      const res = await getRootCommentRequest(trendId, type)
      //如果请求成功有评论 保存数据
      if (res.status === 200) saveComment(res.data)
      //如果没有评论
      if (res.status === 1017) {
        //同时重置数据
        saveComment([])
        this.zeroComment = true
      }
    },
    //获取根评论翻页数据
    async getRootCommentNextAction() {
      //如果最后一组评论已经获取到不再发送
      if (this.commentEnd) return
      if (this.comments.length == 0) return
      const tId = this.trendDetail!.trendId
      const tType = this.trendDetail!.type
      const lastComment = this.comments[this.comments.length - 1]
      const { cId, sore } = lastComment
      const result = await getRootCommentRequest(tId, tType, cId, sore)
      if (result.status === 200) addRootComment(result.data)
      if (result.status === 1017) this.commentEnd = true
    },
    //获取评论数据的子评论
    async getChildCommentAction() {
      //如果最后一组评论已经获取到不再发送
      if (this.childCommentEnd) return
      const rootId = this.commentDetail!.cId
      const type = this.trendDetail!.type
      const childComments = this.commentDetail!.childComments!
      const last = childComments[childComments.length - 1]
      const { cId = '0', sore = 1 } = last || {}
      const result = await getChildCommentRequest(rootId, type, cId, sore)
      if (result.status === 200) {
        changeChildComment(result.data)
      }
    },
    //发布评论信息
    async postCommentAction(payload: IPostCommentData) {
      const result = await postCommentRequest(payload)
      if (result.status === 200) {
        addOwnComment(result.data)
        notification({
          type: 'success',
          title: '发布评论',
          zIndex: 10000,
          message: '发布成功 ~'
        })
      }
    },
    // 点赞评论
    async postLikeCommentAction(data: IPostLikeData) {
      const res = await postLikeCommentRequest(data)
      if (res.status === 200) {
        handleCommentLike(res.data)
      }
    },
    //关注作者请求
    async postUserFocusAction() {
      if (!this.trendDetail) return
      const isCancel = this.trendDetail.interact.isFocusAuthor > 0
      const focusId = this.trendDetail.userId
      const result = await postUserFocusRequest(focusId, isCancel)
      if (result.status === 200) {
        if (!result.data.isCancel) {
          this.trendDetail.interact.isFocusAuthor = 1
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          this.trendDetail.interact.isFocusAuthor = 0
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
        }
      }
    },
    // 删除评论
    async delCommentAction(cid: string) {
      const res = await deleteCommentRequest(cid)
      if (res.status === 200) {
        handleCommentDelete(cid)
        notification({
          type: 'success',
          title: '删除成功',
          message: '评论已删除。'
        })
      }
    }
  }
})

export default useTrendDetailStore
