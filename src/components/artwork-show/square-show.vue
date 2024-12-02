<template>
  <div class="square-show">
    <div v-if="openTime" class="timeArea">
      <template v-for="area in timeArea" :key="area.title">
        <div class="container" v-if="area.arts.length">
          <div class="title">{{ area.title }}</div>
          <ul class="wrap">
            <li v-for="(item, index) in area.arts" :key="item.artworkId">
              <slot :item="item" :index="index"></slot>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <ul class="wrap" v-else>
      <li v-for="(item, index) in artworks" :key="item.artworkId">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType } from 'vue'
import type { IArtwork } from './type'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const props = defineProps({
  artworks: {
    type: Array as PropType<IArtwork[]>,
    required: true
  },
  openTime: {
    type: Boolean,
    default: false
  }
})

// 今天
const nowTime = dayjs().startOf('day')
// 昨天
const yesterday = nowTime.subtract(1, 'day')
// 近7日
const week = yesterday.subtract(6, 'day')

const toDayDate = new Date(nowTime.toString()).getTime()
const lastDayDate = new Date(yesterday.toString()).getTime()
const weekDate = new Date(week.toString()).getTime()

const toDayArt = ref<IArtwork[]>([])
const lastDayArt = ref<IArtwork[]>([])
const lastWeekArt = ref<IArtwork[]>([])
const longTimeArt = ref<IArtwork[]>([])

// 只使用于 数组追加 跳过之前 循环过的
let start = 0
watch(
  () => props.artworks,
  (arts) => {
    for (let index = start; index < arts.length; index++) {
      const item = arts[index]
      if (!item.createAT) return
      // setSeconds(-8 * 60 * 60) 减去 8小时
      const crateTime = new Date(item.createAT).setSeconds(-8 * 60 * 60)
      if (crateTime >= toDayDate) {
        toDayArt.value.push(item)
      } else if (crateTime >= lastDayDate && crateTime < toDayDate) {
        lastDayArt.value.push(item)
      } else if (crateTime >= weekDate && crateTime < lastDayDate) {
        lastWeekArt.value.push(item)
      } else {
        longTimeArt.value.push(item)
      }
      start++
    }
  },
  { deep: true }
)

const timeArea = computed(() => [
  {
    title: '今日新作',
    arts: toDayArt.value
  },
  {
    title: '昨日发布',
    arts: lastDayArt.value
  },
  {
    title: '本周发布',
    arts: lastWeekArt.value
  },
  {
    title: '近期作品',
    arts: longTimeArt.value
  }
])
</script>

<style scoped lang="less">
.square-show {
  width: 100%;
}
.wrap {
  display: grid;
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-gap: 20px;
}

.timeArea {
  .container {
    border-bottom: 0.5px solid var(--transparent-hover);
    padding-bottom: 35px;
    &:last-child {
      border-bottom: none;
    }
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    margin: 30px 0;
  }
}
</style>
