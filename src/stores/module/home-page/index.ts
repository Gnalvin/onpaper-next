import { defineStore } from 'pinia'
import type { IHomePageState } from './type'

const useHomePageStore = defineStore('homePageStore', {
  state: (): IHomePageState => ({
    sidebar: 'big'
  }),
  actions: {}
})

export default useHomePageStore
