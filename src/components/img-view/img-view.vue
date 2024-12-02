<template>
  <teleport to="body">
    <transition appear>
      <div class="img-view" v-if="!isClose">
        <div class="svg close" @click="closeView">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
              fill="rgba(255,255,255,1)"
            />
          </svg>
        </div>
        <div class="close-wrap" @click="closeView"></div>
        <div
          class="svg arrows-left"
          @click="preImg"
          title="上一张"
          v-if="picList.length > 1"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="white" fill-opacity="0.01" />
            <path
              d="M24 36L12 24L24 12"
              stroke="#ffffff"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36 36L24 24L36 12"
              stroke="#ffffff"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div
          class="svg arrows-right"
          @click="nextImg"
          title="下一张"
          v-if="picList.length > 1"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="white" fill-opacity="0.01" />
            <path
              d="M12 12L24 24L12 36"
              stroke="#ffffff"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24 12L36 24L24 36"
              stroke="#ffffff"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="body">
          <transition appear>
            <div class="img-wrap">
              <div class="item">
                <template v-for="(item, i) in previewList" :key="item.sort">
                  <img
                    v-if="index === i"
                    ref="imgEL"
                    v-lazy-img="
                      item.isShowHd ? item.highQuality : item.fileName
                    "
                    alt=""
                    @load="loadSuccess"
                    :style="imgStyle"
                    @mousedown="handleMouseDown"
                    @error="handleImgError"
                  />
                </template>

                <round-loading
                  class="loading"
                  v-if="isHighQuality && !isHDFinish"
                  :is-finish="isHDFinish"
                ></round-loading>
                <ring-loading v-if="!imgFinish"></ring-loading>
              </div>
            </div>
          </transition>
        </div>
        <div class="footer">
          <div class="utils">
            <template v-if="previewList[index].highQuality">
              <span
                :title="!imgFinish ? '请等待图片加载完成' : '加载原图'"
                :class="{ disable: !imgFinish }"
                @click="handleLoadHD"
                v-if="!isHDFinish"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M4 5v14h16V5H4zM3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm4.5 8.25h2V9H11v6H9.5v-2.25h-2V15H6V9h1.5v2.25zm7-.75v3H16a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-1.5zM13 9h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3V9z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
              <span v-else>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="48"
                    height="48"
                    fill="white"
                    fill-opacity="0.01"
                  />
                  <path
                    d="M24 4L29.2533 7.83204L35.7557 7.81966L37.7533 14.0077L43.0211 17.8197L41 24L43.0211 30.1803L37.7533 33.9923L35.7557 40.1803L29.2533 40.168L24 44L18.7467 40.168L12.2443 40.1803L10.2467 33.9923L4.97887 30.1803L7 24L4.97887 17.8197L10.2467 14.0077L12.2443 7.81966L18.7467 7.83204L24 4Z"
                    fill="#4a90e2"
                    stroke="#4a90e2"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 24L22 29L32 19"
                    stroke="#FFF"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                原图已加载
              </span>
            </template>

            <span class="large" title="放大" @click="handleActions('zoomIn')">
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"
                ></path>
              </svg>
            </span>
            <span class="small" title="缩小" @click="handleActions('zoomOut')">
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zM352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64z"
                ></path>
              </svg>
            </span>
            <span
              class="full-screen"
              title="实际图片尺寸"
              @click="changeOriginalSize"
            >
              <svg
                v-if="!isShowOriginalSize"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64v.064zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64l-192 .192zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64v-.064z"
                ></path>
              </svg>
              <svg
                v-else
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                <path
                  d="M42 7H6C4.89543 7 4 7.89543 4 9V39C4 40.1046 4.89543 41 6 41H42C43.1046 41 44 40.1046 44 39V9C44 7.89543 43.1046 7 42 7Z"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="3"
                />
                <path
                  d="M12 20.5799L16 18V30"
                  stroke="#ffffff"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M31 20.5799L35 18V30"
                  stroke="#ffffff"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 20V21"
                  stroke="#ffffff"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="M24 27V28"
                  stroke="#ffffff"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span
              class="left"
              title="逆时针旋转"
              @click="handleActions('anticlockwise')"
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  fill="rgba(255,255,255,1)"
                  d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"
                ></path>
              </svg>
            </span>
            <span
              class="right"
              title="顺时针旋转"
              @click="handleActions('clockwise')"
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  fill="rgba(255,255,255,1)"
                  d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { useEventListener } from '@vueuse/core'
import { EVENT_CODE } from '@/components/config/event_code'
import { roundLoading, ringLoading } from '@/components/loading'
import { deepClone } from '@/utils/deep-clone'
import { throttle } from '@/utils/throttle'
import type { ImageViewerAction, fileType } from './type'

const props = defineProps({
  picList: {
    type: Array as PropType<fileType[]>,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.9)'
  }
})
const emits = defineEmits(['close'])
const previewList = ref<fileType[]>(deepClone(props.picList))

const index = ref(props.index)

//img图片加载成功后调用
const imgFinish = computed(() => previewList.value[index.value].isFinish)
const isHDFinish = computed(() => previewList.value[index.value].isHDOk)
const loadSuccess = (event: Event) => {
  const imgEl = event.target as HTMLImageElement
  imgEl.style.opacity = '1'
  previewList.value[index.value].isFinish = true
  //如果不是显示原图 图片加载时不加载进度条
  if (!isHighQuality.value) return
  previewList.value[index.value].isHDOk = true
}

//是否显示高清图片
const isHighQuality = computed(() => previewList.value[index.value].isShowHd)
const handleLoadHD = () => {
  if (!imgFinish.value) return
  previewList.value[index.value].isShowHd = true
}
// 通过这几个css元素改变图片 旋转放大等
const transform = ref({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false
})
//重置样式 函数
function reset() {
  transform.value = {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
  }
}
//下一张图片
const nextImg = () => {
  reset()
  // 如果当前索引小于 图片长度 允许下一张
  if (index.value < props.picList.length - 1) {
    index.value++
  } else {
    // 到头转到第一张
    index.value = 0
  }
}
//上一张图片
const preImg = () => {
  reset()
  if (index.value > 0) {
    index.value--
  } else {
    //到头了 转到最后一张
    index.value = props.picList.length - 1
  }
}

//处理图片Action函数 旋转,放大
function handleActions(action: ImageViewerAction, options = {}) {
  if (!imgFinish.value) return
  // enableTransition 是否开启动画  可以传 options={enableTransition:true} 替换掉
  const { zoomRate, rotateDeg, enableTransition } = {
    zoomRate: 1.4,
    rotateDeg: 90,
    enableTransition: true,
    ...options
  }
  switch (action) {
    //缩小
    case 'zoomOut':
      // 缩小系数最大为0.2 0.2倍
      if (transform.value.scale > 0.2) {
        transform.value.scale = Number.parseFloat(
          (transform.value.scale / zoomRate).toFixed(3)
        )
      }
      break
    //放大
    case 'zoomIn':
      // 放大系数最大为7 7倍
      if (transform.value.scale < 7) {
        transform.value.scale = Number.parseFloat(
          (transform.value.scale * zoomRate).toFixed(3)
        )
      }
      break
    //顺时针
    case 'clockwise':
      transform.value.deg += rotateDeg
      break
    //逆时针
    case 'anticlockwise':
      transform.value.deg -= rotateDeg
      break
  }
  //开启0.3s的动画
  transform.value.enableTransition = enableTransition
}
//通过动态样式 改变img元素显示
const imgStyle = computed(() => {
  const { scale, deg, offsetX, offsetY, enableTransition } = transform.value
  let translateX = offsetX / scale
  let translateY = offsetY / scale
  //如果图片被拖拽过 旋转需要镜像改变 translate 坐标
  switch (deg % 360) {
    case 90:
    case -270:
      ;[translateX, translateY] = [translateY, -translateX]
      break
    case 180:
    case -180:
      ;[translateX, translateY] = [-translateX, -translateY]
      break
    case 270:
    case -90:
      ;[translateX, translateY] = [-translateY, translateX]
      break
  }

  const style: CSSProperties = {
    transform: `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? 'transform .3s' : ''
  }
  // 如果显示原图为true 则 改变图片大小
  if (isShowOriginalSize.value) {
    style.maxWidth = style.maxHeight = '100%'
  }
  return style
})

// 切换原图大小显示
const isShowOriginalSize = ref(false)
function changeOriginalSize() {
  if (!imgFinish.value) return
  isShowOriginalSize.value = !isShowOriginalSize.value
  reset()
}
// 鼠标滚动时 放大缩小
const mousewheelHandler = throttle(
  (e: WheelEvent | any /* TODO: wheelDelta is deprecated */) => {
    const delta = e.wheelDelta ? e.wheelDelta : -e.detail
    if (delta > 0) {
      handleActions('zoomIn', {
        zoomRate: 1.04,
        enableTransition: false
      })
    } else {
      handleActions('zoomOut', {
        zoomRate: 1.04,
        enableTransition: false
      })
    }
  }
)
//监听鼠标滚动事件
useEventListener(document, 'mousewheel', mousewheelHandler)

// 鼠标按下时 处理拖拽
function handleMouseDown(e: MouseEvent) {
  if (!imgFinish.value) return
  //关闭动画
  transform.value.enableTransition = false
  // 获取初始值
  const { offsetX, offsetY } = transform.value
  const startX = e.pageX
  const startY = e.pageY

  const dragHandler = throttle((ev: MouseEvent) => {
    transform.value = {
      ...transform.value,
      offsetX: offsetX + ev.pageX - startX,
      offsetY: offsetY + ev.pageY - startY
    }
  })
  //监听鼠标移动
  const removeMousemove = useEventListener(document, 'mousemove', dragHandler)
  //当鼠标抬起 取消监听
  useEventListener(document, 'mouseup', () => {
    removeMousemove()
  })
  //禁止图片拖拽
  e.preventDefault()
}
//处理键盘按键
const keydownHandler = throttle((e: KeyboardEvent) => {
  switch (e.code) {
    // ESC
    case EVENT_CODE.esc:
      closeView()
      break
    // SPACE
    case EVENT_CODE.space:
      e.preventDefault()
      changeOriginalSize()
      break
    // LEFT_ARROW
    case EVENT_CODE.left:
      e.preventDefault()
      preImg()
      break
    // UP_ARROW
    case EVENT_CODE.up:
      e.preventDefault()
      handleActions('zoomIn')
      break
    // RIGHT_ARROW
    case EVENT_CODE.right:
      e.preventDefault()
      nextImg()
      break
    // DOWN_ARROW
    case EVENT_CODE.down:
      e.preventDefault()
      handleActions('zoomOut')
      break
  }
}, 0)

useEventListener(document, 'keydown', keydownHandler)

//当图片加载错误时
function handleImgError(e: Event) {
  previewList.value[index.value].isFinish = true
  ;(e.target as HTMLImageElement).alt = '图片加载错误'
}

const isClose = ref(false)
const closeView = () => {
  isClose.value = true
  //动画完成后才关闭组件
  setTimeout(() => {
    emits('close')
  }, 0)
}
</script>

<style scoped lang="less">
.img-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: v-bind('props.backgroundColor');
  backdrop-filter: blur(3px);
  user-select: none;
  min-width: 1050px;
}
.close {
  right: 30px;
  top: 30px;
  background-color: #9e9e9e54;
}

.close-wrap {
  bottom: 55px;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.arrows-right {
  right: 25px;
  top: 50%;
}
.arrows-left {
  left: 25px;
  top: 50%;
}
.svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
}

.body {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 85%;
  height: 100%;
  .img-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      img {
        max-width: 100%;
        max-height: calc(100vh - 50px);
        color: white;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
      }
    }
  }
}
.footer {
  font-size: 12px;
  color: white;
  .utils {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 755px;
    height: 50px;
    border-color: #fff;
    border-radius: 22px;
    span {
      width: 100px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      fill: rgba(255, 255, 255, 1);
      svg {
        margin: 0 5px;
      }
    }
  }
}
.disable {
  cursor: not-allowed !important;
}
</style>
