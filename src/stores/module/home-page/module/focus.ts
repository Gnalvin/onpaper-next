import { defineStore } from 'pinia'
import type { IFocusAreaState } from '../type'
import {
  getUserFocusRequest,
  getUserFocusArtworkRequest,
  searchFocusUserRequest
} from '@/service/home-page'
import { getUserHomeArtworkRequest } from '@/service/user-home'
import useMainStore from '@/stores/module/main'
import { formatPicUrl } from '@/utils/data-format'

const useStore = defineStore('focusAreaStore', {
  state: (): IFocusAreaState => ({
    focusList: [],
    userArtworks: [],
    feeds: [],
    page: 1,
    isEnd: false,
    isZero: false,
    isUserEnd: false,
    isNoFocus: 'unknown',
    searchUser: [],
    choseUser: {
      userId: 'all',
      userName: '关注画师',
      avatar: ''
    }
  }),
  actions: {
    // 获取用户关注列表
    async getUserFocusLitsAction(page: number) {
      const mainStore = useMainStore()
      const res = await getUserFocusRequest(mainStore.userId, page)
      if (res.status == 1027) return (this.isNoFocus = 'yes')
      if (res.status == 200) {
        this.isNoFocus = 'no'
        if (!res.data) return (this.isUserEnd = true)
        for (const item of res.data) {
          //如果搜索时添加过 则不添加
          const isHave = this.focusList.findIndex(
            (i) => i.userId == item.userId
          )
          if (isHave !== -1) continue
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          this.focusList.push(item)
        }
        // 一组50 小于50个到头
        if (res.data.length < 50) this.isUserEnd = true
      }
    },
    async getArtwork(isReSet = false) {
      // 每次切换选择用户 重置
      if (isReSet) {
        this.page = 1
        this.isEnd = false
        this.isZero = false
        this.userArtworks = []
        this.feeds = []
      }
      if (this.choseUser.userId === 'all') {
        await this.getArtFeedsAction()
      } else {
        await this.getUserArtworkAction()
      }
    },
    //获取用户作品
    async getUserArtworkAction() {
      const userId = this.choseUser.userId
      const result = await getUserHomeArtworkRequest(userId, this.page, 'now')
      // 没有作品
      if (result.status == 1016) return (this.isZero = true)
      if (result.status === 200) {
        const artworks = result.data.artworks ? result.data.artworks : []
        const length = artworks.length
        // 合成封面
        for (let index = 0; index < length; index++) {
          const item = artworks[index]
          item.cover = formatPicUrl(item.cover, userId, 'cover', 'm')
          this.userArtworks.push(item)
        }
        //小于 30 说明最后一组
        if (length < 30) {
          this.isEnd = true
          return
        }
        this.page += 1
      }
    },
    // 获取关注的用户最近作品
    async getArtFeedsAction() {
      // 最后一个msgid 做分页
      const lastFeed = this.feeds[this.feeds.length - 1]
      const msgId = lastFeed ? lastFeed.artworkId : '0'
      const result = await getUserFocusArtworkRequest(msgId)
      if (result.status === 200) {
        const mainStore = useMainStore()
        const length = result.data.length
        for (let index = 0; index < length; index++) {
          const item = result.data[index]
          // 没有id 的是不显示的作品
          if (!item.artworkId) continue
          item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
          item.userAvatar = formatPicUrl(
            item.userAvatar,
            item.userId,
            'avatars',
            's'
          )
          item.isOwner = mainStore.userId === item.userId
          item.isFocus = true
          this.feeds.push(item)
        }
        // 说明没有作品
        if (this.feeds.length == 0 && msgId == '0') {
          this.isZero = true
          return
        }
        //小于 30 说明最后一组
        if (length < 30) return (this.isEnd = true)
      }
    },
    //在关注中的用户查找
    async searchFocusUserAction(search: string) {
      const res = await searchFocusUserRequest(search)
      if (res.status == 200) {
        if (!res.data) res.data = []
        for (const item of res.data) {
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
        }
        this.searchUser = res.data
      }
    }
  }
})

export default useStore
