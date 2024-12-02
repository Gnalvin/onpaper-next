import { defineStore } from 'pinia'
import type { IArtworkState } from './type'
import type { IPostCommentData, IPostLikeData } from '@/service/comment/type'
import {
  getArtworkInfoRequest,
  postArtworkCollectRequest,
  postArtworkLikeRequest,
  deleteArtworkInfoRequest
} from '@/service/artwork'
import { postUserFocusRequest, postReportRequest } from '@/service/common'
import type { IPostReport } from '@/service/common/type'
import {
  postCommentRequest,
  getRootCommentRequest,
  getChildCommentRequest,
  postLikeCommentRequest,
  deleteCommentRequest
} from '@/service/comment'
import {
  saveArtInfo,
  saveComment,
  addRootComment,
  changeChildComment,
  addChildComment,
  addOwnComment,
  handleCommentLike,
  handleCommentDelete
} from './handle'
import router from '@/router'
import { notification } from '@/components/notification'

const useArtworkDetailStore = defineStore('artworkDetail', {
  state: (): IArtworkState => ({
    isOwn: false,
    noExist: false,
    artInfo: {
      artworkId: '',
      title: '',
      userId: '',
      picCount: 0,
      cover: '',
      zone: '',
      whoSee: 'privacy',
      adults: false,
      comSetting: 'onlyFans',
      copyright: 'OWNER',
      vStatus: 0,
      vTag: '',
      likes: 0,
      views: 0,
      collects: 0,
      intro: '',
      avatarName: '',
      userName: '',
      isOwner: false,
      createAT: '',
      tag: [],
      userCount: {
        likes: 0,
        fans: 0,
        collects: 0
      },
      interact: {
        isCollect: false,
        isFocusAuthor: 0,
        isLike: false
      }
    },
    artworks: [],
    authorOtherArt: [],
    comments: [],
    tempComments: [],
    commentEnd: false,
    zeroComment: false,
    childCommentEnd: false,
    lastChildComment: {
      cId: '0',
      sore: 1
    },
    windowSize: 1201
  }),
  actions: {
    //获取单个作品信息用于展示
    async getArtworkInfoAction(artId: string) {
      const res = await getArtworkInfoRequest(artId)
      // 如果作品不存在
      if (res.status === 1019) {
        this.noExist = true
        setTimeout(() => {
          router.replace({ name: 'HomePage' })
        }, 4500)
      }
      if (res.status == 200) {
        // 成功之后获取评论
        this.getArtworkCommentAction(artId)
        saveArtInfo(res.data)
      }
    },
    //获取作品评论数据
    async getArtworkCommentAction(artId: string) {
      //每次获取数据重置数据
      this.zeroComment = false
      this.commentEnd = false
      const result = await getRootCommentRequest(artId, 'aw')
      //如果请求成功有评论 保存数据
      if (result.status === 200) saveComment(result.data)
      //如果没有评论
      if (result.status === 1017) {
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
      const artId = this.artInfo.artworkId
      const lastComment = this.comments[this.comments.length - 1]
      const { cId, sore } = lastComment
      const result = await getRootCommentRequest(artId, 'aw', cId, sore)
      if (result.status === 200) addRootComment(result.data)
      if (result.status === 1017) this.commentEnd = true
    },
    //获取评论数据的子评论
    async getChildCommentAction(rid: string) {
      //每次获取数据重置数据
      this.childCommentEnd = false
      const result = await getChildCommentRequest(rid, 'aw')
      if (result.status === 200) {
        const last = result.data[result.data.length - 1]
        this.lastChildComment.cId = last.cId
        this.lastChildComment.sore = last.sore
        changeChildComment(rid, result.data)
      }
    },
    //获取子评论翻页数据
    async getChildCommentNextAction(rid: string) {
      //如果最后一组评论已经获取到不再发送
      if (this.childCommentEnd) return
      const { cId, sore } = this.lastChildComment
      const result = await getChildCommentRequest(rid, 'aw', cId, sore)
      if (result.status === 200) {
        const last = result.data[result.data.length - 1]
        this.lastChildComment.cId = last.cId
        this.lastChildComment.sore = last.sore
        addChildComment(rid, result.data)
      }
      if (result.status === 1017) this.childCommentEnd = true
    },
    //发布评论信息
    async postArtworkCommentAction(payload: IPostCommentData) {
      const result = await postCommentRequest(payload)
      if (result.status === 200) {
        addOwnComment(result.data)
        notification({
          type: 'success',
          title: '发布评论',
          message: '发布成功 ~'
        })
      }
    },
    //收藏作品请求
    async postArtworkCollectAction() {
      const isCancel = this.artInfo.interact.isCollect
      const result = await postArtworkCollectRequest(
        this.artInfo.artworkId,
        this.artInfo.userId,
        isCancel
      )
      if (result.status === 200) {
        if (!isCancel) {
          this.artInfo.collects++
          this.artInfo.interact.isCollect = true
          notification({
            type: 'success',
            title: '收藏作品',
            message: '收藏成功~'
          })
        } else {
          this.artInfo.collects--
          this.artInfo.interact.isCollect = false
          notification({
            type: 'success',
            title: '收藏作品',
            message: '取消收藏成功~'
          })
        }
      }
    },
    //点赞作品请求
    async postArtworkLikeAction() {
      const isCancel = this.artInfo.interact.isLike
      const result = await postArtworkLikeRequest(
        this.artInfo.artworkId,
        this.artInfo.userId,
        isCancel
      )
      if (result.status === 200) {
        if (!isCancel) {
          this.artInfo.likes++
          this.artInfo.interact.isLike = true
          notification({
            type: 'success',
            title: '点赞作品',
            message: '作者已收到您的点赞~'
          })
        } else {
          this.artInfo.likes--
          this.artInfo.interact.isLike = false
          notification({
            type: 'success',
            title: '点赞作品',
            message: '取消点赞成功~'
          })
        }
      }
    },
    //关注作者请求
    async postUserFocusAction() {
      const isCancel = this.artInfo.interact.isFocusAuthor > 0
      const focusId = this.artInfo.userId
      const result = await postUserFocusRequest(focusId, isCancel)
      if (result.status === 200) {
        if (!result.data.isCancel) {
          this.artInfo.interact.isFocusAuthor = 1
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          this.artInfo.interact.isFocusAuthor = 0
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
        }
      }
    },
    // 删除作品请求
    async deleteArtworkAction() {
      const res = await deleteArtworkInfoRequest(this.artInfo.artworkId)
      return res
    },
    // 点赞评论
    async postLikeCommentAction(data: IPostLikeData) {
      const res = await postLikeCommentRequest(data)
      if (res.status === 200) {
        handleCommentLike(res.data)
      }
    },
    // 提交举报
    async postReportAction(report: IPostReport) {
      const res = await postReportRequest(report)
      if (res.status === 200) {
        notification({
          type: 'success',
          title: '举报成功',
          message: '感谢你的举报，我们会尽快核实。'
        })
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

export default useArtworkDetailStore
