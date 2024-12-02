<template>
  <ul class="wl-waterfall-wrap">
    <li
      ref="itemRefs"
      class="wl-item"
      v-resize:[index]="resize"
      v-for="(item, index) in arrayItem"
      :key="itemKey ? item[itemKey] : index"
    >
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'
import Waterfall from './waterfall'
import { debounce } from '@/utils/debounce'
import { useEventListener } from '@vueuse/core'

const props = defineProps({
  arrayItem: {
    type: Array as PropType<any[]>,
    required: true
  },
  itemKey: {
    type: String
  },
  // 列数
  columns: {
    type: Number,
    default: 1
  },
  // 元素最小宽度
  minWidth: {
    type: Number,
    default: 0
  }
})
const itemRefs = ref(null)
const waterfall = new Waterfall({
  columns: props.columns,
  minWidth: props.minWidth,
  headGap: 5,
  leftGap: 10,
  defaultHight: 150,
  itemClassName: '.wl-item',
  containerClassName: '.wl-waterfall-wrap'
})

const resize = (width: number, height: number, index: number) => {
  waterfall.reSize(height, index)
}
onMounted(() => {
  waterfall.init()
})

useEventListener(
  window,
  'resize',
  debounce(() => waterfall.reSort(), 30)
)
</script>

<style scoped lang="less">
.wl-waterfall-wrap {
  width: 100%;
  position: relative;
  margin: 0 auto;
}
.wl-item {
  position: absolute;
  z-index: 1;
}
</style>
