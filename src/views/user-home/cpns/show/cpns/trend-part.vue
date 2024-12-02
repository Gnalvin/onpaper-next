<template>
  <div class="trend-area" v-if="!trendStore.noHaveTrend">
    <div
      class="trend"
      v-lazy-loading="loadMore"
      :lazy-loading-immediate="false"
      :lazy-loading-distance="2000"
      :lazy-loading-delay="250"
      :lazy-loading-disabled="trendStore.isEnd || trendStore.waiting"
    >
      <template v-for="item in trends" :key="item.trendId">
        <TrendItem
          :trend-item="item"
          :not-link="true"
          @goToDetail="handleShowDetail"
          @like="handleLike"
          @delete="handleDelete"
          @update="handleUpdatePermission"
        ></TrendItem>
      </template>
    </div>
    <div class="end" v-if="trendStore.isEnd">
      …（⊙＿⊙；）… &nbsp;&nbsp; 没有更多了
    </div>
  </div>
  <div v-if="trendStore.noHaveTrend" class="tip">
    ta还没有发布过动态 &nbsp; …（⊙＿⊙；）…
  </div>
  <ViewPanel v-if="showDetail" @close="handleShowDetail" ref="viewPanelEl">
    <div class="trend-detail">
      <div class="title">
        <div class="black" @click="closePage">
          <span class="icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31 36L19 24L31 12"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          返回
        </div>
        <div class="name">
          <span>{{ detailStore.trendDetail?.userName }}</span>
        </div>
      </div>
      <template v-if="detailStore.trendDetail">
        <TrendItem
          :trend-item="detailStore.trendDetail"
          @like="handleLike"
          @delete="handleDelete"
          @update="handleUpdatePermission"
          :quick-reply="false"
        ></TrendItem>
        <CommentPart :cType="detailStore.trendDetail.type"></CommentPart>
      </template>
      <template v-if="detailStore.isNoExist">
        <div class="delete">动态已删除或不存在</div>
      </template>
    </div>
  </ViewPanel>
  <TopButton></TopButton>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useTrendStore from '@/stores/module/trend'
import useDetailStore from '@/stores/module/trend/detail'
import { TrendItem } from '@/components/trend'
import CommentPart from '@/views/trend-page/cpns/comment-part.vue'
import { ViewPanel } from '@/components/view-panel'
import TopButton from '@/components/top-button/top-button.vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import type { ITrend, IPermission } from '@/service/trend-page/type'
import { TipBox } from '@/components/message-box'

const route = useRoute()
const userId = route.params.userId as string

const trendStore = useTrendStore()
const detailStore = useDetailStore()
// 页面激活时请求一次 用户的动态
trendStore.getUserHomeTrendAction(userId)

const trends = computed(() => trendStore.trends)

const loadMore = () => {
  trendStore.getUserHomeTrendAction(userId)
}

const showDetail = ref(false)
const handleShowDetail = async (trend: ITrend) => {
  showDetail.value = !showDetail.value
  stopBodyScroll(showDetail.value, false)
  // 如果展示单个动态详情 使用detailStore 的数据
  if (showDetail.value) {
    await detailStore.getTrendDetailAction(trend.trendId, trend.type)
    if (!detailStore.trendDetail) return
    detailStore.getTrendCommentAction(trend.trendId, trend.type)
  } else {
    detailStore.$reset()
  }
}
const viewPanelEl = ref<InstanceType<typeof ViewPanel>>()
const closePage = () => {
  viewPanelEl.value?.closePage()
}

const handleLike = async (item: ITrend) => {
  trendStore.postLikeAction(item)
}

// 删除动态
const handleDelete = async (trendId: string) => {
  const res = await trendStore.deleteTrendAction(trendId)
  if (res.status === 200) {
    detailStore.$reset()
    detailStore.isNoExist = true
    //如果是从feed流里面进来的 feed流也删除
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
    if (detailStore.trendDetail) {
      detailStore.trendDetail.comment = data.comment
      detailStore.trendDetail.whoSee = data.whoSee
    }
  }
}
</script>

<style scoped lang="less">
.trend-area {
  min-height: 650px;
  background-color: var(--bgc2);
}
.trend {
  width: 800px;
  margin: 0 auto;
}
.trend-detail {
  width: 800px;
  min-height: 100%;
  margin: 0 auto 0;
  background-color: var(--surface-color4);
  .title {
    position: sticky;
    top: 0;
    display: flex;
    font-size: 18px;
    height: 50px;
    align-items: center;
    background-color: var(--surface-color4);
    z-index: 99;
    border-radius: 5px;
    .black {
      position: absolute;
      display: flex;
      align-items: center;
      font-weight: 700;
      cursor: pointer;
      .icon {
        display: flex;
      }
      svg {
        stroke: var(--color-regular);
      }
    }
    .name {
      font-weight: 400;
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }
  .delete {
    padding: 90px 20px;
    text-align: center;
    font-size: 18px;
  }
}
.end {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-size: 12px;
}
.tip {
  font-size: 20px;
  text-align: center;
  padding-top: 200px;
  height: 450px;
}
</style>
