import { defineStore } from 'pinia'
import type { IEditState } from './type'
import useArtworkDetailStore from './index'
import { updateArtworkInfoRequest } from '@/service/artwork'

const useEditStore = defineStore('artShowEditStore', {
  state: (): IEditState => ({
    artworkId: '',
    title: '',
    zone: '',
    intro: '',
    tags: [],
    comment: 'close',
    copyRight: '',
    whoSee: '',
    adult: false
  }),
  actions: {
    async initStore() {
      const showStore = useArtworkDetailStore()
      const artInfo = showStore.artInfo
      this.artworkId = artInfo.artworkId
      this.title = artInfo.title
      this.zone = artInfo.zone
      this.intro = artInfo.intro
      this.tags = artInfo.tag.map((i) => i.tagName)
      this.comment = artInfo.comSetting
      this.copyRight = artInfo.copyright
      this.whoSee = artInfo.whoSee
      this.adult = artInfo.adults
    },
    // 更新作品信息
    async updateArtInfoAction() {
      const res = await updateArtworkInfoRequest(this.$state)
      return res
    }
  }
})

export default useEditStore
