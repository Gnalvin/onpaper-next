<template>
  <section class="main-area">
    <EditorItem
      :isShowHeader="false"
      v-show="route.query.mode == 'focus'"
    ></EditorItem>
    <div
      class="feeds"
      v-lazy-loading="loadMore"
      :lazy-loading-immediate="false"
      :lazy-loading-distance="2000"
      :lazy-loading-delay="800"
      :lazy-loading-disabled="trendStore.isEnd || trendStore.waiting"
    >
      <template v-for="item in trends" :key="item.id">
        <TrendItem
          :trend-item="item"
          @goToDetail="goToDetail"
          @like="handleLike"
          @delete="handleDelete"
          @update="handleUpdatePermission"
        ></TrendItem>
      </template>
    </div>
  </section>
  <section class="side-wrap">
    <div class="side">
      <HotTopic :hot-tags="trendStore.hotTags"></HotTopic>
      <SuggestUser :show-count="3"></SuggestUser>
      <IcpInfo></IcpInfo>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import userTrendPageStore from '@/stores/module/trend'
import SuggestUser from '../cpns/suggest-user.vue'
import HotTopic from '../cpns/hot-topic.vue'
import EditorItem from '@/components/trend/cpn/editor-item.vue'
import { TrendItem } from '@/components/trend'
import type { ITrend, IPermission } from '@/service/trend-page/type'
import { TipBox } from '@/components/message-box'
import IcpInfo from '../cpns/icp-info.vue'

const route = useRoute()
const router = useRouter()

const trendStore = userTrendPageStore()
const trends = computed(() => trendStore.trends)
const loadMore = () => {
  if (route.name !== 'trendHome') return
  trendStore.getFullData()
}

//跳转到动态详情
let top = 0
const goToDetail = (trend: ITrend) => {
  // 记录离开页面时的位置 激活跳转
  top = window.scrollY
  router.push({
    name: 'trendDetail',
    params: {
      user: trend.userName,
      trendId: trend.trendId
    },
    query: {
      type: trend.type
    }
  })
}
//处理点赞
const handleLike = async (trend: ITrend) => {
  trendStore.postLikeAction(trend)
}
// 删除动态
const handleDelete = async (trendId: string) => {
  const res = await trendStore.deleteTrendAction(trendId)
  if (res.status === 200) {
    for (let index = 0; index < trendStore.trends.length; index++) {
      const item = trendStore.trends[index]
      if (item.trendId === res.data.trendId) {
        trendStore.trends.splice(index, 1)
        break
      }
    }
  }
}
// 更新权限
const handleUpdatePermission = async (data: IPermission) => {
  const res = await trendStore.updatePermissionAction(data)
  if (res.status == 200) {
    TipBox({ text: '修改成功' })
    const trend = trendStore.trends.find((i) => i.trendId === data.trendId)
    if (trend) {
      trend.comment = data.comment
      trend.whoSee = data.whoSee
    }
  }
}
onActivated(() => {
  window.scrollTo(0, top)
})
</script>

<style scoped lang="less">
@import '../css/common.less';

.side {
  top: 30px !important;
}
</style>
