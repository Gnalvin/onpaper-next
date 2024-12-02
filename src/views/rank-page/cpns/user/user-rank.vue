<template>
  <Skeleton :loading="userRankList.length === 0">
    <template #default>
      <div v-show="userRankList.length">
        <div class="header">
          <div class="title">
            <h1 class="rank-name">优秀画师排行榜</h1>
            <div class="describe">
              <template v-for="(v, key) of tabIntro" :key="key">
                <span v-if="key == rankType">
                  {{ v }}
                </span>
              </template>
            </div>
          </div>
          <div class="tabs">
            <template v-for="(tab, index) in tabs" :key="tab.text">
              <span
                :class="{
                  'first-tab': index === 0,
                  'chose-tab': index == tabs.findIndex((i) => i == tabValue)
                }"
                class="tab"
                @click="changeLine(index, tab)"
              >
                {{ tab }}
              </span>
            </template>
          </div>
        </div>
        <div class="content-wrap">
          <UserShow :userInfo="userRankList" :rankType="rankType"></UserShow>
        </div>
      </div>
    </template>
  </Skeleton>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { userRankType } from '@/stores/module/rank-page/type'
import useRankPage from '@/stores/module/rank-page'
import UserShow from './user-show.vue'
import Skeleton from './user-skeleton.vue'

const emits = defineEmits(['scrollTop'])

const rankStore = useRankPage()
//首次加载请求数据
if (rankStore.userLikeRank.length === 0) {
  rankStore.getUserRankAction('like')
}
const rankType = ref<userRankType>('like')

type tabValueType = '人气榜' | '收藏榜' | '女生榜' | '男生榜' | '潜力榜'
const tabValue = ref<tabValueType>('人气榜')
//文字底部的蓝线
const choiceStyle = reactive({
  timex: '0%'
})

const tabs: tabValueType[] = ['人气榜', '收藏榜', '女生榜', '男生榜', '潜力榜']
const changeLine = (index: number, tab: tabValueType) => {
  emits('scrollTop')
  choiceStyle.timex = index * 100 + '%'
  tabValue.value = tab
  switch (tab) {
    case '人气榜':
      rankType.value = 'like'
      if (rankStore.userLikeRank.length === 0)
        rankStore.getUserRankAction('like')
      break
    case '收藏榜':
      rankType.value = 'collect'
      if (rankStore.userCollectRank.length === 0)
        rankStore.getUserRankAction('collect')
      break
    case '女生榜':
      rankType.value = 'girl'
      if (rankStore.userGirlRank.length === 0)
        rankStore.getUserRankAction('girl')
      break
    case '男生榜':
      rankType.value = 'boy'
      if (rankStore.userBoyRank.length === 0) rankStore.getUserRankAction('boy')
      break
    default:
      rankType.value = 'new'
      if (rankStore.userNewRank.length === 0) rankStore.getUserRankAction('new')
      break
  }
}

//根据选中的tab 动态反应 用户数据
const userRankList = computed(() => {
  switch (tabValue.value) {
    case '人气榜':
      return rankStore.userLikeRank
    case '收藏榜':
      return rankStore.userCollectRank
    case '女生榜':
      return rankStore.userGirlRank
    case '男生榜':
      return rankStore.userBoyRank
    default:
      return rankStore.userNewRank
  }
})

const tabIntro = {
  like: '最近 7 天内，收获最多点赞的画师',
  collect: '最近 7 天内，收获最多收藏的画师',
  girl: '最近 21 天内，综合指标最高的女性画师',
  boy: '最近 21 天内，综合指标最高的男性画师',
  new: '最近 90 天内新加入社区，综合指标最高的画师'
}
</script>

<style scoped lang="less">
@import '../../css/tab.less';
.first-tab::after {
  transform: translateX(v-bind('choiceStyle.timex'));
}
</style>
