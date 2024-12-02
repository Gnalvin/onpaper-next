import localStorage from '@/utils/local-storage'
import sessionStorage from '@/utils/session-storage'

/**
 * 清除所有store 状态 包括 本地
 */
export function clearAllStore() {
  const storeFiles: Record<string, any> = import.meta.glob(
    ['./module/**/index.ts', '!./module/**/type.ts'],
    {
      eager: true
    }
  )
  Object.values(storeFiles).map((useStore) => {
    const store = useStore.default()
    store.$reset()
  })

  localStorage.clearCache()
  sessionStorage.clearCache()
}
