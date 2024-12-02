// 禁止滚动
let top = 0
export function stopBodyScroll(isFixed: boolean, isHidden = true) {
  const bodyEl = document.body

  let times = Number(bodyEl.dataset.times) || 0 // 冻结窗口的次数，默认 0 没有冻结过

  if (isFixed) {
    times += 1
    bodyEl.dataset.times = String(times) // 冻结窗口的次数 + 1
    if (times != 1) return //  不是第一次做冻结不做操作

    top = window.scrollY
    const overflow = isHidden ? 'hidden' : ''
    bodyEl.style.position = 'fixed'
    bodyEl.style.top = -top + 'px'
    bodyEl.style.right = '0px'
    bodyEl.style.left = '0px'
    bodyEl.style.overflow = overflow
  } else {
    times -= 1
    bodyEl.dataset.times = String(times)
    if (times != 0) return // 不是最后一次取消冻结 不做操作

    bodyEl.style.position = ''
    bodyEl.style.top = ''
    bodyEl.style.right = ''
    bodyEl.style.left = ''
    bodyEl.style.overflow = ''

    delete bodyEl.dataset.times
    window.scrollTo(0, top) // 回到原先的位置
    top = 0 // 重置
  }
}
