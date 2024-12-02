import ConfirmBoxConstructor from './confirm-box.vue'
import { h, render } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { IMessageBoxProps, Action } from './type'
//初始化存储 组件实例的 map 用于后期获取 resolve/reject
const messageInstance = new Map<
  ComponentPublicInstance, // marking doClose as function
  {
    options: any
    resolve: (res: any) => void
    reject: (reason?: any) => void
  }
>()

// 初始化组件实例
const initInstance = (props: any, container: HTMLElement) => {
  const vnode = h(ConfirmBoxConstructor, props)
  render(vnode, container)
  document.body.appendChild(container.firstElementChild!)
  return vnode.component
}

const createContainer = () => {
  return document.createElement('div')
}

const showMessage = (options: IMessageBoxProps) => {
  //创建容器
  const container = createContainer()

  const instance = initInstance(options, container)!
  const vm = instance.proxy as ComponentPublicInstance<{
    isShow: boolean
  }>

  // 监听组件发出的事件
  options.onAction = (action: Action) => {
    const currentMsg = messageInstance.get(vm)!
    if (action === 'cancel') {
      currentMsg.reject('cancel')
    } else {
      currentMsg.resolve('resolve')
    }

    vm.isShow = false
  }

  return vm
}

async function MessageBox(options: IMessageBoxProps) {
  return new Promise((resolve, reject) => {
    const vm = showMessage(options)
    messageInstance.set(vm, {
      options,
      resolve,
      reject
    })
  })
}

export default MessageBox
