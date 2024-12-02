import { defineStore } from 'pinia'
import type { ITagPageState, focusPayloadType } from './type'
import {
  getGetTagAboutArtRequest,
  getGetTagAboutUserRequest,
  getRelevantTagRequest
} from '@/service/tag-page'
import { postUserFocusRequest } from '@/service/common'
import { formatPicUrl, handleFormatUrl } from '@/utils/data-format'
import { notification } from '@/components/notification'

const useTagPageStore = defineStore('tagPage', {
  state: (): ITagPageState => ({
    tagName: '',
    totalArt: 0,
    tagId: '',
    relevantTagList: [],
    artworksByHot: [],
    artworksByTime: [],
    recommendUsers: [],
    noHaveArts: false
  }),
  actions: {
    // 获取相关的 tag
    async getRelevantTagAction(tagName: string) {
      const res = await getRelevantTagRequest(tagName, this.tagId)
      if (res.status == 200) {
        this.relevantTagList = res.data.tags
        this.totalArt = res.data.total
        this.tagName = res.data.tagName
      }
    },
    //获取相关的作品
    async getTagAboutArtAction(
      tagName: string,
      sort: 'score' | 'time',
      page: number
    ) {
      this.artworksByHot = []
      this.artworksByTime = []
      this.noHaveArts = false
      const res = await getGetTagAboutArtRequest(
        tagName,
        sort,
        page,
        this.tagId
      )
      if (res.status == 200) {
        // 后端的数据不一定实时 可以尽量补一下
        const nowTotal = (page - 1) * 36 + res.data.length
        if (this.totalArt < nowTotal) this.totalArt = nowTotal
        // 不同排序不同赋值
        if (sort == 'score') {
          this.artworksByHot = handleFormatUrl(res.data)
        } else {
          this.artworksByTime = handleFormatUrl(res.data)
        }
      } else {
        this.noHaveArts = true
      }
    },
    //获取相关的用户
    async getTagAboutUserAction(tagName: string) {
      this.recommendUsers = []
      const res = await getGetTagAboutUserRequest(tagName, this.tagId)
      if (res.status == 200) {
        res.data.forEach((item) => {
          // 拼接 图像地址
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.artworks.forEach((art) => {
            art.cover = formatPicUrl(art.cover, item.userId, 'cover', 'm')
          })
        })
        this.recommendUsers = res.data
      }
    },
    //关注作者请求
    async postUserFocusAction(payload: focusPayloadType) {
      const isCancel = payload.isFocus > 0
      const result = await postUserFocusRequest(payload.userId, isCancel)
      //请求成功后处理
      if (result.status === 200) {
        const userItem = this.recommendUsers.find(
          (item) => item.userId == payload.userId
        )
        if (!result.data.isCancel) {
          userItem!.isFocus = 1
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
        } else {
          userItem!.isFocus = 0
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

export default useTagPageStore
