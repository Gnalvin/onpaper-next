<template>
  <div class="canvas-wrap" ref="canvasWrap">
    <canvas
      ref="canvasEl"
      id="canvas"
      style="width: 100%; height: 100%; cursor: grab"
      @mousedown="handleCanvasMouseDown"
    ></canvas>
  </div>
  <div class="rang">
    <svg
      @click="handleDecrease"
      t="1640766526572"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="7251"
      width="20"
      height="20"
    >
      <path
        d="M769.024 449.536q26.624 0 45.056 18.432t18.432 45.056-18.432 45.568-45.056 18.944l-513.024 0q-26.624 0-45.568-18.944t-18.944-45.568 18.944-45.056 45.568-18.432l513.024 0z"
        p-id="7252"
      ></path>
    </svg>
    <div class="range-input">
      <el-slider
        @input="handleScalingChange"
        v-model="rangeValue"
        :min="minFactor"
        :max="maxFactor"
        :step="0.01"
        :show-tooltip="false"
      ></el-slider>
    </div>
    <svg
      @click="handleIncrease"
      t="1640765563982"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="5755"
      width="18"
      height="18"
    >
      <path
        d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z"
        p-id="5756"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type PropType } from 'vue'
import { useEventListener } from '@vueuse/core'
import { DataURIToBlob } from '@/utils/handle-img'

const props = defineProps({
  //图片剪切的比例 x:y
  cutScale: {
    type: Number,
    default: 1
  },
  maskShape: {
    type: String as PropType<'rectangle' | 'round'>,
    default: 'rectangle'
  },
  imgUrl: {
    type: String,
    required: true
  },
  // 如果获取不到 wrap 的高度可以传入写死 弥补(v-show的情况)
  wrapWidth: {
    type: Number,
    default: 0
  },
  wrapHeight: {
    type: Number,
    default: 0
  },
  quality: {
    type: Number,
    default: 1
  }
})
const emits = defineEmits(['imgInfo', 'scale', 'mouseMove', 'stop', 'imgLoad'])

const canvasWrap = ref<HTMLDivElement>()
//  需要在挂着元素后 拿到canvas 元素
const canvasEl = ref<HTMLCanvasElement>()
const canvasCtx = computed(() => canvasEl.value?.getContext('2d')!)

let setPixel: number // 初始canvas像素

//上次移动结束,canvas画图的位置
let lastImgX = 0
let lastImgY = 0
let canvasScale: number
// 创建img 元素
const imgEl = new Image()
onMounted(() => {
  watch(
    () => props.imgUrl,
    (url) => {
      imgEl.src = url
      //清空上一张的像素
      setPixel = 0
      isFirstDrawMask = true
      lastMouseX = 0
      lastMouseY = 0
      lastImgX = 0
      lastImgY = 0
      scalingFactor = 1
    },
    { immediate: true }
  )
  imgEl.onload = () => {
    // 获取画布比例
    const width = props.wrapWidth
      ? props.wrapWidth
      : canvasWrap.value?.clientWidth
    const height = props.wrapHeight
      ? props.wrapHeight
      : canvasWrap.value?.clientHeight

    const canvas = canvasEl.value!
    canvasScale = width! / height!

    calculateFactor() //绘制图像前 先初始化缩放参数
    drawMusk()
    // 第一次画 左右居中 上下偏上位置
    lastImgX = (canvas.width - imgEl.naturalWidth * scalingFactor) / 2
    lastImgY = (canvas.height - imgEl.naturalHeight * scalingFactor) / 3.3
    redrawImg(0, 0)
    // 图片加载就绪 可以调用 saveImg 方法
    emits('imgLoad')
  }
})

// ----------------------计算初始因子 Factor/-----------------------
let rangeValue = ref(0) // rangInput 绑定的值
let minFactor = ref(0) //最小放缩倍数
let maxFactor = ref(0) //最大放缩倍数

let minSidesLen: number // 最小边的长度 px
let scalingFactor = 1 //// 设定 初始的 显示大小 也是缩放系数

const calculateFactor = () => {
  const canvas = canvasEl.value!
  // 原始图片的 宽高比
  const scale = imgEl.naturalWidth / imgEl.naturalHeight
  //将图片 信息 以及属于哪一种大小发送出去
  const imgInfo = {
    width: imgEl.naturalWidth,
    height: imgEl.naturalHeight,
    shape: 1
  }
  //竖长图片或正方形
  if (scale <= props.cutScale) {
    // 竖长图片最小边为 width
    minSidesLen = imgEl.naturalWidth
    //如果像素太小 则用最小边 作为像素
    if (imgEl.naturalHeight < 1440) {
      canvas.height = minSidesLen / canvasScale
      canvas.width = minSidesLen
    } else {
      //如果像素太大 则固定为 1440像素 的canvas
      setPixel = 1440
      canvas.height = setPixel / canvasScale
      canvas.width = setPixel
    }
    // canvas.height * prop.cutScale 是蒙版的宽, 比上 原始的宽 得出缩放比例,让图片宽填满 蒙版的宽
    scalingFactor = (canvas.height * props.cutScale) / imgEl.naturalWidth

    imgInfo.shape = 1
    // 发送图片信息
    emits('imgInfo', imgInfo)
  } else {
    //扁图片
    minSidesLen = imgEl.naturalHeight
    if (imgEl.naturalWidth < 1440) {
      canvas.height = minSidesLen / canvasScale
      canvas.width = minSidesLen
    } else {
      setPixel = 1440
      canvas.height = setPixel / canvasScale
      canvas.width = setPixel
    }
    // 宽填满 canvas
    scalingFactor = canvas.height / imgEl.naturalHeight
    imgInfo.shape = 2
    // 发送图片信息
    emits('imgInfo', imgInfo)
  }

  minFactor.value = scalingFactor // 可拖拉的时候 初始状态
  maxFactor.value = scalingFactor * 2
  rangeValue.value = minFactor.value
}

// ----------------------下面的代码为画出canvas-----------------------
// 蒙版函数 每次拖拽都要重新画蒙版
let isFirstDrawMask = true //  是否第一次画
let maskTopBack: number // 高亮蒙版距离 上边框 的长度
let maskLeftBack: number // 高亮蒙版距离 左边框 的长度
let maskHeight: number // 高亮部分蒙版的 高
let maskWidth: number // 高亮部分蒙版的 宽

const drawMusk = () => {
  const canvas = canvasEl.value!
  const ctx = canvasCtx.value
  // 底部的蒙版颜色
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  // 矩形模版
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  //以上代码相当于画好了一个 下面代码 相当于再画一个

  //需要显示部分的蒙版区域
  if (isFirstDrawMask) {
    isFirstDrawMask = false
    // 只赋值一次给蒙版 之后蒙版大小不变
    maskHeight = canvas.height
    maskWidth = maskHeight * props.cutScale
    maskTopBack = (canvas.height - maskHeight) / 2
    maskLeftBack = (canvas.width - maskWidth) / 2
    //第一次画开始监听
    startMouseListener()
  }
  // 再画一个框
  ctx.strokeStyle = '#d7e4ff'
  ctx.lineWidth = 2
  ctx.strokeRect(maskLeftBack, maskTopBack, maskWidth, maskHeight)

  //需要显示部分的蒙版颜色
  ctx.fillStyle = 'rgba(0,0,0,1)'

  // 下面一行代码相当于 显示的全黑蒙版 把底部的蒙版挡住的地方 变成透明 无底部蒙版
  ctx.globalCompositeOperation = 'destination-out' //globalCompositeOperation提供canvas里图像的组合方式
  // 圆形蒙版
  // 圆心x轴坐标。圆心的y轴坐标。圆弧的半径。
  if (props.maskShape === 'round') {
    ctx.arc(canvas.width / 2, canvas.height / 2, maskHeight / 2, 0, 2 * Math.PI)
  } else {
    ctx.fillRect(maskLeftBack, maskTopBack, maskWidth, maskHeight) //矩形
  }
  ctx.fill()
  ctx.globalCompositeOperation = 'destination-over'
}
// 每拖动一次则重画一次canvas
const redrawImg = function (pX: number, pY: number) {
  const canvas = canvasEl.value!
  const ctx = canvasCtx.value

  //每次重画都要 设定像素
  canvas.height = setPixel ? setPixel / canvasScale : minSidesLen / canvasScale
  canvas.width = setPixel ? setPixel : minSidesLen

  drawMusk()

  // 每次绘图前检查position是否没有超出区域
  var newPosition = checkPosition(pX, pY, lastImgX, lastImgY)

  // context.drawImage(img,x,y,width,height);
  // img是绘制图片的dom对象 x,y 绘制图片左上角的坐标，width 绘制图片的宽度，height：绘制图片的高度
  ctx.drawImage(
    imgEl,
    newPosition.X,
    newPosition.Y,
    imgEl.naturalWidth * scalingFactor,
    imgEl.naturalHeight * scalingFactor
  )
}

// ----------------------下面的代码为拖动相关-----------------------
/**
 * 检查拖动位置是否超出
 * @param pX 当前x位置
 * @param pY 当前y位置
 * @param lastImgX 上一次x
 * @param lastImgY 上一次y
 */
const checkPosition = function (
  pX: number,
  pY: number,
  lastImgX: number,
  lastImgY: number
) {
  // 获取图片在canvas的长度
  let imgWidth = imgEl.naturalWidth * scalingFactor
  let imgHigh = imgEl.naturalHeight * scalingFactor

  // 右拖 +++ 左拖 ---  下托 +++ 上托 ----
  //右拖（+++）不能超过蒙版和蒙版间隔 ，左拖（---）不能小于 图片最边和蒙版之间的间隔
  if (
    pX + lastImgX <= maskLeftBack &&
    pX + lastImgX >= maskWidth + maskLeftBack - imgWidth &&
    pY + lastImgY <= maskTopBack &&
    pY + lastImgY >= maskHeight + maskTopBack - imgHigh
  ) {
    return { X: pX + lastImgX, Y: pY + lastImgY }
  } else {
    let x_ = pX + lastImgX
    let y_ = pY + lastImgY
    if (pX + lastImgX > maskLeftBack) {
      x_ = maskLeftBack
    }
    if (pX + lastImgX < maskWidth + maskLeftBack - imgWidth) {
      x_ = maskWidth + maskLeftBack - imgWidth
    }
    if (pY + lastImgY > maskTopBack) {
      y_ = maskTopBack
    }
    if (pY + lastImgY < maskHeight + maskTopBack - imgHigh) {
      y_ = maskHeight + maskTopBack - imgHigh
    }
    return { X: x_, Y: y_ }
  }
}

// 监听 鼠标移状态
type movieStatusType = 'moving' | 'stop'
let movingStatus: movieStatusType = 'stop' // 是否处于拖动状态
let lastMouseX: number
let lastMouseY: number

//再canvas范围里，鼠标按下onmousedown：开始进入可拖动状态
const handleCanvasMouseDown = function (e: MouseEvent) {
  movingStatus = 'moving'
  // 设定鼠标按下的位置为初始位置
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

// 鼠标移动onmousemove：获取移动位移（pX，pY）
const handleWindowMouseMove = function (e: MouseEvent) {
  if (movingStatus === 'moving') {
    // 移动位置-初始位置 = 位移
    const pX = e.clientX - lastMouseX
    const pY = e.clientY - lastMouseY
    emits('mouseMove', pX, pY)
    // 这个x ,y是系数是为 让其对照 200*260 的框 移动速度一样
    // x=y
    const y = canvasEl.value!.height / 200
    redrawImg(pX * y, pY * y)
  }
}
//鼠标抬起onmouseup：结束拖动状态，并取消可拖动状态
const handleWindowMouseUp = function (e: MouseEvent) {
  if (movingStatus === 'moving') {
    movingStatus = 'stop'
    //x ,y是系数是为和之前 加快拖动的速度 坐标对应
    const y = canvasEl.value!.height / 200
    // const x = maskWidth / 260
    const newPosition = checkPosition(
      (e.clientX - lastMouseX) * y,
      (e.clientY - lastMouseY) * y,
      lastImgX,
      lastImgY
    )
    //每次移动完成都要记录上次 停止拖动的位置
    lastImgX = newPosition.X
    lastImgY = newPosition.Y
    emits('stop')
  }
}
const startMouseListener = () => {
  useEventListener(window, 'mousemove', handleWindowMouseMove)
  useEventListener(window, 'mouseup', handleWindowMouseUp)
}

// ------------ 下面的代码为控制缩放---------------
let timer: any
const handleScalingChange = () => {
  scalingFactor = rangeValue.value
  emits('scale', scalingFactor / minFactor.value)
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0)
  // 最后也要改变 lastImg 位置
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const newPosition = checkPosition(0, 0, lastImgX, lastImgY)
    lastImgX = newPosition.X
    lastImgY = newPosition.Y
  }, 200)
}

// ------------ 下面的代码为基本控制---------------
// 递减缩放
const handleDecrease = () => {
  if (isFirstDrawMask) return
  const range = (maxFactor.value - minFactor.value) / 20
  rangeValue.value = rangeValue.value - range
  scalingFactor = rangeValue.value
  emits('scale', scalingFactor / minFactor.value)
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0)
}

// 递增缩放
const handleIncrease = () => {
  if (isFirstDrawMask) return
  const range = (maxFactor.value - minFactor.value) / 20
  rangeValue.value = rangeValue.value + range
  scalingFactor = rangeValue.value
  emits('scale', scalingFactor / minFactor.value)
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0)
}

// 保存头像
const saveImg = () => {
  // 创建一个新的 canvas
  const newCanvas = document.createElement('canvas')
  newCanvas.setAttribute('id', 'newCanvas')
  newCanvas.width = maskWidth // 大小和蒙版大小一样
  newCanvas.height = maskHeight
  const newCtx = newCanvas.getContext('2d')
  let newPosition = checkPosition(0, 0, 0, 0) // 没有移动过则 按缩放的坐标
  // 如果移动过 新的起始坐标为 移动过的
  if (lastImgX || lastImgY) {
    newPosition.X = lastImgX
    newPosition.Y = lastImgY
  }
  // 画到新的canvas上去
  newCtx?.drawImage(
    imgEl,
    newPosition.X - maskLeftBack,
    newPosition.Y - maskTopBack,
    imgEl.naturalWidth * scalingFactor,
    imgEl.naturalHeight * scalingFactor
  )
  // 导出图片
  const base64 = newCanvas.toDataURL('image/jpeg', props.quality)
  const imgBlob = DataURIToBlob(base64)
  return imgBlob
}

defineExpose({ saveImg })
</script>

<style scoped lang="less">
.canvas-wrap {
  width: 100%;
  height: 270px;
}

.rang {
  display: flex;
  margin: 15px 0px;
  justify-content: center;
  align-items: center;
  svg {
    fill: var(--color-text3);
    cursor: pointer;
  }
  .range-input {
    width: 170px;
    margin: 0 10px 0 15px;
  }
}
</style>
