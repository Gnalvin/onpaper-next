import { type App, nextTick } from 'vue'
import { getRandomColor } from '@/utils/random'
import { throttle } from '@/utils/throttle'
import LazyLoading from '@/components/lazy-loading'

// 注册全局指令 v-XX
export default function (app: App): void {
  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.querySelector('input')?.focus({ preventScroll: true })
      el.querySelector('textarea')?.focus({ preventScroll: true })
    }
  })
  // 修改页面标题
  app.directive('title', {
    updated(el, binding) {
      document.title = binding.value
    }
  })
  // 直接传函数 相当于 mounted 和 updated 都执行
  app.directive('lazy-img', (el: HTMLImageElement, binding) => {
    if (binding.arg == 'close') {
      el.src = binding.value
      return
    }
    // 如果已经加载过了 不需要再等进入视口
    if (el.dataset.loaded) {
      el.src = binding.value
      return
    }
    const lazyImageObserver = new IntersectionObserver(
      ([{ isIntersecting }], observer) => {
        // 相交率，默认是相对于浏览器视窗
        if (isIntersecting) {
          el.src = binding.value
          el.dataset.loaded = 'true'
          // 当前图片加载完之后需要去掉监听
          observer.unobserve(el)
        }
      },
      {
        // 提前500px 加载
        rootMargin: '0px 0px 0px 0px'
      }
    )
    lazyImageObserver.observe(el)
  })
  //随机背景颜色
  app.directive('random-color', {
    mounted(el: HTMLElement) {
      el.style.backgroundColor = getRandomColor()
    }
  })
  // 懒加载更多
  app.directive('lazy-loading', LazyLoading)
  //监听子元素大小变化
  app.directive('resize', {
    mounted(el, binding) {
      const fn = () => {
        const rect = el.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        binding.value(width, height, binding.arg)
      }
      nextTick(fn) // 立即执行一次
      const observer = new MutationObserver(throttle(fn, 30))
      observer.observe(el, {
        childList: true, // 监听被观察元素的子节点的变化
        characterData: true, // 监听元素的文本内容变化
        attributes: true,
        attributeFilter: ['style'], // 监听的特定属性
        subtree: true // 监听被观察元素的所有后代节点的变化。
      })
      el.__observer__ = observer
    },
    unmounted(el) {
      // 当您希望取消监听时，调用 disconnect 方法
      el.__observer__.disconnect()
    }
  })
}
