import { defineStore } from 'pinia'
import type { ICollectState } from '../type'
import { getUserHomeCollectRequest } from '@/service/user-home'
import { formatPicUrl } from '@/utils/data-format'
import { postArtworkCollectRequest } from '@/service/artwork'
import { TipBox } from '@/components/message-box/index'
import useMainStore from '@/stores/module/main'
import useUserHomeStore from '../index'

const useCollectStore = defineStore('userHomeCollect', {
  state: (): ICollectState => ({
    collects: [],
    collectCount: 0,
    path: '',
    isNoCollects: 'unknown'
  }),
  actions: {
    //获取用户收藏作品
    async getUserHomeCollectAction(payload: { userId: string; page: number }) {
      const mainStore = useMainStore()
      const userHomeStore = useUserHomeStore()
      const strPath = JSON.stringify(payload)
      if (strPath === this.path) return
      this.path = strPath
      const { userId, page } = payload

      const result = await getUserHomeCollectRequest(userId, page)
      if (result.status === 1028) return (this.isNoCollects = 'yes')
      if (result.status === 200) {
        this.isNoCollects = 'no'
        const artworks = result.data ? result.data : []
        artworks.forEach((item) => {
          // 拼接 图像地址
          item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
          item.userAvatar = formatPicUrl(
            item.userAvatar,
            item.userId,
            'avatars',
            's'
          )
          // 在自己主页时判断是否收藏自己的作品
          if (userHomeStore.owner) {
            item.isOwner = mainStore.userId === item.userId
          }
        })
        this.collects = artworks
      }
    },
    //取消收藏作品请求
    async cancelArtworkCollectAction(artId: string, userId: string) {
      const result = await postArtworkCollectRequest(artId, userId, true, true)
      if (result.status === 200) {
        TipBox({ text: '取消收藏成功' })
        // 数组中删掉
        const index = this.collects.findIndex(
          (i) => i.artworkId == result.data.msgId
        )
        this.collects.splice(index, 1)
      }
    }
  }
})

export default useCollectStore
