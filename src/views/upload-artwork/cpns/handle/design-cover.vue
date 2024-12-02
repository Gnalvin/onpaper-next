<template>
  <div class="content">
    <div class="preview">
      <div class="cover">
        <img :src="imgUrl" alt="" draggable="false" />
        <div class="mask">
          <div class="info">
            <div class="username">
              {{ mainStore.userName }}
            </div>
            <div class="like-view">
              <span>
                <svg
                  t="1648041518654"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3414"
                  width="14"
                  height="14"
                >
                  <path
                    d="M533.504 268.288q33.792-41.984 71.68-75.776 32.768-27.648 74.24-50.176t86.528-19.456q63.488 5.12 105.984 30.208t67.584 63.488 34.304 87.04 6.144 99.84-17.92 97.792-36.864 87.04-48.64 74.752-53.248 61.952q-40.96 41.984-85.504 78.336t-84.992 62.464-73.728 41.472-51.712 15.36q-20.48 1.024-52.224-14.336t-69.632-41.472-79.872-61.952-82.944-75.776q-26.624-25.6-57.344-59.392t-57.856-74.24-46.592-87.552-21.504-100.352 11.264-99.84 39.936-83.456 65.536-61.952 88.064-35.328q24.576-5.12 49.152-1.536t48.128 12.288 45.056 22.016 40.96 27.648q45.056 33.792 86.016 80.896z"
                    p-id="3415"
                    fill="#ffffff"
                  ></path>
                </svg>
              </span>
              0
              <span>
                <svg
                  t="1648040968902"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4778"
                  width="14"
                  height="14"
                >
                  <path
                    d="M720.398507 959.573333c73.045333 31.317333 136.96-15.317333 129.706666-94.293333l-20.650666-226.218667 174.634666-199.722666c38.144-43.648 19.2-102.229333-37.418666-115.114667l-258.474667-58.794667-135.68-228.010666c-29.738667-49.877333-91.306667-49.92-121.045333 0L315.74784 265.429333 57.273173 324.224C0.953173 337.066667-18.33216 395.648 19.854507 439.338667l174.634666 199.722666-24.021333 264.405334c-5.248 57.770667 44.544 94.037333 97.877333 71.125333l243.626667-104.533333 208.426667 89.472z"
                    fill="#ffffff"
                    p-id="4779"
                  ></path>
                </svg>
              </span>
              0
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="design">
      <CanvasUtil
        ref="canvasUtil"
        :cutScale="1.3"
        :imgUrl="imgUrl"
        @imgInfo="handleImgInfo"
        @scale="scale"
        @mouseMove="mouseMove"
        @imgLoad="preFirstCover"
        @stop="stopMove"
        :wrap-height="270"
        :wrap-width="480"
      ></CanvasUtil>
      <div class="img-list">
        <SmallImgList :urlList="urlList" @toImg="changeImg"></SmallImgList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useMainStore from '@/stores/module/main'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import { CanvasUtil } from '@/components/canvas'
import SmallImgList from './small-img-list.vue'

const uploadStore = useUploadArtworkStore()
const mainStore = useMainStore()

//获取图片列表
const imgList = computed(() => uploadStore.urlList)
// 封面展示 需要处理的代码
const coverScale = ref(1)
const coverTop = ref('0px')
const coverLeft = ref('0px')

//将图片传给 canvas
const imgUrl = ref(imgList.value[0].url) //默认第一张
//改变封面
const changeImg = (index: number, pageNum: number) => {
  imgUrl.value = imgList.value[index + pageNum * 6].url
}
// 图片列表 每6个一组
const urlList = computed(() => {
  const tempList = []
  let i = 0
  while (i < uploadStore.urlList.length) {
    tempList.push(uploadStore.urlList.slice(i, (i += 6)))
  }
  return tempList
})

// 初始化参数
let firstScale = 1 //图片缩放
let imgHeight = 0 // 图片高
let imgWidth = 0 // 图片宽
// 记录上一次鼠标停止时的位置
let lastLeft: any = 0
let lastTop = 0

//处理canvas传过来的 图片信息
type imgInfoType = {
  width: number
  height: number
  shape: number
}
const handleImgInfo = (imgInfo: imgInfoType) => {
  imgHeight = imgInfo.height
  imgWidth = imgInfo.width
  // imgInfo.shape  有两种情况 对应不同形状
  if (imgInfo.shape === 1) {
    // 260为展示的宽度 除实际宽度 得到缩放比例
    coverScale.value = 260 / imgInfo.width
    firstScale = 260 / imgInfo.width
  } else {
    coverScale.value = 200 / imgInfo.height
    firstScale = 200 / imgInfo.height
  }

  // 初始显示时 显示的位置 左右居中 上下偏上
  lastLeft = (260 - firstScale * imgWidth) / 2
  lastTop = (200 - firstScale * imgHeight) / 3.3

  coverTop.value = lastTop + 'px'
  coverLeft.value = lastLeft + 'px'
}
// canvas改变缩放比例时 同时改变showCover 比例
const scale = (scaleNum: number) => {
  coverScale.value = firstScale * scaleNum
  mouseMove(0, 0)
}

// 拖动 canvas时传过来 鼠标移动距离
const mouseMove = (x: number, y: number) => {
  const newPosition = checkPosition(x, y, lastLeft, lastTop)
  coverTop.value = newPosition.newTop + 'px'
  coverLeft.value = newPosition.newLeft + 'px'
}

// 检查是否超出边界函数
const checkPosition = function (
  x: number,
  y: number,
  lastLeft: number,
  lastTop: number
) {
  // 图片会随着缩放改变大小 通过缩放系数得到 目前的长度高度
  const newHeight = imgHeight * coverScale.value
  const newWidth = imgWidth * coverScale.value
  const canRight = 260 - newWidth
  const canTop = 200 - newHeight
  // 新的位置等于 移动距离加上一次停留
  let newTop = y + lastTop
  let newLeft = x + lastLeft
  if (newLeft <= canRight) newLeft = canRight
  if (newLeft >= 0) newLeft = 0
  if (newTop >= 0) newTop = 0
  if (newTop <= canTop) newTop = canTop
  return { newLeft, newTop }
}

// 停止移动后
const stopMove = () => {
  lastTop = Number(coverTop.value.split('p', 1)[0])
  lastLeft = Number(coverLeft.value.split('p', 1)[0])
}

// 保存信息
const canvasUtil = ref<InstanceType<typeof CanvasUtil>>()
// 暴露方法给外部 保存封面
const saveImg = () => {
  setTimeout(async () => {
    const blob = await canvasUtil.value!.saveImg()
    uploadStore.coverBlob = blob
    uploadStore.coverUrl = URL.createObjectURL(blob)
  })
}

// 挂载时先保存一份到store 给 第一次预览
let isFirstPreview = true
const preFirstCover = () => {
  if (isFirstPreview) {
    isFirstPreview = false
    saveImg()
  }
}

defineExpose({ saveImg })
</script>

<style scoped lang="less">
@import '../css/common.less';
img {
  position: absolute;
  top: v-bind(coverTop);
  left: v-bind(coverLeft);
  transform: scale(v-bind(coverScale));
  transform-origin: left top;
}

.img-list {
  width: 100%;
  max-width: 479px;
  border-top: 1px solid #d7e4ff;
  background-color: #d7e4ff30;
}

:deep(.img-list) {
  span {
    margin: 0 5px;
  }
  .show-wrap {
    .item {
      margin: 12px 6px;
      height: 50px;
      width: 50px;
      object-fit: cover;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .item:hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  }
}
</style>
