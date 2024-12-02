<template>
  <div class="foot" :class="{ forward: isForward }" @click.stop>
    <div class="left" v-if="isForward">
      <div class="time">
        {{ $filters.formatUtcToShowTime(trendItem.createAt, 0) }}
        <div class="type">
          &nbsp;·&nbsp;{{ trendItem.type == 'aw' ? '投稿作品' : '发布动态' }}
        </div>
      </div>
    </div>
    <div class="right">
      <div
        class="item"
        @click="handleShowForward"
        v-if="trendItem.whoSee == 'public'"
      >
        <span class="forwards">
          <span class="forward-bgc icon-bgc">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 6H42V20"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M25.7998 22.1999L41.0998 6.8999"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text">
            <span v-if="count.forwards == 0">转发</span>
            <span v-else>
              {{ $filters.formatNum(count.forwards).toLocaleString('en-US') }}
            </span>
          </span>
        </span>
      </div>
      <div class="item" @click="handleShowComment">
        <span class="comment">
          <span class="comment-bgc icon-bgc">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 6H4V36H13V41L23 36H44V6Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 19.5V22.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 19.5V22.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M34 19.5V22.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text">
            <span v-if="count.comments == 0">评论</span>
            <span v-else>
              {{ $filters.formatNum(count.comments).toLocaleString('en-US') }}
            </span>
          </span>
        </span>
      </div>
      <div class="item" @click="handleLike">
        <span class="like" :class="{ liked: trendItem.interact.isLike }">
          <span class="like-bgc icon-bgc">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text">
            <span v-if="count.likes == 0">喜欢</span>
            <span v-else>
              {{ $filters.formatNum(count.likes).toLocaleString('en-US') }}
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
  <Forward
    v-if="isShowForward"
    @close="handleShowForward"
    :forwardItem="trendItem.forward ? trendItem.forward : trendItem"
  ></Forward>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import useMainStore from '@/stores/module/main'
import Forward from '../cpn/forward-item.vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import type { ITrend } from '@/service/trend-page/type'

const props = defineProps({
  trendItem: {
    type: Object as PropType<ITrend>,
    required: true
  },
  isForward: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['like', 'comment'])
const mainStore = useMainStore()
const count = computed(() => props.trendItem.count)
//显示转发组件
const isShowForward = ref(false)
const handleShowForward = () => {
  if (!mainStore.verifyIsLogin()) return
  isShowForward.value = !isShowForward.value
  stopBodyScroll(isShowForward.value)
}

// 发送点赞
const handleLike = () => {
  if (!mainStore.verifyIsLogin()) return
  emits('like')
}

const handleShowComment = () => {
  if (!mainStore.verifyIsLogin()) return
  emits('comment')
}
</script>

<style scoped lang="less">
.foot {
  display: flex;
  margin-top: 5px;
  .right {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
  .item {
    display: flex;
    justify-content: center;
    flex: 1;
    font-size: 13px;
    color: var(--color-text3);
    user-select: none;
    span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    svg {
      stroke: var(--color-text3);
    }
  }
  .icon-bgc {
    margin: 5px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    svg {
      width: 20px;
      height: 20px;
      stroke-width: 3;
    }
  }

  .like {
    &:hover {
      color: rgb(251, 52, 85);
      .like-bgc {
        svg {
          stroke: rgb(251, 52, 85);
        }
        background-color: rgba(249, 24, 128, 0.1);
      }
    }
  }

  .liked {
    color: rgb(251, 52, 85);
    svg {
      fill: rgb(251, 52, 85);
      stroke: rgb(251, 52, 85) !important;
    }
  }
  .comment {
    &:hover {
      color: #ff9c33;
      .comment-bgc {
        svg {
          stroke: #ff9c33;
        }
        background-color: #ffac0025;
      }
    }
  }

  .forwards {
    &:hover {
      color: #3191e7;
      .forward-bgc {
        svg {
          stroke: #3191e7;
        }
        background-color: #3191e715;
      }
    }
  }
}
.forward {
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    flex: 1;
    .time {
      color: grey;
      display: flex;
      font-size: 12px;
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
  }
  .item {
    flex-grow: 1;
    font-size: 12px;
    color: grey;
    .icon-bgc {
      width: 30px;
      height: 30px;
      margin: 0;
      margin-left: 5px;
      svg {
        width: 15px;
        height: 15px;
        stroke: grey;
      }
    }
  }
}
</style>
