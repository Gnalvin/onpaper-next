import type { ILoginResult } from '@/service/login/type'
import localStorage from '@/utils/local-storage'
import useMainStore from '@/stores/module/main'
import useNavBarStore from '../nav-bar'

export function handleLoginSuccess(data: ILoginResult) {
  const { userId, refreshToken, accessToken, userName } = data

  const mainStore = useMainStore()
  mainStore.userId = userId
  mainStore.userName = userName
  mainStore.refreshToken = refreshToken
  mainStore.accessToken = accessToken

  // 进行localStorage本地缓存
  localStorage.setCache('refreshToken', refreshToken)
  localStorage.setCache('accessToken', accessToken)
  localStorage.setCache('userInfo', { userId, userName })

  if (mainStore.isShowLogin) {
    mainStore.isShowLogin = false
    mainStore.refreshPageAction()
    // 重新请求导航栏信息
    const navbarStore = useNavBarStore()
    navbarStore.getUserNavDataAction()
  }
}
