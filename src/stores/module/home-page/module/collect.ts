import { defineStore } from 'pinia'
import type { ICollectAreaState } from '../type'
import { getUserCollectRequest } from '@/service/home-page'
import { postArtworkCollectRequest } from '@/service/artwork'
import { formatPicUrl } from '@/utils/data-format'
import { TipBox } from '@/components/message-box/index'
import useMainStore from '@/stores/module/main'

const useCollectAreaStore = defineStore('collectAreaStore', {
  state: (): ICollectAreaState => ({
    collects: [],
    loading: false,
    isEnd: false,
    isNoCollects: 'unknown'
  }),
  actions: {
    //获取用户收藏作品
    async getUserCollectAction(payload: { userId: string; page: number }) {
      const { userId, page } = payload
      const mainStore = useMainStore()
      if (!mainStore.userId) return
      this.loading = true
      const result = await getUserCollectRequest(userId, page)
      this.loading = false
      if (result.status == 1028) {
        this.isEnd = true
        this.isNoCollects = 'yes'
        return
      }
      if (result.status === 200) {
        this.isNoCollects = 'no'
        const artworks = result.data ?? []
        for (const item of artworks) {
          // 拼接 图像地址
          item.cover = formatPicUrl(item.cover, item.userId, 'cover', 'm')
          item.userAvatar = formatPicUrl(
            item.userAvatar,
            item.userId,
            'avatars',
            's'
          )
          item.isOwner = mainStore.userId === item.userId
          this.collects.push(item)
        }
        if (artworks.length < 30) this.isEnd = true
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

export default useCollectAreaStore
