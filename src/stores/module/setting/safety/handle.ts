import useMainStore from '@/stores/module/main'
import localStorage from '@/utils/local-storage'

export function handleChangeToken(accessToken: string, refreshToken: string) {
  const mainStore = useMainStore()
  mainStore.accessToken = accessToken
  mainStore.refreshToken = refreshToken
  // 进行localStorage本地缓存
  localStorage.setCache('refreshToken', refreshToken)
  localStorage.setCache('accessToken', accessToken)
}
