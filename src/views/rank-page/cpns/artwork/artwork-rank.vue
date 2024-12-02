<template>
  <Skeleton :loading="artworks.length === 0">
    <template #default>
      <div v-show="artworks.length">
        <div class="header">
          <div class="title">
            <h1 class="rank-name">热门作品排行榜</h1>
            <div class="describe">
              最近 {{ day }} 天内综合指标最高的作品排行
            </div>
          </div>
          <div class="tabs">
            <template v-for="(tab, index) in tabs" :key="tab.text">
              <span
                :class="{
                  'first-tab': index === 0,
                  'chose-tab': index == choseIndex
                }"
                class="tab"
                @click="changeLine(index)"
              >
                {{ tab }}
              </span>
            </template>
          </div>
        </div>

        <div class="content-wrap">
          <ArtworkShow :artworks="artworks"></ArtworkShow>
        </div>
      </div>
    </template>
  </Skeleton>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import useRankPage from '@/stores/module/rank-page'
import Skeleton from './artwork-skeleton.vue'
import ArtworkShow from './artwork-show.vue'

const emits = defineEmits(['scrollTop'])

const rankStore = useRankPage()
//首次加载请求数据
if (rankStore.artDayRank.length === 0) {
  rankStore.getArtworkRankAction('today')
}
//根据选中的时间 动态反应 作品
const artworks = computed(() => {
  if (day.value == 1) {
    return rankStore.artDayRank
  }
  if (day.value == 7) {
    return rankStore.artWeekRank
  }
  return rankStore.artMonthRank
})

const day = ref(1)
const choseIndex = ref(0)
//文字底部的蓝线
const choiceStyle = reactive({
  timex: '0%'
})
const tabs = ['今日', '本周', '本月']
const changeLine = (index: number) => {
  emits('scrollTop')
  choiceStyle.timex = index * 100 + '%'
  choseIndex.value = index
  switch (index) {
    case 0:
      day.value = 1
      if (rankStore.artDayRank.length === 0)
        rankStore.getArtworkRankAction('today')
      break
    case 1:
      day.value = 7
      if (rankStore.artWeekRank.length === 0)
        rankStore.getArtworkRankAction('week')

      break
    default:
      day.value = 30
      if (rankStore.artMonthRank.length === 0)
        rankStore.getArtworkRankAction('month')
      break
  }
}
</script>

<style scoped lang="less">
@import '../../css/tab.less';
.content-wrap {
  display: flex;
  justify-content: center;
}
.first-tab::after {
  transform: translateX(v-bind('choiceStyle.timex'));
}
</style>
