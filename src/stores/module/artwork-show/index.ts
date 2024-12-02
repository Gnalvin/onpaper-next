import { defineStore } from 'pinia'
import type { IArtworkShowState } from './type'

import { getChannelArtworkRequest } from '@/service/artwork/show'
import { formatArtUrl } from './handle'
const useArtworkShowStore = defineStore('artworkShow', {
  state: (): IArtworkShowState => ({
    artworks: [],
    loading: false,
    isEnd: false,
    query: {
      next: '0',
      zone: 'all',
      sort: 'new',
      page: 0
    }
  }),
  actions: {
    //获取分区作品数据
    async getChannelArtworkAction() {
      this.loading = true
      // hot 是 用page 翻页
      if (this.query.sort == 'hot') this.query.page += 1
      if (this.query.sort == 'new') {
        const last = this.artworks[this.artworks.length - 1]
        this.query.next = last?.artworkId ?? '0'
        this.query.page = 1
      }
      const result = await getChannelArtworkRequest(this.query)
      this.loading = false
      if (result.status === 200) {
        if (result.data.length < 30) this.isEnd = true
        this.artworks.push(...formatArtUrl(result.data))
      }
    }
  }
})

export default useArtworkShowStore
