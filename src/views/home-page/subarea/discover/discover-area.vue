<template>
  <div
    class="discover-wrap"
    ref="discoverWrapEl"
    v-lazy-loading="loadMoreArtwork"
    :lazy-loading-immediate="true"
    :lazy-loading-delay="800"
    :lazy-loading-distance="1500"
  >
    <template v-for="item in discover" :key="item.id">
      <RectangleArtItem :art-info="item"></RectangleArtItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onUpdated,
  nextTick,
  onUnmounted,
  watch
} from 'vue'
import { useEventListener } from '@vueuse/core'
import useDiscoverStore from '@/stores/module/home-page/module/discover'
import { RectangleArtItem } from '@/components/artwork-item'
import Waterfall from './waterfall'
import { exponentialSearch as es } from './utils'
import { debounce } from '@/utils/debounce'
import { throttle } from '@/utils/throttle'
import { getScrollContainer, getScrollPosition } from '@/components/utils'
import useHomePageStore from '@/stores/module/home-page'

const homeStore = useHomePageStore()
const discoverStore = useDiscoverStore()

const waterfall = new Waterfall({
  itemWidth: 236,
  headGap: 40,
  leftGap: 14,
  itemClassName: '.item',
  containerClassName: '.discover-wrap'
})

//加载更多作品
const loadMoreArtwork = () => discoverStore.getDiscoverArtworkAction(waterfall)

const startIndex = ref(0)
let visitCount = 0 //可见元素个数
let bufferCount = 0 // 缓冲元素个数
let clientHeight = 0 //浏览器视口高度

// 展示的数组是分割后的虚拟列表数组
const discover = computed(() =>
  discoverStore.discoverArtwork.slice(
    startIndex.value,
    Math.min(
      startIndex.value + visitCount + bufferCount,
      discoverStore.discoverArtwork.length
    )
  )
)

const discoverWrapEl = ref<HTMLElement>()

onMounted(() => {
  waterfall.init()
  //滚动时 实现 虚拟列表
  const scrollEl = getScrollContainer(discoverWrapEl.value!)
  clientHeight = document.documentElement.clientHeight // 浏览器高度

  visitCount = Math.ceil(clientHeight / 200) * waterfall.cols
  bufferCount = Math.floor(visitCount / 2)

  useEventListener(
    scrollEl,
    'scroll',
    throttle(
      () => {
        // 获取现在滚动到第几个
        startIndex.value = es(0, getScrollPosition(scrollEl).y, waterfall)
        if (startIndex.value - bufferCount < 0) {
          startIndex.value = 0
        } else {
          startIndex.value = startIndex.value - bufferCount
        }
        waterfall.startIndex = startIndex.value
        waterfall.endIndex = startIndex.value + visitCount + bufferCount
      },
      35,
      { leading: true, trailing: true }
    )
  )
})

// 为了能获取准确的位置 需要 nextTick 后再重新渲染
onUpdated(() => {
  nextTick(() => {
    waterfall.render()
  })
})

onUnmounted(() => {
  discoverStore.$reset()
  waterfall.reSetData()
})

// 当窗口大小变化时 列数可能会变化 当列数变化时 跳到之前看到的图像位置(预估)
const scrollToTop = () => {
  const scrollEl = getScrollContainer(discoverWrapEl.value!) as HTMLElement
  const visitEl = discoverWrapEl.value?.children[
    0 + bufferCount
  ] as HTMLDivElement
  const numberPattern = /-?\d+\.?\d*/g
  const values = visitEl.style.transform.match(numberPattern)
  let top = 0
  if (values) {
    top = Number(values[1]) - Number(visitEl.style.height.split('px').join(''))
  }

  scrollEl.scrollTo(0, top)
}

// 浏览器窗口发生变化时 重新渲染
const reRender = () => {
  const oldCols = waterfall.cols
  waterfall.init()
  visitCount = Math.ceil(clientHeight / 200) * waterfall.cols
  bufferCount = Math.floor(visitCount / 2)
  for (let i = 0; i < discoverStore.discoverArtwork.length; i++) {
    const { height } = discoverStore.discoverArtwork[i]
    waterfall.setTranslateMap(height)
  }
  waterfall.render()
  //列数发生变化跳转高度,不然当前滚动高度不变 有可能看不到图片
  if (oldCols !== waterfall.cols) {
    scrollToTop()
  }
}
useEventListener(window, 'resize', debounce(reRender, 350))

// 窗口小于 1250px 时切换 sidebar 大小 需要改变width 不然会有遮挡
watch(
  () => homeStore.sidebar,
  (val) => {
    const clientWidth = document.documentElement.clientWidth
    if (val == 'big' && clientWidth < 1250) {
      discoverWrapEl.value!.style.width = '750px'
    } else {
      discoverWrapEl.value!.style.width = ''
    }
    reRender()
  }
)
</script>

<style scoped lang="less">
.discover-wrap {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

@media (min-width: 1764px) {
  .discover-wrap {
    width: 1500px;
  }
}
@media (max-width: 1764px) {
  .discover-wrap {
    width: 1250px;
  }
}
@media (max-width: 1510px) {
  .discover-wrap {
    width: 1000px;
  }
}

@media (max-width: 1100px) {
  .discover-wrap {
    width: 750px;
  }
}
</style>
