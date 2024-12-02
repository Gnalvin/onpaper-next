import { defineStore } from 'pinia'
import type { IHomeState } from './type'
import { postUserFocusRequest } from '@/service/common'
import useCollectStore from './module/collect'
import useArtworkStore from './module/artwork'
import useTrendStore from '@/stores/module/trend'
import useCommissionStore from '@/stores/module/commission'
import { notification } from '@/components/notification'
import useProfileStore from './module/profile'

const useUserHomeStore = defineStore('userHome', {
  state: (): IHomeState => ({
    userId: '',
    owner: false,
    isFocus: 0,
    historyQuery: {
      collect: {},
      artwork: {},
      trend: {},
      main: {}
    }
  }),
  actions: {
    async reSetAboutUserHomeStore() {
      const collectStore = useCollectStore()
      const artworkStore = useArtworkStore()
      const userHomeStore = useUserHomeStore()
      const trendStore = useTrendStore()
      const commissionStore = useCommissionStore()
      collectStore.$reset()
      artworkStore.$reset()
      userHomeStore.$reset()
      trendStore.$reset()
      commissionStore.$reset()
      this.$reset()
    },
    //关注作者请求
    async postUserFocusAction() {
      const isCancel = this.isFocus > 0
      const result = await postUserFocusRequest(this.userId, isCancel)
      if (result.status === 200) {
        const profileStore = useProfileStore()
        if (!result.data.isCancel) {
          this.isFocus = 1
          notification({
            type: 'success',
            title: '关注画师',
            message: '关注成功~'
          })
          profileStore.count.fans += 1
        } else {
          this.isFocus = 0
          notification({
            type: 'success',
            title: '关注画师',
            message: '取消关注成功~'
          })
          profileStore.count.fans -= 1
        }
      }
    }
  }
})

export default useUserHomeStore
