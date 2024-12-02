import { defineStore } from 'pinia'
import { GetSTSTokenRequest } from '@/service/sts'
import type { IStsQuery } from '@/service/sts/type'
import type { IRootState } from './type'
import { formatPicUrl } from '@/utils/data-format'
import localStorage from '@/utils/local-storage'
import { isMobile } from '@/utils/system'

const useMainStore = defineStore('main', {
  state: (): IRootState => ({
    userId: '',
    userName: '',
    refreshToken: '',
    accessToken: '',
    avatar: '',
    // stsToken 上传 oss的证书
    sts: {
      token: {
        accessKeyId: '',
        accessKeySecret: '',
        securityToken: ''
      },
      fileName: []
    },
    refreshPage: 0,
    isShowLogin: false,
    tempImg: [],
    isMobile: false
  }),
  getters: {
    avatarUrl(state) {
      if (this.userId) {
        return formatPicUrl(state.avatar, state.userId, 'avatars', 's')
      }
      return ''
    }
  },
  actions: {
    // 重置 store数据 避免用户刷新后 pinia 数据消失
    async resetMainStoreData() {
      this.refreshToken = localStorage.getCache('refreshToken') ?? ''
      this.accessToken = localStorage.getCache('accessToken') ?? ''
      const userInfo = localStorage.getCache('userInfo')
      if (userInfo) {
        this.userId = userInfo.userId
        this.userName = userInfo.userName
      }
      this.isMobile = Boolean(isMobile())
    },
    // 获取stsToken 并保存
    async getSTSTokenAction(payload: IStsQuery) {
      const result = await GetSTSTokenRequest(payload)
      if (result.status === 200) {
        this.sts = result.data
      }
      return result
    },
    // 刷新页面
    async refreshPageAction() {
      this.refreshPage = Date.now()
    },
    // 验证是否登陆 如果没有登陆 展示登陆组件
    verifyIsLogin() {
      if (this.userId === '') {
        this.isShowLogin = true
        return false
      }
      return true
    }
  }
})

export default useMainStore
