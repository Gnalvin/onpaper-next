<template>
  <div class="topic-detail">
    <section class="main-area">
      <div class="head" v-if="topicDetail.topicId">
        <div class="title">
          <span class="svg">
            <svg
              width="30"
              height="30"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                fill="#1bad1b"
                stroke="#1bad1b"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path
                d="M16.6045 19.8201H33.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.8467 15.7378L18.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M28.8467 15.7378L25.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6045 28H31.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          {{ topicDetail.text }}
        </div>
        <div class="sponsor">
          <AvatarItem
            :userId="topicDetail.userId"
            :imgUrl="topicDetail.avatar"
            :width="24"
            :height="24"
          ></AvatarItem>
          <div class="name">
            {{ topicDetail.userName }} · <span>发起话题</span>
          </div>
        </div>
        <div class="intro" v-if="topicDetail.intro">
          {{ topicDetail.intro }}
        </div>
        <div class="count">
          <div>{{ topicDetail.count.toLocaleString('en-US') }} 篇内容</div>
          <ElButton class="btn" :verify-login="true" @click="handleShowEditor">
            参与话题
          </ElButton>
        </div>
      </div>
      <div class="nav">
        <template v-for="(item, index) in tab" :key="item.val">
          <span
            class="item"
            :class="{ chose: index == chose }"
            @click="handleChose(index)"
          >
            {{ item.text }}
          </span>
        </template>
      </div>
      <TrendPart v-if="trendStore.trends.length"></TrendPart>
      <div class="no-trends" v-if="topicStore.noHaveTrends">没有相关动态</div>
    </section>
    <section class="side-wrap">
      <div class="side">
        <HotTopic :hotTags="topicStore.hotTopic"></HotTopic>
      </div>
    </section>
  </div>

  <TopButton></TopButton>
  <TrendEditor v-if="isShowEditor" @close="handleShowEditor"></TrendEditor>
</template>

<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useUploadTrendStore from '@/stores/module/upload/trend'
import useTopicStore from '@/stores/module/topic-page'
import useTrendStore from '@/stores/module/trend'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import HotTopic from '../../trend-page/cpns/hot-topic.vue'
import TrendPart from './trend-part.vue'
import { TrendEditor } from '@/components/trend/index'
import TopButton from '@/components/top-button/top-button.vue'
import ElButton from '@/components/button/el-button.vue'
import { stopBodyScroll } from '@/utils/stopScroll'

const route = useRoute()
const topicStore = useTopicStore()
const trendStore = useTrendStore()
const uploadTrendStore = useUploadTrendStore()
const topicDetail = computed(() => topicStore.topicDetail)
topicStore.getHotTopicAction()
watch(
  () => route.params.topicId,
  async (topicId) => {
    await topicStore.getTopicDetailAction(topicId as string)
    topicStore.getTopicTrendAction(1)
  },
  { immediate: true }
)
type tabType = { text: string; val: 'hot' | 'new' }
const tab: tabType[] = [
  { text: '热门', val: 'hot' },
  { text: '最新', val: 'new' }
]
const chose = ref(0)
const handleChose = (index: number) => {
  chose.value = index
  topicStore.sort = tab[index].val
  trendStore.trends = []
  topicStore.getTopicTrendAction(1)
}

const isShowEditor = ref(false)
const handleShowEditor = () => {
  isShowEditor.value = !isShowEditor.value
  const { text, topicId } = topicStore.topicDetail
  uploadTrendStore.uploadFormData.topic = { text, topicId }
  stopBodyScroll(isShowEditor.value, false)
}
</script>

<style scoped lang="less">
.topic-detail {
  display: flex;
  margin: 0 auto;
  padding-top: 15px;
}

.main-area {
  width: 640px;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  .head {
    padding: 15px 20px 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    background-color: var(--surface-color4);
    .title {
      display: flex;
      padding-bottom: 15px;
      font-size: 26px;
      line-height: 1.3;
      color: var(--color-text1);
      .svg {
        stroke: #eee;
        margin-right: 10px;
      }
    }
    .count {
      color: #999999;
      font-size: 13px;
      line-height: 20px;
      padding: 10px 0px 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn {
        margin: 0;
        padding: 8px 15px;
      }
    }
    .sponsor {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span {
        font-size: 12px;
      }
      .name {
        margin-left: 5px;
      }
    }
    .intro {
      margin-top: 15px;
      padding: 10px 0;
      font-size: 14px;
      line-height: 1.55;
      word-break: break-all;
    }
  }
  .nav {
    margin: 5px 0;
    padding: 10px 25px;
    border-radius: 5px;
    background-color: var(--surface-color4);
    .item {
      font-size: 15px;
      font-weight: 400;
      margin-right: 15px;
      border-radius: 5px;
      cursor: pointer;
    }
    .chose {
      font-weight: 700;
      color: var(--color-text4-hover);
      svg {
        stroke: var(--color-text4-hover);
        fill: var(--color-text4-hover);
      }
    }
  }
}

.side-wrap {
  .side {
    position: sticky;
    top: 65px;
    width: 290px;
  }
}
.no-trends {
  margin: 5px 0;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding-top: 150px;
  background-color: var(--surface-color4);
}
</style>
