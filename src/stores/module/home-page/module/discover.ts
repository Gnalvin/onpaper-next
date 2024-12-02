import { defineStore } from 'pinia'
import type { IDiscoverState } from '../type'
import { getHotArtworkRequest } from '@/service/home-page'
import { formatPicUrl } from '@/utils/data-format'
import type Waterfall from '@/views/home-page/subarea/discover/waterfall'

const useDiscoverStore = defineStore('homeDiscoverStore', {
  state: (): IDiscoverState => ({
    discoverArtwork: [],
    page: 1
  }),
  actions: {
    //获取发现作品数据
    async getDiscoverArtworkAction(waterfall: Waterfall) {
      const result = await getHotArtworkRequest()
      if (result.status !== 200) return
      this.page++
      result.data.forEach((item) => {
        // 这个id 是避免出现 重复图片 vue KEY 报错
        item.id = item.artworkId + Date.parse(String(new Date()))
        // 拼接 图像地址
        item.userAvatar = formatPicUrl(
          item.userAvatar,
          item.userId,
          'avatars',
          's'
        )
        item.firstPic = formatPicUrl(
          item.firstPic,
          item.userId,
          'artworks',
          's'
        )
        const factor = 236 / item.width
        item.height = Math.round(item.height * factor)
        item.height = item.height > 450 ? 450 : item.height
        item.height = item.height < 180 ? 180 : item.height
        item.width = 236
        this.discoverArtwork.push(item)
        waterfall.setTranslateMap(item.height)
      })
    }
  }
})

export default useDiscoverStore
