<template>
  <teleport to="body">
    <div class="top-mask-layer wrap" @mousedown.self="closeUpload">
      <div class="container">
        <div class="title">
          <span>编辑头像</span>
          <span class="tip">拖动调整大小和位置</span>
        </div>
        <div class="upload-main">
          <div class="upload-tip" v-show="isShowTipUpload">
            <div class="tip-img">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.0654 27.8812L23.9999 20.9238L31.1318 28.0002"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 38.0001V24.4619"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="tip-text">点击上传图片</div>
            </div>
            <div class="type-warn" v-if="isNotImg">
              上传的不是图片... _(:з」∠)_
            </div>
            <div class="type-warn" v-if="isLarge">
              上传图片须小于10M... _(:з」∠)_
            </div>
            <UploadUtil
              @fileData="handleFileData"
              :fileSize="10"
              ref="uploadUtils"
            ></UploadUtil>
          </div>
          <div
            class="canvas"
            v-show="!isShowTipUpload"
            :class="{ show: !isShowTipUpload }"
          >
            <canvas
              id="canvas"
              style="width: 250px; height: 250px; cursor: grab"
              ref="canvasEL"
              @mousedown="handleCanvasMouseDown"
            ></canvas>
          </div>
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
        <div class="btn">
          <ElButton class="reset" @click="reset()">重选</ElButton>
          <ElButton class="save" @click="saveAvatar" :disable="disableSave">
            保存
          </ElButton>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import UploadUtil from '../../upload/src/upload-util.vue'
import ElButton from '../../button/el-button.vue'
import useMainStore from '@/stores/module/main'

import { notification } from '@/components/notification'
import { verifySize } from '@/utils/handle-img'
import type { IFilePayload } from '@/components/upload/type'
import { compress } from '@/utils/handle-img'

const emits = defineEmits(['close', 'upload'])
const mainStore = useMainStore()

//  需要在挂着元素后 拿到canvas 元素
const canvasEL = ref<HTMLCanvasElement>()
const ctx = computed(() => {
  return canvasEL.value?.getContext('2d') as CanvasRenderingContext2D
})

let setPixel: number // 初始canvas像素

const isShowTipUpload = ref(true) // 是否显示提示上传

//上次移动结束,canvas画图的位置
let lastImgX = 0
let lastImgY = 0

// --------------处理本地上传图片--------------
const isLarge = ref(false)
const isNotImg = ref(false)
const disableSave = ref(true) // 保存按钮是否可点击

// 创建img 元素
const imgEL = new Image()
const handleFileData = (payload: IFilePayload) => {
  const img = new Image()
  img.src = payload.url
  img.onload = () => {
    if (!verifySize(img.width, img.height, 100)) {
      notification({
        type: 'error',
        title: '上传图片',
        message: '图片尺寸太大或太小啦'
      })
      reset(false)
      return
    }
  }
  isLarge.value = false
  isNotImg.value = false
  // 显示警告
  if (payload.isLarge) {
    isLarge.value = true
    return
  }
  if (!payload.isImage) {
    isNotImg.value = true
    return
  }

  //获取上传凭证
  mainStore.getSTSTokenAction({ type: 'avatars', count: 1 })
  isShowTipUpload.value = false
  disableSave.value = false
  imgEL.src = payload.url
  imgEL.onload = () => {
    calculateFactor(canvasEL.value!, imgEL) //绘制图像前 先初始化缩放参数
    drawMusk(canvasEL.value!, ctx.value)
    ctx.value.globalCompositeOperation = 'destination-over'
    redrawImg(0, 0, canvasEL.value!, ctx.value, 0, 0)
  }
}

// ----------------------计算初始因子 Factor/-----------------------
let rangeValue = ref(0) // rangInput 绑定的值
let minFactor = ref(0) //最小放缩倍数
let maxFactor = ref(0) //最大放缩倍数

let minSideLen: number // 最小边的长度 px
let scalingFactor = 1 //// 设定 初始的 显示大小 也是缩放系数
const calculateFactor = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
  //竖长图片
  if (img.naturalWidth < img.naturalHeight) {
    minSideLen = img.naturalWidth
    //如果像素太大 则固定为 700*700 的canvas
    if (img.naturalHeight < 700) {
      canvas.width = img.naturalWidth * 1.5 // 设定canvas 的像素
      canvas.height = img.naturalWidth * 1.5
    } else {
      setPixel = 700
      canvas.height = setPixel
      canvas.width = setPixel
    }

    scalingFactor = canvas.height / img.naturalHeight // 显示的初始状态
    if (scalingFactor > 1) scalingFactor = 1 // 如果出现 放大情况 变为原比例
    minFactor.value = scalingFactor // 可拖拉的时候 初始状态
    maxFactor.value = scalingFactor * 5
    rangeValue.value = minFactor.value
  } else {
    //扁图片或正方形
    minSideLen = img.naturalHeight
    if (img.naturalWidth < 700) {
      canvas.height = img.naturalHeight * 1.5 // 设定canvas 的像素
      canvas.width = img.naturalHeight * 1.5
    } else {
      setPixel = 700
      canvas.height = setPixel
      canvas.width = setPixel
    }

    scalingFactor = canvas.width / img.naturalWidth
    if (scalingFactor > 1) scalingFactor = 1 // 如果出现 放大情况 变为原比例
    minFactor.value = scalingFactor // 可拖拉的时候 初始状态
    maxFactor.value = scalingFactor * 5
    rangeValue.value = minFactor.value
  }
}

// ----------------------下面的代码为画出canvas-----------------------
// 蒙版函数 每次拖拽都要重新画蒙版
let isFirstDrawMask = true //  是否第一次画
let maskBack: number // 图片距离最外边 蒙版的长度(用于计算图片拖拽是否超出)
let maskLen: number // 高亮部分蒙版的长度(用户能直接看到部分)

const drawMusk = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // 底部的蒙版颜色
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  // 矩形模版
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  //需要显示部分的蒙版颜色
  ctx.fillStyle = 'rgba(0,0,0,1)'
  // 下面一行代码相当于 显示的全黑蒙版 把底部的蒙版挡住的地方 变成透明 无底部蒙版
  ctx.globalCompositeOperation = 'destination-out' //globalCompositeOperation提供canvas里图像的组合方式

  //需要显示部分的蒙版区域
  if (isFirstDrawMask) {
    isFirstDrawMask = false
    // 只赋值一次给蒙版 之后蒙版大小不变
    maskBack = (canvas.width - minSideLen * scalingFactor) / 2
    maskLen = minSideLen * scalingFactor
    //第一次画开始监听
    startMouseListener()
  }
  // 圆形蒙版
  ctx.arc(canvas.width / 2, canvas.width / 2, maskLen / 2, 0, 2 * Math.PI)
  ctx.fill()
  // ctx.fillRect(maskBack, maskBack, maskLen, maskLen) //正方形
}
// 每拖动一次则重画一次canvas
const redrawImg = function (
  pX: number,
  pY: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  lastImgX: number,
  lastImgY: number
) {
  // 每次绘图前检查position是否没有超出区域
  var newPosition = checkPosition(pX, pY, lastImgX, lastImgY)

  // 重设 像素
  canvas.setAttribute(
    'height',
    (setPixel ? setPixel : minSideLen * 1.5).toString()
  )
  canvas.setAttribute(
    'width',
    (setPixel ? setPixel : minSideLen * 1.5).toString()
  )

  drawMusk(canvas, ctx)
  ctx.globalCompositeOperation = 'destination-over'

  // context.drawImage(img,x,y,width,height);
  // img是绘制图片的dom对象 x,y 绘制图片左上角的坐标，width 绘制图片的宽度，height：绘制图片的高度
  ctx.drawImage(
    imgEL,
    newPosition.X,
    newPosition.Y,
    imgEL.naturalWidth * scalingFactor,
    imgEL.naturalHeight * scalingFactor
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
  // 获取图片元素长度
  let imgWidth = imgEL.naturalWidth
  let imgHigh = imgEL.naturalHeight
  // 右拖 +++ 左拖 ---  下托 +++ 上托 ----
  //右拖（+++）不能超过蒙版和蒙版间隔 ，左拖（---）不能小于 图片最边和蒙版之间的间隔
  if (
    pX + lastImgX <= maskBack &&
    pX + lastImgX >= maskLen + maskBack - imgWidth * scalingFactor &&
    pY + lastImgY <= maskBack &&
    pY + lastImgY >= maskLen + maskBack - imgHigh * scalingFactor
  ) {
    return { X: pX + lastImgX, Y: pY + lastImgY }
  } else {
    var x_ = pX + lastImgX
    var y_ = pY + lastImgY
    if (pX + lastImgX > maskBack) {
      x_ = maskBack
    }
    if (pX + lastImgX < maskLen + maskBack - imgWidth * scalingFactor) {
      x_ = maskLen + maskBack - imgWidth * scalingFactor
    }
    if (pY + lastImgY > maskBack) {
      y_ = maskBack
    }
    if (pY + lastImgY < maskLen + maskBack - imgHigh * scalingFactor) {
      y_ = maskLen + maskBack - imgHigh * scalingFactor
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
    redrawImg(
      pX * 2.5,
      pY * 2.5,
      canvasEL.value!,
      ctx.value,
      lastImgX,
      lastImgY
    )
  }
}
//鼠标抬起onmouseup：结束拖动状态，并取消可拖动状态
const handleWindowMouseUp = function (e: any) {
  if (movingStatus === 'moving') {
    movingStatus = 'stop'
    const newPosition = checkPosition(
      (e.clientX - lastMouseX) * 2.5,
      (e.clientY - lastMouseY) * 2.5,
      lastImgX,
      lastImgY
    )
    //每次移动完成都要记录上次 停止拖动的位置
    lastImgX = newPosition.X
    lastImgY = newPosition.Y
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
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0, canvasEL.value!, ctx.value, lastImgX, lastImgY)
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
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0, canvasEL.value!, ctx.value, lastImgX, lastImgY)
}

// 递增缩放
const handleIncrease = () => {
  if (isFirstDrawMask) return
  const range = (maxFactor.value - minFactor.value) / 20
  rangeValue.value = rangeValue.value + range
  scalingFactor = rangeValue.value
  //每次缩放完也都要修改图片的绘制位置，缩放不改变绘制位置，所以参数置为0
  redrawImg(0, 0, canvasEL.value!, ctx.value, lastImgX, lastImgY)
}

// 保存头像
const saveAvatar = async () => {
  // 创建一个新的 canvas
  const newCanvas = document.createElement('canvas')
  newCanvas.setAttribute('id', 'newCanvas')
  newCanvas.width = maskLen // 大小和蒙版大小一样
  newCanvas.height = maskLen
  const newCtx = newCanvas.getContext('2d')
  let newPosition = checkPosition(0, 0, 0, 0) // 没有移动过则 按缩放的坐标
  // 如果移动过 新的起始坐标为 移动过的
  if (lastImgX || lastImgY) {
    newPosition.X = lastImgX
    newPosition.Y = lastImgY
  }
  // 画到新的canvas上去
  newCtx?.drawImage(
    imgEL,
    newPosition.X - maskBack,
    newPosition.Y - maskBack,
    imgEL.naturalWidth * scalingFactor,
    imgEL.naturalHeight * scalingFactor
  )
  // 导出图片
  const url = newCanvas.toDataURL('image/jpeg', 1)
  const fileData = await compress(url, 0.9, 240)

  emits('close')
  emits('upload', { fileData, url })
}

// 重选的图片 清空canvas
const uploadUtils = ref<InstanceType<typeof UploadUtil>>()
const reset = (showChange = true) => {
  isShowTipUpload.value = true
  disableSave.value = true
  ctx.value.clearRect(0, 0, canvasEL.value!.width, canvasEL.value!.height)
  if (showChange) uploadUtils.value?.upload() // 调用组件里面的上传方法
  lastImgX = 0
  lastImgY = 0
  isFirstDrawMask = true
  setPixel = 0
  lastMouseX = 0
  lastMouseY = 0
}

// 关闭组件
const closeUpload = () => {
  emits('close')
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
}
.container {
  width: 330px;
  margin: auto;
  border-radius: 24px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  .title {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    padding: 16px;
    color: var(--color-text1);
  }
}
.tip {
  padding: 0 38px;
  margin-top: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: #6f7f9e;
}

.upload-main {
  position: relative;
  margin: 0px 24px;
  .canvas {
    position: relative;
    margin: 0px auto;
    width: 250px;
    height: 250px;
    background-color: #a2a2a2;
  }
}

.upload-tip {
  display: flex;
  justify-content: center;
  position: relative;
  margin: 0px auto;
  width: 250px;
  height: 250px;
  background-color: var(--surface-color2);
  transition: background-color 0.3s ease;
  &:hover {
    background-color: var(--surface-color2-hover);
  }
  .tip-img {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 75px;
    svg {
      stroke: var(--color-text2);
    }
    .tip-text {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text2);
    }
  }
}

.rang {
  display: flex;
  margin-top: 20px;
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

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  padding-bottom: 15px;
}

.save {
  padding: 8px 20px;
  margin-left: 35px;
}

.reset {
  height: 28px;
  border: 1px solid #8590a6;
  background-color: #fff;
  color: #5f6777;
  padding: 8px 20px;
  &:hover {
    background-color: var(--primary-white-hover-color);
  }
}

.type-warn {
  position: absolute;
  top: 0;
  width: 100%;
  line-height: 1.5;
  background-color: rgb(251, 234, 231);
  color: rgb(255, 40, 0);
  text-align: center;
  font-size: 15px;
}

.show {
  animation: show 0.5s ease;
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
