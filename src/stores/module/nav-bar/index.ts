import { defineStore } from 'pinia'
import type { INavBarState } from './type'
import {
  getUserNavDataRequest,
  getInvitationCodeRequest
} from '@/service/nav-bar'
import useMainStore from '../main'
import { hasOwn } from '@/utils/verify-type'
import { formatPicUrl } from '@/utils/data-format'

const useNavBarStore = defineStore('navbar', {
  state: (): INavBarState => ({
    following: 0,
    fans: 0,
    likes: 0,
    isTransparentNav: false,
    isShowPanel: false,
    notifyUnread: 0,
    messageUnread: 0,
    invitationCode: []
  }),
  actions: {
    //获取导航栏的用户信息
    async getUserNavDataAction() {
      const mainStore = useMainStore()
      if (mainStore.userId === '') return
      //发送网络请求
      const result = await getUserNavDataRequest(mainStore.userId)
      if (result.status === 200) {
        for (const key in result.data) {
          if (hasOwn(this.$state, key)) {
            const item = result.data[key]
            this.$state[key] = item
          }
        }
        const { avatar, fans, following, likes, notifyUnread } = result.data
        this.following = following
        this.fans = fans
        this.likes = likes
        this.notifyUnread = notifyUnread
        mainStore.avatar = avatar
      }
    },
    async getInvitationCodeAction() {
      //发送网络请求
      const result = await getInvitationCodeRequest()
      if (result.status === 200) {
        result.data.map((item) => {
          if (item.userId !== '0') {
            item.avatar = formatPicUrl(item.avatar, item.userId, 'avatars', 's')
          }
        })
        this.invitationCode = result.data
      }
    }
  }
})

export default useNavBarStore
