import ReportPanelConstructor from './report-panel.vue'
import { h, render } from 'vue'
import type { IReportPanelProps } from './type'

// 初始化组件实例
const initInstance = (props: any, container: HTMLElement) => {
  const vnode = h(ReportPanelConstructor, props)
  render(vnode, container)
  document.body.appendChild(container.firstElementChild!)
  return vnode.component
}

const createContainer = () => {
  return document.createElement('div')
}

const showReportPanel = (options: IReportPanelProps) => {
  //创建容器
  const container = createContainer()
  initInstance(options, container)!

  return
}

export default showReportPanel
