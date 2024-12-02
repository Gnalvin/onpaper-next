import { defineStore } from 'pinia'
import type { IUserShowState, focusPayloadType } from './type'
import { getAllUserShowRequest } from '@/service/all-user'
import { postUserFocusRequest } from '@/service/common'
import { formatPicUrl } from '@/utils/data-format'
import { notification } from '@/components/notification'

const useUserShowStore = defineStore('allUserShow', {
  state: (): IUserShowState => ({
    users: [],
    loading: false,
    isEnd: false,
    maxPage: 0,
    query: {
      next: '0',
      type: 'hot'
    }
  }),
  actions: {
    async getUserShowAction() {
      this.maxPage += 1
      this.loading = true
      const last = this.users[this.users.length - 1]
      if (this.query.type == 'hot') {
        this.query.next = this.maxPage - 1 + ''
      } else if (this.query.type == 'new') {
        this.query.next = last?.userId ?? '0'
      } else {
        this.query.next = last?.artworks[0].artworkId ?? '0'
      }

      const res = await getAllUserShowRequest(this.query)
      this.loading = false
      if (res.status === 200) {
        res.data.userData.forEach((item) => {
          item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          item.artworks.forEach((art) => {
            art.cover = formatPicUrl(art.cover, item.userId, 'cover', 'm')
          })
          this.users.push(item)
        })
        this.isEnd = res.data.isEnd
      }
    },
    //关注作者请求
    async postUserFocusAction(payload: focusPayloadType) {
      const isCancel = payload.isFocus > 0
      const result = await postUserFocusRequest(payload.userId, isCancel)
      //请求成功后处理
      if (result.status === 200) {
        const userItem = this.users.find(
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

export default useUserShowStore
