import { onMounted, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export function clickOtherClose(
  areaRef: Ref<HTMLDivElement | undefined>,
  fn: () => void
) {
  onMounted(() => {
    const area = areaRef.value
    //监听点击其他地方关闭
    useEventListener(document, 'mouseup', (event: MouseEvent) => {
      const clickEl = event.target as HTMLElement
      if (!(clickEl == area || area?.contains(clickEl))) {
        fn()
      }
    })
  })
}
