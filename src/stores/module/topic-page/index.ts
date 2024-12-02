import { defineStore } from 'pinia'
import type { ITopicPageState } from './type'
import type { IShowTrend } from '../trend/type'
import {
  getTopicDetailRequest,
  getTopicTrendRequest
} from '@/service/topic-page'
import { formatPicUrl } from '@/utils/data-format'
import { formatTrendData } from '../trend/handle'
import { getHotTopicRequest } from '@/service/trend-page'
import useTrendStore from '../trend'

const useTopicPageStore = defineStore('topicPage', {
  state: (): ITopicPageState => ({
    topicDetail: {
      topicId: '',
      text: '',
      intro: '',
      count: 0,
      userId: '',
      userName: '',
      avatar: ''
    },
    sort: 'hot',
    hotTopic: [],
    noHaveTrends: false
  }),
  actions: {
    // 获取话题详情
    async getTopicDetailAction(topicId: string) {
      const trendStore = useTrendStore()
      const res = await getTopicDetailRequest(topicId)
      trendStore.trends = []
      this.noHaveTrends = false
      if (res.status == 200) {
        res.data.avatar = formatPicUrl(
          res.data.avatar,
          res.data.userId,
          'avatars',
          's'
        )
        this.topicDetail = res.data
        return
      }
    },
    // 获取话题动态
    async getTopicTrendAction(page: number) {
      const topicId = this.topicDetail.topicId
      const trendStore = useTrendStore()
      const res = await getTopicTrendRequest(topicId, this.sort, page)
      if (res.status === 200) {
        trendStore.isEnd = res.data.length < 20 ? true : false
        res.data.forEach((item) => {
          trendStore.trends.push(formatTrendData(item as IShowTrend))
        })
        return
      }
      if (res.status === 1021) {
        this.noHaveTrends = true
      }
    },
    // 获取热门tag
    async getHotTopicAction() {
      if (this.hotTopic.length) return
      const res = await getHotTopicRequest()
      if (res.status == 200) {
        this.hotTopic = res.data
      }
    }
  }
})

export default useTopicPageStore
