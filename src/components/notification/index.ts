import { ElNotification } from 'element-plus'
import 'element-plus/es/components/notification/style/css'
import type { VNode } from 'vue'
import icon from './notifi-icon.vue'

type option = {
  type?: 'success' | 'error' | 'warning'
  title: string
  message: string | VNode
  duration?: number
  offset?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose?: boolean
  zIndex?: number
}

export function notification(option: option) {
  // 默认设置消失事件为5秒
  if (option.duration === undefined) option.duration = 4000
  return ElNotification({
    icon: icon,
    offset: 40,
    ...option
  })
}
