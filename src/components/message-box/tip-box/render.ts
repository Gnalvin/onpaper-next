import TipBoxConstructor from './tip-box.vue'
import { h, render } from 'vue'
import type { ITipBoxProps } from './type'

// 初始化组件实例
const initInstance = (props: ITipBoxProps, container: HTMLElement) => {
  const vNode = h(TipBoxConstructor, props)
  render(vNode, container)
  document.body.appendChild(container.firstElementChild!)
  return vNode.component
}

const createContainer = () => {
  return document.createElement('div')
}

const showMessage = (options: ITipBoxProps) => {
  //创建容器
  const container = createContainer()
  initInstance(options, container)
  return
}

export default showMessage
