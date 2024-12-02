import { createPinia } from 'pinia'
import useMainStore from './module/main'

export function setupStore() {
  const mainStore = useMainStore()
  mainStore.resetMainStoreData()
}
const pinia = createPinia()
export default pinia
