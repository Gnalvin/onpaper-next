<template>
  <div class="sort-wrap">
    <div class="content">
      <div class="head">拖拽调整顺序</div>
      <div class="body" ref="domList">
        <template v-for="(item, index) in urlList" :key="item.index">
          <div class="img-warp" @mousedown.self="dragstart($event, index)">
            <img src="" class="img" />
          </div>
        </template>
        <div class="img-warp add" @click="addImg">
          <div class="add-more">
            <svg
              width="34"
              height="34"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M24 16V32"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 24L32 24"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>点击添加图片</div>
          </div>
        </div>
      </div>
      <div class="foot">
        <ElButton class="save" @click="save">保存修改</ElButton>
        <span class="cancel" @click="cancel">取消修改</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated } from 'vue'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import { changeSortUrlList } from '@/stores/module/upload/artwork/handle'
import { isElement } from '@/components/utils'
import ElButton from '@/components/button/el-button.vue'
const emits = defineEmits(['close', 'addImg'])
const uploadStore = useUploadArtworkStore()

// 图片列表
const urlList = computed(() => uploadStore.urlList)
let imgList: { el: HTMLDivElement; sort: number; index: number }[] = [] // 存放imgDOM数组
const domList = ref<HTMLDivElement>()
const buildSortList = () => {
  // 获取 当前 imgDom的个数 用于分割
  const count = imgList.length
  const divList = domList.value!.children
  const tempList = Array.from(divList).slice(count) as HTMLDivElement[]
  for (let i = 0; i < tempList.length - 1; i++) {
    // children[0] 是第一个 img 元素
    const imgEl = tempList[i].children[0] as HTMLImageElement
    //设置图片 和 透明度
    imgEl.src = `${urlList.value[i + count].url}`
    imgEl.style.opacity = '1'
    // el代表这个元素，sort代表元素排列的位置，index代表当前元素的index，它是不会改变的
    imgList.push({ el: tempList[i], sort: i + count, index: i + count })
  }
}
// 首次挂载时调用
onMounted(() => {
  setTimeout(buildSortList)
})
// 后续添加图片时调用
onUpdated(() => {
  buildSortList()
})

const itemSize = 130
let startX: number // 按下鼠标时的位置
let startY: number
let currentDragEl: HTMLDivElement | null // 当前被拖拽的元素
let cloneObj: HTMLDivElement | null // 复制的元素
let transX = 0 // css 里面transform 的值
let transY = 0
let elementIndex: number // 当前被拖拽元素是第几个 也对应着数组的位置
let dragIndex: number // 当前拖拽元素 排序后的位置
// 鼠标按下开始调用
const dragstart = (event: MouseEvent, index: number) => {
  // 当前被拖拽的元素
  currentDragEl = event.target as HTMLDivElement
  // 目前拖动位置
  startX = event.pageX
  startY = event.pageY
  // 复制一个假元素 跟着 鼠标走
  if (isElement(event.target)) {
    const rect = event.target.getBoundingClientRect()
    cloneObj = event.target.cloneNode(true) as HTMLDivElement // 深拷贝一个node 节点
    cloneObj.style.transform = '' // 清空复制元素的位置
    cloneObj.style.position = 'fixed'
    cloneObj.style.left = `${rect.left}px`
    cloneObj.style.top = `${rect.top}px`
    cloneObj.style.zIndex = '999'
    cloneObj.style.pointerEvents = 'none'
    cloneObj.style.transition = `all 0s`
    currentDragEl.style.visibility = 'hidden'
    document.body.appendChild(cloneObj)
  }

  // 获取当前元素有没有 transform 过
  const trans = window.getComputedStyle(currentDragEl, null).transform
  const numberPattern = /-?\d+\.?\d*/g
  const values = trans.match(numberPattern)
  if (values) {
    transX = parseInt(values[4])
    transY = parseInt(values[5])
  }

  elementIndex = index // 当前元素在imgList的位置
  dragIndex = imgList[index].sort // 拖拽过的位置
  currentDragEl.style.transition = 'all 0s' // 鼠标在按下时过渡为0，避免在移动时出现过渡效果
  window.addEventListener('mousemove', drag)
  window.addEventListener('mouseup', dragend)
}

//拖拽时调用
const drag = (event: MouseEvent) => {
  // 获取被拖拽元素的父元素
  const parentElement = currentDragEl!.offsetParent as HTMLElement
  // 计算可拖拽范围
  const top = currentDragEl!.offsetTop + transY // 元素外边距离（绝对定位参照）最近定位父元素内壁的距离
  const left = currentDragEl!.offsetLeft + transX
  const right = parentElement!.offsetWidth - left - currentDragEl!.offsetWidth
  const bottom = parentElement!.offsetHeight - top - currentDragEl!.offsetHeight

  let moveX = event.pageX - startX
  let moveY = event.pageY - startY

  // 如果超出则 设定为最大值
  if (moveY < -top) moveY = -top
  if (moveX < -left) moveX = -left
  if (moveX > right) moveX = right
  if (moveY > bottom) moveY = bottom

  // 移动 复制的 元素
  if (cloneObj) {
    cloneObj.style.transform = `
        translate3d(${moveX}px,${moveY}px,0)`
  }
  //计算sort
  reRange(imgList[elementIndex], moveX, moveY, itemSize)
}

let moveIndex: number // 该移动元素的坐标
//重新计算排列顺序
function reRange(item: any, x: number, y: number, width: number) {
  // width表示元素的自身长度以及元素之间距离的和
  moveIndex = Math.round(x / width) + Math.round(y / width) * 6 + dragIndex
  moveIndex = moveIndex < 0 ? 0 : moveIndex // 当移动下标小于0时，将它置为0
  // 当移动下标大于最大值，将它置为最大值
  if (moveIndex > imgList.length - 1) moveIndex = imgList.length - 1

  let currentSort = item.sort
  for (let i = 0; i < imgList.length; i++) {
    if (currentSort < moveIndex) {
      // 从小到大，所有排序-1
      if (imgList[i].sort > currentSort && imgList[i].sort <= moveIndex) {
        imgList[i].sort -= 1
      }
    } else if (currentSort > moveIndex) {
      // 从大到小，所有排序+1
      if (imgList[i].sort < currentSort && imgList[i].sort >= moveIndex) {
        imgList[i].sort += 1
      }
    }
  }

  // 将点击的元素的sort置为moveIndex
  imgList[item.index].sort = moveIndex
  moveItem(imgList, itemSize)
}

// 排列移动元素
function moveItem(imgList: any[], width: number) {
  for (const item of imgList) {
    // 获取现在和之前 相对的位置差
    const nowLine = Math.floor(item.sort / 6)
    const beforeLine = Math.floor(item.index / 6)
    const diffLine = nowLine - beforeLine

    const nowIndex = item.sort % 6
    const beforeIndex = item.index % 6
    const diffIndex = nowIndex - beforeIndex
    // 修改样式
    item.el.style.transition = 'transform 0.3s,background-color 0.5s ease'
    item.el.style.transform = `
        translate3d(${diffIndex * width}px,${diffLine * width}px,0)`
  }
}

// 拖拽结束调用
const dragend = () => {
  // 删除复制的元素
  document.body.removeChild(cloneObj!)
  //把引用移除
  cloneObj = null
  // 显示原来的元素
  currentDragEl!.style.visibility = 'visible'
  //把引用移除
  currentDragEl = null

  // 移除监听
  window.removeEventListener('mouseup', dragend)
  window.removeEventListener('mousemove', drag)
  // 130 是 一个item占 的位置
  moveItem(imgList, itemSize)
}

// 直接关闭组件
const cancel = () => {
  emits('close')
}
// 保存修改
const save = () => {
  changeSortUrlList(imgList)
  emits('close')
}
// 添加图片
const addImg = () => {
  emits('addImg')
}
</script>

<style scoped lang="less">
.sort-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.75);
  overflow-x: hidden;
  user-select: none;
}
.content {
  position: relative;
  top: calc(50vh - 340px);
  background-color: var(--bgc3);
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  max-height: 680px;
  margin: 0 100px;
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 10px;
}

.head {
  color: var(--color-regular);
  font-size: 17px;
  font-weight: bold;
  margin: 0 30px;
  padding-top: 26px;
}
.body {
  position: relative;
  padding: 30px;
  width: 780px;
}
.img-warp {
  margin: 5px;
  width: 120px;
  height: 120px;
  display: inline-block;
  transition: all 0.3s visibility 0s;
  cursor: pointer;
  background-color: var(--surface-color3);
  border-radius: 8px;
  vertical-align: middle;
  transition: background-color 0.5s ease;
  &:hover {
    background-color: var(--surface-color3-hover);
  }
}
.add-more {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--blue-mask);
  border: solid 1px var(--blue-border-color);
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 8px;
  font-weight: 500;
  color: var(--color-regular);
  transition: background-color 0.3s ease;
  &:hover {
    background-color: var(--blue-mask-chose);
  }
  svg {
    stroke: var(--btn-color1);
    fill: var(--btn-color1);
    margin-bottom: 10px;
  }
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: solid 1px var(--blue-border-color);
  box-sizing: border-box;
  overflow: hidden;
  object-fit: cover;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.foot {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  padding: 20px 30px;

  .save {
    padding: 8px 20px;
    margin: 0px;
    color: #fff;
    border: none;
  }

  .cancel {
    margin: 0 25px;
    cursor: pointer;
    color: var(--color-text3);
    transition: color 0.3s ease;
    font-weight: 500;
    border-bottom: 1px solid var(--color-text3);
    &:hover {
      color: var(--color-text1-hover);
    }
  }
}
</style>
