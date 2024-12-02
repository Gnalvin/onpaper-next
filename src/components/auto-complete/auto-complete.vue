<template>
  <div class="auto-complete">
    <div class="dropdown-menu" v-if="isShow">
      <div class="container" ref="containerEL">
        <template v-for="(item, index) in showList" :key="item">
          <span
            class="item"
            tabindex="0"
            @click="handleClickItem(item)"
            :class="{ 'chose-color': index === choseIndex }"
          >
            {{ item }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import { useEventListener } from '@vueuse/core'
import { EVENT_CODE } from '../config/event_code'
const props = defineProps({
  dataList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  search: {
    type: String,
    default: ''
  },
  always: {
    type: Boolean,
    default: false
  },
  // 是否展示
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['clickItem'])

const showList = ref<Set<string>>(new Set<string>())
const choseIndex = ref(-1)
defineExpose({ choseIndex })
watch(
  () => props.search,
  (newVal) => {
    // 如果需要一直保持显示
    if (props.always && !newVal) {
      showList.value = new Set(props.dataList)
      return
    }
    // 每次变化都 清空
    showList.value = new Set<string>()
    choseIndex.value = -1
    // 搜索以什么开头添加到set
    for (const data of props.dataList) {
      if (props.always && !newVal) {
        showList.value.add(data)
        continue
      }
      const dataLowWord = data.toLowerCase()
      const newValLowWord = newVal.toLowerCase()
      if (dataLowWord.startsWith(newValLowWord) && newValLowWord) {
        showList.value.add(data)
      }
    }
  },
  { immediate: true }
)
const handleClickItem = (text: string) => {
  emits('clickItem', text)
}

//处理用键盘选择
const containerEL = ref<HTMLDivElement>()

const handleKeyboardChange = (event: KeyboardEvent) => {
  if (!props.isShow) return
  if (event.code === EVENT_CODE.down) {
    choseIndex.value++
    if (choseIndex.value > showList.value.size - 1) choseIndex.value--
    handleScroll(event.code)
  }
  if (event.code === EVENT_CODE.up) {
    choseIndex.value--
    if (choseIndex.value < 0) choseIndex.value = 0
    handleScroll(event.code)
  }
  if (event.code === EVENT_CODE.enter) {
    if (choseIndex.value === -1) return
    const arrTemp = Array.from(showList.value)
    emits('clickItem', arrTemp[choseIndex.value])
    choseIndex.value = -1
  }
}

const handleScroll = (eventCode: string) => {
  const itemList = Array.from(containerEL.value!.children) as HTMLElement[]
  const item = itemList[choseIndex.value] // 当前选中的item
  const containerHeight = containerEL.value!.clientHeight // 容器高度
  const itemHeight = item.offsetHeight //item元素高度
  const distance = item.offsetTop // 距离容器顶部的高度
  const currentScrollHight = containerEL.value!.scrollTop //当前滚动高度

  // 向下移动时
  if (distance > containerHeight) {
    containerEL.value!.scrollTo(0, currentScrollHight + itemHeight)
  }
  //向上移动时
  if (currentScrollHight > 0 && eventCode === EVENT_CODE.up) {
    containerEL.value!.scrollTo(0, currentScrollHight - itemHeight)
  }
}
watch(
  () => props.isShow,
  () => (choseIndex.value = -1)
)
useEventListener(window, 'keydown', handleKeyboardChange)
</script>

<style scoped lang="less">
.dropdown-menu {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 20;
  display: block;
  width: 100%;
  bottom: 100%;
}
.container {
  width: 101%;
  position: relative;
  right: 2px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: var(--surface-color1);
  margin-top: 2px;
  max-height: 245px;
  overflow: auto;
  border-radius: 3px;
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 5px;
  border: none;
  transition: all 0.5s ease;
}
.item {
  font-weight: 600;
  padding: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  color: var(--color-text1);
  transition: background-color 0s;
  cursor: pointer;
  &:hover {
    color: #fff;
    background-color: #5162b2;
  }
}
.chose-color {
  color: #fff;
  background-color: #5162b2;
}
</style>
