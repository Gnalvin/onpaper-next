<template>
  <div class="nav">
    <div class="container">
      <div class="nav-wrap">
        <template v-for="(item, index) in tab" :key="item.val">
          <span
            :title="item.text"
            class="item"
            :class="{ chose: index === choseTab }"
            @click="handleChoseTab(item)"
            v-if="
              item.val == 'focus' || item.val == 'message'
                ? mainStore.userId
                : true
            "
          >
            <svg
              v-if="item.val == 'hot'"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C32.2347 44 38.9998 37.4742 38.9998 29.0981C38.9998 27.0418 38.8953 24.8375 37.7555 21.4116C36.6157 17.9858 36.3861 17.5436 35.1809 15.4279C34.666 19.7454 31.911 21.5448 31.2111 22.0826C31.2111 21.5231 29.5445 15.3359 27.0176 11.6339C24.537 8 21.1634 5.61592 19.1853 4C19.1853 7.06977 18.3219 11.6339 17.0854 13.9594C15.8489 16.2849 15.6167 16.3696 14.0722 18.1002C12.5278 19.8308 11.8189 20.3653 10.5274 22.4651C9.23596 24.565 9 27.3618 9 29.4181C9 37.7942 15.7653 44 24 44Z"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-if="item.val == 'focus'"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8579 9.85803C7.23858 13.4773 5 18.4773 5 24.0002C5 29.523 7.23858 34.523 10.8579 38.1423"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M39.1421 38.1423C42.7614 34.523 45 29.523 45 24.0002C45 18.4773 42.7614 13.4773 39.1421 9.85803"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M34.8994 33.8997C37.4329 31.3662 38.9999 27.8662 38.9999 24.0002C38.9999 20.1342 37.4329 16.6342 34.8994 14.1007"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M15.1005 14.1007C12.567 16.6342 11 20.1342 11 24.0002C11 27.8662 12.567 31.3662 15.1005 33.8997"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M28.1818 20C30.2905 20 32 21.6118 32 23.6C32 26.1882 29.4545 28.4 28.1818 29.6C27.3333 30.4 26.2727 31.2 25 32C23.7273 31.2 22.6667 30.4 21.8182 29.6C20.5455 28.4 18 26.1882 18 23.6C18 21.6118 19.7095 20 21.8182 20C23.1463 20 24.316 20.6393 25 21.6093C25.684 20.6393 26.8537 20 28.1818 20Z"
                stroke-width="3"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-if="item.val == 'new'"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 4H37L26 18H41L17 44L22 25H8L19 4Z"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-if="item.val == 'message'"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 39H44V24V9H24H4V24V39Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M4 9L24 24L44 9"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 9H4V24"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M44 24V9H24"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text"> {{ item.text }}</span>
          </span>
        </template>
      </div>
      <div class="create" title="发动态">
        <ElButton
          class="btn"
          :verify-login="true"
          @click="handleShowTrendEditor"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="0 96 960 960"
            width="28"
          >
            <path
              d="M321 896q-24 0-42-18t-18-42V736h124V609q-38 3-76-10.5T241 556v-58h-50L60 367q36-34 86-55.5T248 290q30 0 68.5 9.5T385 330v-74h455v535q0 44-30.5 74.5T735 896H321Zm124-160h245v55q0 20 12.5 32.5T735 836q20 0 32.5-12.5T780 791V316H445v57l241 241v43h-43L517 531l-17 20q-13 15-26 23t-29 15v147ZM218 438h83v89q17 11 33.5 16.5T368 549q25 0 51-13.5t38-27.5l17-20-69-69q-32-32-72-50.5T248 350q-27 0-49 6.5T154 374l64 64Zm412 358H321v40h323q-6-6-10-16.5t-4-23.5Zm-309 40v-40 40Z"
            />
          </svg>
          <span>发动态</span>
        </ElButton>
      </div>
    </div>
  </div>
  <TrendEditor
    v-if="isShowTrendEditor"
    @close="handleShowTrendEditor"
  ></TrendEditor>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import userTrendPageStore from '@/stores/module/trend'
import useMainStore from '@/stores/module/main'
import { shuffle } from '@/utils/data-format'
import ElButton from '@/components/button/el-button.vue'
import { TrendEditor } from '@/components/trend'
import { stopBodyScroll } from '@/utils/stopScroll'

const emits = defineEmits(['scrollTop'])

const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()
const trendStore = userTrendPageStore()

type tabType = { text: string; val: 'hot' | 'new' | 'focus' | 'message' }
const tab: tabType[] = [
  { text: '全部关注', val: 'focus' },
  { text: '热门动态', val: 'hot' },
  { text: '最新动态', val: 'new' },
  { text: '我的私信', val: 'message' }
]
const choseTab = ref(-1)

const handleChoseTab = async (item: tabType) => {
  if (item.val == 'message') {
    const url = router.resolve({ name: 'MessagePage' })
    window.open(url.href, '_blank')
    return
  }
  await router.push({
    name: 'trendHome',
    query: {
      mode: item.val
    }
  })
  emits('scrollTop')
}

// 修正刷新时 选中的显示
let lastMode: any
watch(
  () => route.query.mode,
  async (mode) => {
    //每次路由变化 打乱推荐用户数据
    trendStore.recommendUser = shuffle(trendStore.recommendUser)
    // 如果不是 trendHome 以下代码不执行
    if (route.name !== 'trendHome') return
    choseTab.value = tab.findIndex((i) => i.val === mode)
    // 没有找到 重定向 到'hot'
    if (choseTab.value === -1) {
      router.push({
        name: 'trendHome',
        query: {
          mode: 'hot'
        }
      })
      return
    }
    // 每次记录请求的 type,避免点击详情动态 再返回 重复请求
    if (lastMode === mode) return
    lastMode = mode
    trendStore.loadType = mode as 'hot' | 'new' | 'focus'
    trendStore.trends = []
    trendStore.isEnd = false
    trendStore.noHaveTrend = false
    trendStore.waiting = true // 避免页面抖动时懒加载也请求一次
    await trendStore.getFullData()
    trendStore.waiting = false
  },
  { immediate: true }
)

const isShowTrendEditor = ref(false)
const handleShowTrendEditor = () => {
  isShowTrendEditor.value = !isShowTrendEditor.value
  stopBodyScroll(isShowTrendEditor.value, false)
}
</script>

<style scoped lang="less">
.nav-wrap {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: var(--surface-color4);
  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    padding: 10px 18px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0s;
    user-select: none;
    &:hover {
      color: var(--color-text4-hover);
      background-color: var(--transparent-little-hover);
      svg {
        stroke: var(--color-text4-hover);
      }
    }
    svg {
      margin-right: 10px;
      stroke: var(--color-regular);
    }
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
.container {
  position: sticky;
  top: 65px;
  width: 200px;
  flex-shrink: 0;
}
.create {
  .btn {
    padding: 10px 69px;
    font-size: 14px;
    svg {
      display: none;
    }
  }
}
@media (max-width: 1200px) {
  .container {
    width: 145px;
  }
  .btn {
    padding: 10px 40px !important;
  }
}

@media (max-width: 1100px) {
  .container {
    width: 70px;
  }
  .item {
    margin: 10px 0 !important;
    justify-content: center;
    svg {
      margin: 0px !important;
    }
    .text {
      display: none;
    }
  }
  .btn {
    padding: 8px !important;
    border-radius: 50%;
    svg {
      display: block !important;
      fill: #fefefe;
    }
    span {
      display: none;
    }
  }
}
</style>
