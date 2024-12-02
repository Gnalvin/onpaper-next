<template>
  <div class="hot">
    <div class="panel">
      <div class="title">热门话题</div>
      <ul class="tag-wrap">
        <li class="rank" v-for="(topic, index) in hotTags" :key="topic.topicId">
          <RouterLink
            :to="{
              name: 'topicDetail',
              params: { topicId: topic.topicId }
            }"
            target="_blank"
          >
            <span class="num" :class="{ 'rank-top': index < 3 }">{{
              index + 1
            }}</span>
            <span class="text-count">
              <span class="text">{{ topic.topicName }}</span>
              <span class="count">
                {{ $filters.formatNum(topic.count).toLocaleString('en-US') }}
                讨论
              </span>
            </span>
            <span class="icon" v-if="topic.status == 'up'">
              <svg
                width="17"
                height="17"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.0083 12.1006V36.0001"
                  stroke="#ff006c"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 24L24 12L36 24"
                  stroke="#ff006c"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="icon" v-if="topic.status == 'down'">
              <svg
                width="17"
                height="17"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.0083 35.8995V12"
                  stroke="#3aa901"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36 24L24 36L12 24"
                  stroke="#3aa901"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="icon" v-if="topic.status == 'new'">
              <span class="text"> 新</span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IHotTopic } from '@/service/trend-page/type'
defineProps({
  hotTags: {
    type: Object as PropType<IHotTopic[]>,
    required: true
  }
})
</script>

<style scoped lang="less">
.panel {
  padding: 25px 15px 10px;
  border-radius: 5px;
  background-color: var(--surface-color4);
  user-select: none;
  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .rank {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    a {
      display: flex;
      flex-grow: 1;
      padding-bottom: 8px;
    }
    .num {
      display: inline-flex;
      justify-content: center;
      font-size: 15px;
      font-weight: 500;
      color: #d56d61;
      width: 10px;
      margin-right: 10px;
    }
    .text-count {
      display: flex;
      align-items: center;
      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 136px;
        margin-right: 10px;
      }
      .count {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--color-text3);
      }
    }

    .rank-top {
      font-weight: 700;
      color: rgb(231, 69, 69);
    }
    .icon {
      position: absolute;
      right: 0;
      top: 50%;
      margin: -13px 0 0;

      .text {
        font-size: 12px;
        font-weight: 700;
        color: #eb7350;
        padding-right: 2px;
      }
    }
  }
}
</style>
