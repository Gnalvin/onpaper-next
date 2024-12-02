import { defineStore } from 'pinia'
import type { INotifyState } from './type'
import {
  getNotifyConfigRequest,
  updateNotifyConfigRequest
} from '@/service/setting/notify'
const useNotifySettingStore = defineStore('notifySetting', {
  state: (): INotifyState => ({
    config: null
  }),
  actions: {
    // 获取配置
    async getNotifyConfigAction() {
      const res = await getNotifyConfigRequest()
      if (res.status == 200) {
        this.config = res.data
      }
    },
    // 更新配置
    async updateNotifyConfigAction() {
      const res = await updateNotifyConfigRequest(this.config!)
      if (res.status == 200) {
        this.config = res.data
      }
      return res
    }
  }
})

export default useNotifySettingStore
