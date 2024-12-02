<template>
  <div class="pre-img" ref="domList">
    <template v-for="(item, index) in urlList" :key="item.fileName">
      <div class="img-warp" @mousedown.self="dragstart($event, index)">
        <img class="img" :src="item.url" @load="imgOverLoad" />
        <div class="mask" :class="{ 'no-freeze': !loading }">
          <div class="uploading" v-if="!item.isPut">
            <template v-if="item.uploadIng">
              <span v-if="!item.progress"> 等待上传... </span>
              <span v-else>{{ item.progress.toFixed(2) }} %</span>
            </template>
            <div v-if="item.isFail" class="fail">
              <svg
                width="25"
                height="25"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 31L21 26L28 20L19 15L20 9.19942C18.4999 8.43256 16.8004 8 15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C31.1996 8 29.5001 8.43256 28 9.19942"
                  stroke="#fc638c"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              上传失败
            </div>
          </div>
        </div>
        <span class="delete" @click.stop="handleDelete(index)">
          <svg
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 14L34 34"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 34L34 14"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </template>
    <div class="img-warp" @click="addImg" v-show="urlList.length < maxCount">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, type PropType } from 'vue'
import type { IUrlItem } from '@/stores/module/upload/trend/type'
import { isElement } from '@/components/utils'
const emits = defineEmits(['addImg', 'delete', 'sort'])
defineProps({
  urlList: {
    type: Object as PropType<IUrlItem[]>,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  maxCount: {
    type: Number,
    default: 9
  }
})

// 图片列表
type imgListType = { el: HTMLDivElement; sort: number; index: number }
let imgList: imgListType[] = [] // 存放imgDOM数组
const domList = ref<HTMLDivElement>()

const buildSortList = () => {
  // 获取 当前 imgDom的个数 用于分割
  const count = imgList.length
  const divList = domList.value!.children
  const tempList = Array.from(divList).slice(count) as HTMLDivElement[]
  for (let i = 0; i < tempList.length - 1; i++) {
    // el代表这个元素，sort代表元素排列的位置，index代表当前元素的index，它是不会改变的
    imgList.push({ el: tempList[i], sort: i + count, index: i + count })
  }
}
// 首次挂载时调用
onMounted(() => {
  setTimeout(buildSortList)
})
// 添加图片时调用
onUpdated(() => {
  buildSortList()
})

// 排列移动元素
function moveItem(imgList: imgListType[], width: number, now = false) {
  for (const item of imgList) {
    // 获取现在和之前 相对的位置差
    const nowLine = Math.floor(item.sort / 6)
    const beforeLine = Math.floor(item.index / 6)
    const diffLine = nowLine - beforeLine

    const nowIndex = item.sort % 6
    const beforeIndex = item.index % 6
    const diffIndex = nowIndex - beforeIndex
    // 修改样式
    const transition = 'transform 0.3s,background-color 0.5s ease'
    item.el.style.transition = now ? '' : transition
    item.el.style.transform = `
        translate3d(${diffIndex * width}px,${diffLine * width}px,0)`
  }
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
  moveItem(imgList, 100)
}

const itemSize = 100
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
    cloneObj.style.zIndex = '9999'
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
  // itemSize 是 一个item占 的位置
  moveItem(imgList, itemSize)
  //改变store index
  emits('sort', imgList)
}

// 图片加载完会调用
const imgOverLoad = (event: Event) => {
  //保存 图片 长宽高
  const imgEl = event.target as HTMLImageElement
  imgEl.style.opacity = '1'
}

// 添加图片
const addImg = () => {
  emits('addImg')
}
//删除图片
const handleDelete = (index: number) => {
  emits('delete', index)
  const delItem = imgList.find((i) => i.index == index)
  imgList.splice(index, 1)
  // 在删除元素后面的都要 -1
  for (let i = 0; i < imgList.length; i++) {
    const item = imgList[i]
    if (item.sort > delItem!.sort) item.sort -= 1
    if (item.index > delItem!.index) item.index -= 1
  }
  moveItem(imgList, itemSize, true)
  //改变store index
  emits('sort', imgList)
}
</script>

<style scoped lang="less">
.pre-img {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 13px 20px 15px;
  user-select: none;
}
.mask {
  font-size: 14px;
  color: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  .uploading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
//图片压缩完成后可以移动
.no-freeze {
  pointer-events: none;
}
.img-warp {
  position: relative;
  width: 96px;
  height: 96px;
  margin: 2px;
  display: inline-block;
  transition: all 0.3s visibility 0s;
  cursor: pointer;
  background-color: var(--surface-color3);
  border-radius: 5px;
  overflow: hidden;
  vertical-align: middle;
  transition: background-color 0.5s ease;
  &:hover {
    background-color: var(--surface-color3-hover);
  }
  .delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    right: 2px;
    top: 2px;
    svg {
      stroke: #fefefe;
    }
    &:hover {
      svg {
        stroke: #ea8011;
      }
    }
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
.fail {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: var(--primary-err-color);
  svg {
    margin-bottom: 5px;
  }
}
</style>
