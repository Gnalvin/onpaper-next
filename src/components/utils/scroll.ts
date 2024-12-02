import { isClient, useEventListener } from '@vueuse/core'
import { isString } from '@/utils/verify-type'
import { getStyle } from './style'
import { isElement, isDocument, isWindow } from './verify-type'

export const isScroll = (el: HTMLElement, isVertical?: boolean): boolean => {
  if (!isClient) return false

  const key = (
    {
      undefined: 'overflow',
      true: 'overflowY',
      false: 'overflowX'
    } as any
  )[String(isVertical)]!
  const overflow = getStyle(el, key)
  return ['scroll', 'auto', 'overlay'].some((s) => overflow.includes(s))
}

export const getScrollContainer = (
  el: HTMLElement,
  isVertical?: boolean
): Window | HTMLElement | undefined => {
  let parent: HTMLElement = el
  while (parent) {
    const windowList = [
      window,
      document,
      document.documentElement,
      document.body
    ]
    if (windowList.includes(parent)) return window
    if (isScroll(parent, isVertical)) return parent

    parent = parent.parentNode as HTMLElement
  }
  return parent
}

//添加滚动监听
export function addScrollListener(el: unknown, fn: (e: Event) => void) {
  let container: any
  // 查找 滚动容器
  if (isElement(el)) {
    container = el
  } else if (isString(el) && el !== '') {
    container = document.querySelector<HTMLElement>(el) ?? undefined
  }
  const scrollContainer = getScrollContainer(container)
  if (scrollContainer) {
    useEventListener(scrollContainer, 'scroll', fn)
  }
}

//获取元素滚动位移
type position = { x: number; y: number; scrollHeight: number }
export function getScrollPosition(target: unknown) {
  const position: position = { x: 0, y: 0, scrollHeight: 0 }
  if (isDocument(target)) {
    position.y = target.documentElement.scrollTop
    position.x = target.documentElement.scrollLeft
    position.scrollHeight = target.documentElement.scrollHeight
  } else if (isWindow(target)) {
    position.x = target.scrollX
    position.y = target.scrollY
    position.scrollHeight = document.documentElement.scrollHeight
  } else if (isElement(target)) {
    position.y = target.scrollTop
    position.x = target.scrollLeft
    position.scrollHeight = target.scrollHeight
  }

  return position
}

export const getOffsetTop = (el: HTMLElement) => {
  let offset = 0
  let parent = el

  while (parent) {
    offset += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return offset
}

export const getOffsetTopDistance = (
  el: HTMLElement,
  containerEl: HTMLElement
) => {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl))
}
