<template>
  <div class="container">
    <section class="history" v-if="searchStore.history.length">
      <span class="delete" title="清除历史" @click="clearHistory">
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20 5.91406H28V13.9141H43V21.9141H5V13.9141H20V5.91406Z"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 40H40V22H8V40Z"
            fill="none"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M16 39.8976V33.9141"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24 39.8977V33.8977"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M32 39.8976V33.9141"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 40H36"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <div class="title">历史搜索</div>
      <ul class="history-wrap">
        <li
          v-for="item in searchStore.history"
          :key="item.n"
          class="history-item"
          @click="handleHistoryClick(item)"
        >
          <span class="svg" v-if="item.t == 0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 16H42"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 6L16 42"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M32 6V42"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 32H42"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="svg" v-else>
            <svg
              width="15"
              height="15"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="12"
                r="8"
                fill="none"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span> {{ item.n }}</span>
        </li>
      </ul>
    </section>
    <section class="hot">
      <div class="title">热门标签</div>
      <div class="hot-area">
        <ul class="hot-wrap" v-for="(arrayItem, x) in hotTag" :key="x">
          <li v-for="(item, y) in arrayItem" :key="item.tagId" class="hot-item">
            <RouterLink
              class="link"
              @click="emits('close')"
              :to="{
                name: 'TagPage',
                params: { tagName: item.tagName },
                query: { query: item.tagId }
              }"
            >
              <span class="text">
                <span class="rank" :class="{ 'rank-top': x == 0 && y < 3 }">
                  {{ x == 1 ? y + 6 : y + 1 }}
                </span>
                <span class="content">
                  {{ item.tagName }}
                </span>
              </span>
              <span class="icon" v-if="item.status == 'up'">
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
              <span class="icon" v-if="item.status == 'down'">
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
              <span class="icon" v-if="item.status == 'new'">
                <span class="text"> 新</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useSearchStore from '@/stores/module/nav-bar/module/search'
import localStorage from '@/utils/local-storage'
import type { historyType } from '@/stores/module/nav-bar/type'

const emits = defineEmits(['close'])
const searchStore = useSearchStore()
searchStore.getHotTagAction()
const router = useRouter()

// 获取历史记录
const history = localStorage.getCache('searchHistory') as historyType[]
searchStore.history = history ? history : []
const hotTag = computed(() => [
  [...searchStore.hotTag.slice(0, 5)],
  [...searchStore.hotTag.slice(5, 10)]
])
// 清除历史记录
const clearHistory = () => {
  searchStore.history = []
  localStorage.deleteCache('searchHistory')
}
//当点击 历史记录时

const handleHistoryClick = (h: historyType) => {
  // t = 0 是标签 1 是用户
  if (h.t == 0) {
    router.push({
      name: 'TagPage',
      params: { tagName: h.n },
      query: { query: h.i }
    })
  } else {
    router.push({ name: 'userHome', params: { userId: h.i } })
  }
  emits('close')
}
</script>

<style scoped lang="less">
.container {
  margin: 50px 15px 0;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-top: 18px;
  }
  .delete {
    position: absolute;
    right: 15px;
    cursor: pointer;
    svg {
      stroke: var(--color-text3);
    }
  }
  .history {
    .history-wrap {
      display: flex;
      flex-wrap: wrap;
      .history-item {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        height: 32px;
        min-width: 12px;
        max-width: 100px;
        border-radius: 8px;
        border: none;
        margin: 12px 12px 3px 0;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 400;
        background-color: var(--surface-color3);
        &:hover {
          background-color: var(--surface-color3-hover);
        }
        cursor: pointer;
        span {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          line-break: anywhere;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .svg {
          display: flex;
          margin-right: 2.5px;
          stroke: var(--color-text3);
        }
      }
    }
  }
  .hot {
    font-size: 14px;
    font-weight: 400;
    .hot-area {
      display: flex;
    }
    .hot-wrap {
      flex: 1;
    }
    .hot-item {
      display: flex;
      align-items: center;
      margin: 13px 0;
      cursor: pointer;
      border-radius: 7px;
      &:hover {
        background-color: var(--surface-color3);
      }
      .link {
        display: flex;
        align-items: center;
        flex-grow: 1;

        .text {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          line-break: anywhere;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          .rank {
            padding: 5px;
            display: inline-flex;
            justify-content: center;
            width: 22px;
            font-size: 15px;
            font-weight: 500;
            color: #d56d61;
          }
          .rank-top {
            font-weight: 700;
            color: rgb(231, 69, 69);
          }
          .content {
            color: var(--color-text2);
            font-weight: 500;
          }
        }
        .icon {
          display: flex;
          margin-left: 5px;
          padding-right: 5px;
          .text {
            font-size: 12px;
            font-weight: 700;
            color: #eb7350;
            scale: 0.9;
            padding-top: 2px;
          }
        }
      }
    }
  }
}
</style>
