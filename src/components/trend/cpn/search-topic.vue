<template>
  <div class="topic" ref="topicEL">
    <div class="wrap">
      <div class="search">
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
            fill="none"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M16.6045 19.8201H33.3838"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21.8467 15.7378L18.933 32.2622"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M28.8467 15.7378L25.933 32.2622"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.6045 28H31.3838"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="input" v-focus>
          <input
            type="text"
            placeholder="搜索话题..."
            maxlength="15"
            v-model="search"
            @input="handleTopicInput"
          />
        </div>
      </div>
      <div class="result">
        <div>
          <template v-for="item in topics" :key="item.topicId">
            <div
              class="suggest"
              @click="handleChose({ text: item.text, topicId: item.topicId })"
            >
              <svg
                width="15"
                height="15"
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
              <div class="content">
                <span class="text" v-html="$xss(item.showText, xssOpt)"></span>
                <span class="count">
                  {{ $filters.formatNum(item.count) }} 次讨论</span
                >
              </div>
            </div>
          </template>
        </div>
        <div
          class="create"
          v-if="isShowCreate && search"
          @click="handleChose({ text: search, topicId: '0' })"
        >
          <span>{{ search }}</span>
          <span>创建</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { clickOtherClose } from '@/hooks/click-close'
import useUploadTrendStore from '@/stores/module/upload/trend'
import { debounce } from '@/utils/debounce'
import { notification } from '@/components/notification'
//v-html 白名单
const xssOpt = {
  whiteList: {
    span: ['style']
  }
}
const trendStore = useUploadTrendStore()
const emits = defineEmits(['close', 'chose'])

const topicEL = ref<HTMLDivElement>()
//点击其他区域关闭
clickOtherClose(topicEL, () => emits('close'))

// 模糊查询 话题
const search = ref('')
let oldSearch = ''
const handleTopicInput = () => {
  if (!search.value) {
    trendStore.relevantTopic = []
    return
  }
  // 使用正则表达式匹配除了中文、日文、韩文字符以外的所有字符，并替换为空字符串
  const reg = /[^a-zA-Z0-9\u4e00-\u9fa5\u3040-\u30ff가-힣]/g
  search.value = search.value.replace(reg, '')
  if (oldSearch === search.value) return
  oldSearch = search.value
  debounceSearch(search.value)
}
const debounceSearch = debounce((val: string) => {
  trendStore.getRelevantTopicAction(val)
}, 250)

const topics = computed(() => trendStore.relevantTopic)

const handleChose = (topic: { text: string; topicId: string }) => {
  if (topic.text.length > 15) {
    notification({
      title: '发布动态',
      type: 'error',
      message: '创建的话题名称过长,不能超过15字'
    })
    return
  }
  if (topic.text.length <= 1) {
    notification({
      title: '发布动态',
      type: 'error',
      message: '创建的话题名称最少2个字'
    })
    return
  }
  emits('chose', topic)
  emits('close')
}
//是否显示创建条
const isShowCreate = computed(() => {
  const index = trendStore.relevantTopic?.findIndex(
    (i) => i.text.toUpperCase() === search.value.toUpperCase()
  )
  return -1 === index || index == undefined
})
</script>

<style scoped lang="less">
.topic {
  display: flex;
  position: absolute;
  width: 325px;
  background-color: var(--bgc);
  min-height: 200px;
  top: -8.5px;
  left: -8px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1002;
  .wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .search {
    padding: 5px 8px;
    display: flex;
    align-items: center;
    background-color: var(--surface-color4);
    .input {
      display: flex;
      flex: 1;
      input {
        flex: 1;
        height: 29px;
        background-color: transparent;
      }
    }
  }
}
.result {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  .suggest {
    cursor: pointer;
    font-size: 14px;
    padding: 6px 3px;
    line-height: 18px;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    border-radius: 3px;
    &:hover {
      background-color: var(--surface-color3);
    }
    .content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .count {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--color-text3);
      }
    }
    svg {
      stroke: #fefefe;
    }
  }
  .create {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--border-color1);
    font-size: 14px;
    padding: 8px 3px;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 3px;
    &:hover {
      background-color: var(--surface-color3);
    }
  }
}

svg {
  flex-shrink: 0;
  margin-right: 10px;
  stroke: var(--color-text2);
}
</style>
