<template>
  <div
    class="img-bar"
    v-show="showPreView"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    ref="imgBarEl"
  >
    <SmallImgList :urlList="urlList" @toImg="goToImg"></SmallImgList>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import { useEventListener } from '@vueuse/core'
import { throttle } from '@/utils/throttle'
import SmallImgList from './small-img-list.vue'
import { getScrollContainer } from '@/components/utils/scroll'

const emits = defineEmits(['goToImg'])
const uploadStore = useUploadArtworkStore()

// 图片列表 每8个一组
const urlList = computed(() => {
  const tempList = []
  let i = 0
  while (i < uploadStore.urlList.length) {
    tempList.push(uploadStore.urlList.slice(i, (i += 8)))
  }
  return tempList
})

// 点击缩略图跳转到图片
const goToImg = (index: number, pageNum: number) => {
  emits('goToImg', index + pageNum * 8)
}

// 滚动页面出现 下方图片管理条
const isScrolling = ref(false)
const showPreView = computed(() => {
  return (uploadStore.urlList.length && isScrolling.value) || mouseShow.value
})
const throttleShowManage = throttle(
  (function () {
    let timer: any
    const _changFn = function () {
      isScrolling.value = true
      // 如果之前就设立有定时器则取消 重新计时
      if (timer) clearTimeout(timer)
      // 设立定时器
      timer = setTimeout(() => {
        isScrolling.value = false
      }, 2500)
    }
    return _changFn
  })(),
  1000
)
// 挂载时监听滚动
const imgBarEl = ref<HTMLDivElement>()
onMounted(() => {
  const scrollContainer = getScrollContainer(imgBarEl.value!)
  useEventListener(scrollContainer, 'scroll', throttleShowManage)
})

//当鼠标进入组件持续显示
const mouseShow = ref(false)
let mouseTimer: any
const mouseenter = () => {
  // 离开2秒内又进去 清除之前的 timer
  if (mouseTimer) clearTimeout(mouseTimer)
  mouseShow.value = true
}
const mouseleave = () => {
  // 鼠标离开2秒后消失
  mouseTimer = setTimeout(() => {
    mouseShow.value = false
    mouseTimer = null
  }, 1600)
}
</script>

<style scoped lang="less">
.img-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(4px);
}
:deep(.img-list) {
  span {
    margin: 0 15px;
    fill: whitesmoke;
    transition: all 0.3s ease;
  }
  span:hover {
    transform: scale(1.2);
  }
  .show-wrap {
    min-width: 664px;
    .item {
      margin: 0 8px;
      height: 65px;
      width: 65px;
      object-fit: contain;
      transition: all 0.3s ease;
    }
    .item:hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  }
}
</style>
