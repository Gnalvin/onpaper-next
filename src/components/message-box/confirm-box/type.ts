import type { VNode } from 'vue'

//组件实例的 props 参数
export interface IMessageBoxProps {
  title?: string
  text: string | VNode
  confirmButtonText?: string
  cancelButtonText?: string
  onlyTip?: boolean
  width?: string
  confirmBtnColor?: string
  onAction?: (action: Action) => void
}

export type Action = 'confirm' | 'cancel'
