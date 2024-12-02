import { defineStore } from 'pinia'
import type { IArtworkState } from '../type'

import { getUserHomeArtworkRequest } from '@/service/user-home'
import { formatPicUrl } from '@/utils/data-format'

type IHomeArtworkQuery = {
  userId: string
  page: number
  sort: 'like' | 'collect' | 'now'
}

const useArtworkStore = defineStore('userHomeArtwork', {
  state: (): IArtworkState => ({
    artworks: [],
    artworksCount: 0,
    path: '',
    isNoArtworks: 'unknown'
  }),
  actions: {
    //获取用户作品
    async getUserHomeArtworkAction(payload: IHomeArtworkQuery) {
      const strPath = JSON.stringify(payload)
      if (strPath === this.path) return
      this.path = strPath
      const { userId, page, sort } = payload
      const result = await getUserHomeArtworkRequest(userId, page, sort)
      if (result.status == 1016) return (this.isNoArtworks = 'yes')
      if (result.status === 200) {
        this.isNoArtworks = 'no'
        const artworks = result.data.artworks ? result.data.artworks : []
        artworks.forEach((item) => {
          // 拼接 图像地址
          item.cover = formatPicUrl(item.cover, userId, 'cover', 'm')
        })
        this.artworks = artworks
      }
    }
  }
})

export default useArtworkStore
