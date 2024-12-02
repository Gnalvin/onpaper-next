import { defineStore } from 'pinia'
import type { IHomeAreaState, focusPayloadType } from '../type'
import {
  getArtworkRankRequest,
  getHotArtworkRequest,
  getRecommendUserRequest,
  getZoneArtworkRequest
} from '@/service/home-page'
import { getChannelArtworkRequest } from '@/service/artwork/show'
import { postUserFocusRequest, getTopUseRequest } from '@/service/common'
import { notification } from '@/components/notification'
import { formatPicUrl, handleFormatUrl } from '@/utils/data-format'
import type { IBaseArtwork } from '@/service/home-page/type'

const useHomeAreaStore = defineStore('homeAreaStore', {
  state: (): IHomeAreaState => ({
    artworkRank: [],
    hotArtwork: [],
    loadMoreSpace: [],
    recommendUser: [],
    hotTags: []
  }),
  actions: {
    // 获取当天热门tag
    async getHotTagAction() {
      const res = await getTopUseRequest()
      if (res.status == 200) {
        this.hotTags = res.data ?? []
      }
    },
    //获取热门作品数据
    async getHotArtworkAction() {
      const result = await getHotArtworkRequest()
      if (result.status === 200) {
        this.hotArtwork = handleFormatUrl(result.data)
      }
    },
    //获取当日排行数据
    async getArtworkRankAction() {
      const result = await getArtworkRankRequest()
      if (result.status === 200) {
        this.artworkRank = handleFormatUrl(result.data)
      }
    },
    //获取最新作品数据
    async getNewArtworkAction() {
      const query = {
        zone: 'all',
        next: '0',
        page: 1,
        sort: 'new' as 'new' | 'hot'
      }
      const result = await getChannelArtworkRequest(query)
      if (result.status === 200) {
        const area = {
          title: '最新作品',
          goToRouter: {
            name: 'ArtworkPage',
            query: { zone: 'all', sort: 'new' }
          },
          artwork: handleFormatUrl(result.data.slice(0, 12))
        }
        this.loadMoreSpace[this.loadMoreSpace.length - 1] = area
        this.initZoneArt()
      }
    },
    async initZoneArt() {
      const tempArr = []
      for (let index = 0; index < 12; index++) {
        tempArr.push({})
      }
      this.loadMoreSpace.push({
        title: '',
        artwork: tempArr as IBaseArtwork[]
      })
    },
    // 下拉加载更多分区
    async getZoneArtworkAction(type: number) {
      const result = await getZoneArtworkRequest(type)
      if (result.status === 200) {
        const area = {
          title: result.data.title + '推荐作品',
          goToRouter: {
            name: 'ArtworkPage',
            query: { zone: result.data.title, sort: 'hot' }
          },
          artwork: handleFormatUrl(result.data.artwork.slice(0, 12))
        }
        this.loadMoreSpace[this.loadMoreSpace.length - 1] = area
        if (type < 8) this.initZoneArt()
      }
    },
    //获取热门推荐用户数据
    async getRecommendUserAction() {
      const result = await getRecommendUserRequest()
      if (result.status === 200) {
        this.recommendUser = result.data?.map((item) => {
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.artworks.forEach((art) => {
            art.cover = formatPicUrl(art.cover, art.userId, 'cover', 'm')
          })
          return item
        })
      }
    },
    //关注作者请求
    async postUserFocusAction(payload: focusPayloadType) {
      const isCancel = payload.isFocus
      const result = await postUserFocusRequest(payload.userId, isCancel)
      if (result.status === 200) {
        const userItem = this.recommendUser.find((item) => {
          return item.userId === result.data.focusId
        })
        if (!result.data.isCancel) {
          userItem!.isFocus = true
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          userItem!.isFocus = false
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

export default useHomeAreaStore
