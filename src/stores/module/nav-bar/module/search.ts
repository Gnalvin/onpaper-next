import { defineStore } from 'pinia'
import type { ISearchState } from '../type'
import { searchTagNameRequest, searchUserNameRequest } from '@/service/nav-bar'
import { getHotTagRequest } from '@/service/common'
import { getRelevantTopic } from '@/service/trend-page'
import { formatPicUrl, formatMatchText } from '@/utils/data-format'

const useSearchStore = defineStore('searchStore', {
  state: (): ISearchState => ({
    hotTag: [],
    history: [],
    searchText: '',
    oldTag: '',
    oldUser: '',
    oldTopic: '',
    searchTagResult: {
      likeData: [],
      searchData: []
    },
    searchUserResult: {
      likeData: [],
      searchData: []
    },
    searchTopicResult: [],
    searchType: 'tag'
  }),
  actions: {
    // 获取热门tag
    async getHotTagAction() {
      if (this.hotTag.length) return
      const res = await getHotTagRequest()
      if (res.status == 200) {
        this.hotTag = res.data ?? []
        this.hotTag = this.hotTag.slice(0, 13)
      }
    },
    async searchAction() {
      if (this.searchType === 'tag') {
        if (this.oldTag === this.searchText) return
        this.searchTagNameAction()
        this.oldTag = this.searchText
      } else if (this.searchType === 'user') {
        if (this.oldUser === this.searchText) return
        this.searchUserNameAction()
        this.oldUser = this.searchText
      } else {
        if (this.oldTopic === this.searchText) return
        this.getRelevantTopicAction()
        this.oldTopic = this.searchText
      }
    },
    //通过标签名搜索
    async searchTagNameAction() {
      if (!this.searchText) return
      const res = await searchTagNameRequest(this.searchText)
      if (res.status == 200) {
        this.searchTagResult = res.data as any
        if (!this.searchTagResult.likeData) return
        this.searchTagResult.likeData.forEach((item) => {
          item.showName = formatMatchText(this.searchText, item.tagName)
        })
      }
    },
    //搜索用户名
    async searchUserNameAction() {
      if (!this.searchText) return
      const res = await searchUserNameRequest(this.searchText)
      if (res.status == 200) {
        res.data.likeData?.forEach((item) => {
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.showName = formatMatchText(this.searchText, item.userName)
        })
        res.data.searchData?.forEach((item) => {
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.showName = formatMatchText(this.searchText, item.userName)
        })
        this.searchUserResult = res.data
      }
    },
    //模糊查询相关话题
    async getRelevantTopicAction() {
      if (!this.searchText) return
      const res = await getRelevantTopic(this.searchText)
      if (res.status === 200) {
        res.data?.forEach((t) => {
          t.showText = formatMatchText(this.searchText, t.text)
        })
        this.searchTopicResult = res.data
      }
    }
  }
})

export default useSearchStore
