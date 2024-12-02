import { defineStore } from 'pinia'
import type { ITrendPageStore, IShowTrend } from './type'
import {
  getHotTopicRequest,
  getFeedsRequest,
  getRecommendUserRequest,
  getNewTrendRequest,
  getHotTrendRequest,
  postTrendLikeRequest,
  deleteTrendRequest,
  updatePermissionRequest
} from '@/service/trend-page'
import {
  postUserFocusRequest,
  postReportRequest,
  getUserPanelRequest
} from '@/service/common'
import type { IPostReport } from '@/service/common/type'
import { getUserHomeTrendRequest } from '@/service/user-home'
import type {
  ITrend,
  IInteractData,
  IPermission
} from '@/service/trend-page/type'
import useMainStore from '@/stores/module/main'
import { formatPicUrl } from '@/utils/data-format'
import { formatTrendData, handleLike } from './handle'
import { notification } from '@/components/notification'

const useTrendStore = defineStore('trendPage', {
  state: (): ITrendPageStore => ({
    hotTags: [],
    trends: [],
    recommendUser: [],
    userPanel: null,
    loadType: 'hot',
    isEnd: false,
    waiting: false,
    noHaveTrend: false
  }),
  actions: {
    // 获取热门tag
    async getHotTopicAction() {
      if (this.hotTags.length) return
      const res = await getHotTopicRequest()
      if (res.status == 200) {
        this.hotTags = res.data
      }
    },
    async getFullData() {
      // 最后一个msgid 做分页
      const lastFeed = this.trends[this.trends.length - 1]
      const msgId = lastFeed ? lastFeed.trendId : '0'
      let result
      if (this.loadType == 'focus') {
        result = await getFeedsRequest(msgId)
      } else if (this.loadType == 'new') {
        result = await getNewTrendRequest(msgId)
      } else {
        result = await getHotTrendRequest()
      }
      if (result.status === 200) {
        const length = result.data.length
        for (let index = 0; index < length; index++) {
          const item = result.data[index] as IShowTrend
          this.trends.push(formatTrendData(item))
        }
        //小于 30 说明最后一组
        if (length < 30) return (this.isEnd = true)
      }
    },
    //获取用户面板资料
    async getUserProfileAction(userId: string) {
      //发送网络请求
      const result = await getUserPanelRequest(userId)
      if (result.status === 200) {
        const mainStore = useMainStore()
        const { avatar, banner, userId } = result.data
        result.data.avatar = formatPicUrl(avatar, userId, 'avatars', 's')
        result.data.banner = formatPicUrl(banner, userId, 'banners', 's')
        this.userPanel = result.data
        if (mainStore.userId == this.userPanel.userId)
          this.userPanel.isOwner = true
      }
    },
    //获取热门推荐用户数据
    async getRecommendUserAction() {
      const result = await getRecommendUserRequest()
      if (result.status === 200 && result.data) {
        this.recommendUser = []
        const mainStore = useMainStore()
        for (const item of result.data) {
          if (mainStore.userId == item.userId) continue
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.artworks.forEach((art) => {
            art.cover = formatPicUrl(art.cover, art.userId, 'cover', 'm')
          })
          const tags = item.tags.split(',')
          this.recommendUser.push({ ...item, tags })
        }
      }
    },
    //点赞动态
    async postLikeAction(data: ITrend) {
      const { userId: authorId, trendId: msgId, type } = data
      const isCancel = data.interact.isLike
      const postData: IInteractData = { authorId, msgId, isCancel, type }

      const res = await postTrendLikeRequest(postData)
      if (res.status === 200) {
        handleLike(res.data)
        if (!res.data.isCancel) {
          notification({
            type: 'success',
            title: '点赞动态',
            message: '作者已收到您的点赞~',
            zIndex: 9999
          })
        } else {
          notification({
            type: 'success',
            title: '点赞动态',
            message: '取消点赞成功~',
            zIndex: 9999
          })
        }
      }
      return res
    },
    //用户首页时请求 动态
    async getUserHomeTrendAction(userId: string) {
      // 最后一个msgid 做分页
      const lastFeed = this.trends[this.trends.length - 1]
      const next = lastFeed ? lastFeed.trendId : '0'
      this.waiting = true
      const result = await getUserHomeTrendRequest(userId, next)
      this.waiting = false
      if (result.status == 1032) {
        this.noHaveTrend = true
        this.isEnd = true
      }
      if (result.status === 200) {
        const length = result.data.length
        for (let index = 0; index < length; index++) {
          const item = result.data[index] as IShowTrend
          this.trends.push(formatTrendData(item, true))
        }
        //小于 30 说明最后一组
        if (length < 30) this.isEnd = true
      }
    },
    //删除动态
    async deleteTrendAction(trendId: string) {
      const res = await deleteTrendRequest(trendId)
      return res
    },
    //更新动态权限
    async updatePermissionAction(data: IPermission) {
      const res = await updatePermissionRequest(data)
      return res
    },
    //关注推荐用户
    async postUserFocusAction(focusId: string, isFocus: 0 | 1) {
      const isCancel = isFocus > 0
      const result = await postUserFocusRequest(focusId, isCancel)
      if (result.status === 200) {
        const user = this.recommendUser.find((i) => i.userId === focusId)
        if (!result.data.isCancel) {
          user!.isFocus = 1
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          user!.isFocus = 0
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
        }
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
    }
  }
})

export default useTrendStore
