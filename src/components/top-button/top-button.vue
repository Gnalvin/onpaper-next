<template>
  <div
    class="to-top"
    @click="toTop()"
    :class="{ 'show-top': isShowToTop }"
    ref="bottom"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.0083 14.1005V42"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      />
      <path
        d="M12 26L24 14L36 26"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      />
      <path
        d="M12 6H36"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, ref, watch, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
import { throttle } from '@/utils/throttle'
import { isElement, getScrollContainer } from '../utils/index'
import { isString } from '@/utils/verify-type'

type ScrollBehavior = 'auto' | 'smooth'

const props = defineProps({
  scrollContainer: {
    type: Object as PropType<string | HTMLElement | undefined | Window>
  },
  behavior: {
    type: String as PropType<ScrollBehavior>,
    default: 'smooth'
  }
})

const isShowToTop = ref(false)
const bottom = ref<HTMLElement>()
const container = ref()

const handleShowToTop = throttle(
  () => {
    //滚动超过300px 则显示
    if (isElement(container.value)) {
      isShowToTop.value = container.value.scrollTop > 300 ? true : false
    } else {
      isShowToTop.value = window.scrollY > 300 ? true : false
    }
  },
  1000,
  { leading: true, trailing: true }
)

async function addScrollListener() {
  await nextTick()
  const { scrollContainer } = props
  // 查找 滚动容器
  if (isElement(scrollContainer)) {
    container.value = scrollContainer
  } else if (isString(scrollContainer) && scrollContainer !== '') {
    container.value =
      document.querySelector<HTMLElement>(scrollContainer) ?? undefined
  } else if (bottom.value) {
    container.value = getScrollContainer(bottom.value)
  }
  if (container.value) {
    useEventListener(container.value, 'scroll', handleShowToTop)
  }
}

watch(
  () => props.scrollContainer,
  () => {
    addScrollListener()
  },
  { immediate: true }
)

const toTop = (behavior?: ScrollBehavior) => {
  if (isElement(container.value)) {
    container.value.scrollTo({
      top: 0,
      behavior: behavior ? behavior : props.behavior
    })
  } else {
    window.scrollTo({
      top: 0,
      behavior: behavior ? behavior : props.behavior
    })
  }
}

defineExpose({ toTop })
</script>

<style scoped lang="less">
.to-top {
  position: fixed;
  z-index: 99;
  bottom: 20px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  background-color: var(--transparent-theme-color1);
  svg {
    stroke: var(--color-text1);
  }
}
.show-top {
  opacity: 1 !important;
  cursor: pointer !important;
  pointer-events: all !important;
}
</style>
