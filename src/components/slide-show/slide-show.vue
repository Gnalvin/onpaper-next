<template>
  <div class="slide-show">
    <div
      class="btn left-btn"
      v-show="isShowLeftBtn"
      @click="toLeft"
      :style="{ top: btnTop - offset + 'px' }"
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="26"
          height="26"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"
            fill="rgba(255,255,255,1)"
          />
        </svg>
      </span>
    </div>
    <ul class="wrap" ref="wrapEl">
      <li v-for="(item, index) in arrayItem" :key="item[itemKey]">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
    <div
      class="btn right-btn"
      v-show="isShowRightBtn"
      @click="toRight"
      :style="{ top: btnTop - offset + 'px' }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="26"
        height="26"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
          fill="rgba(255,255,255,1)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, type PropType, watch, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
import { throttle } from '@/utils/throttle'

const props = defineProps({
  arrayItem: {
    type: Array as PropType<any[]>,
    required: true
  },
  itemKey: {
    type: String,
    required: true
  },
  offset: {
    type: Number,
    default: 0
  }
})

//两旁边的白色
const maskStyle = reactive({
  left: 0,
  right: 1
})

//作品展示的元素
const wrapEl = ref<HTMLElement>()
//滚动作品条
const isShowRightBtn = ref(false)
const isShowLeftBtn = ref(false)

//是否有滚动条 有的话显示 按钮
const hasScrollbar = throttle(
  () => {
    isShowRightBtn.value = false
    isShowLeftBtn.value = false
    maskStyle.left = 0
    maskStyle.right = 0
    const hasScrollbar = wrapEl.value!.scrollWidth - wrapEl.value!.clientWidth
    // 可滚动区域小于0 没有滚动条
    if (hasScrollbar < 0) return

    //可以显示滚动条情况下 如果左边没到头显示按钮
    if (wrapEl.value!.scrollLeft > 0) {
      maskStyle.left = 1
      isShowLeftBtn.value = true
    }
    // 如果右边没到头显示 按钮
    if (hasScrollbar - wrapEl.value!.scrollLeft > 0) {
      maskStyle.right = 1
      isShowRightBtn.value = true
    }
  },
  250,
  { leading: true, trailing: true }
)

onMounted(() => {
  useEventListener(wrapEl.value, 'scroll', hasScrollbar)
  useEventListener(window, 'resize', hasScrollbar)
})

const btnTop = ref(0)
watch(
  () => props.arrayItem,
  () =>
    nextTick(() => {
      // 重新定位 btn 位置
      const containerHeight = wrapEl.value!.offsetHeight
      btnTop.value = containerHeight / 2 - 20
      hasScrollbar()
    }),
  { deep: true, immediate: true }
)

const toRight = throttle(() => {
  //每次点击都要取消防抖函数 避免干扰
  hasScrollbar.cancel()
  isShowLeftBtn.value = true
  maskStyle.left = 1
  //当前滚动的距离
  const nowWidth = wrapEl.value!.scrollLeft
  //单次滚动的距离
  const oneScrollWidth = 750

  // 滚动列表
  wrapEl.value!.scrollTo({
    left: oneScrollWidth + nowWidth,
    behavior: 'smooth'
  })
}, 250)

const toLeft = throttle(() => {
  //每次点击都要取消防抖函数 避免干扰
  hasScrollbar.cancel()
  isShowRightBtn.value = true
  maskStyle.right = 1
  //当前滚动的距离 也是可以滚动的距离
  const nowWidth = wrapEl.value!.scrollLeft
  //单次滚动的距离
  const oneScrollWidth = 750

  // 滚动列表
  wrapEl.value!.scrollTo({
    left: -oneScrollWidth + nowWidth,
    behavior: 'smooth'
  })
}, 250)

//滚动到指定元素位置
const toItemPosition = (index: number) => {
  nextTick(() => {
    const el = wrapEl.value!.children[index] as HTMLLIElement
    const distance = el.offsetLeft
    // 滚动列表 尽可能滚到中间
    wrapEl.value!.scrollTo({
      left: distance - wrapEl.value!.clientWidth / 2 + el.clientWidth / 2,
      behavior: 'smooth'
    })
  })
}
defineExpose({ toItemPosition })
</script>

<style scoped lang="less">
.slide-show {
  position: relative;
  width: 100%;
}
.wrap {
  position: relative;
  display: flex;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  li {
    margin-right: 15px;
    flex-shrink: 0;
  }
}
.slide-show::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: v-bind('maskStyle.left');
  z-index: 1;
  transition: opacity 0.5s;
  pointer-events: none;
  background: linear-gradient(to right, var(--bgc), transparent 100px);
}
.slide-show::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: v-bind('maskStyle.right');
  z-index: 1;
  transition: opacity 0.5s;
  pointer-events: none;
  background: linear-gradient(to left, var(--bgc), transparent 100px);
}
.slide-show:hover {
  .btn {
    opacity: 1;
  }
}
.btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: var(--transparent-middle-hover);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s;
  user-select: none;
  cursor: pointer;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.left-btn {
  left: -40px;
}
.right-btn {
  right: -35px;
}
</style>
