<template>
  <div class="search-part" :class="{ 'change-white': isWhiteColor }">
    <div class="container">
      <WLInput
        @click="navBarStore.isShowPanel = true"
        class="el-input"
        placeholder="搜索..."
        v-model="searchText"
      >
        <div class="to-search" @click="handleKeyDownEnter">
          <span class="icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M33.2216 33.2217L41.7069 41.707"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </WLInput>
      <SearchPanel
        v-if="navBarStore.isShowPanel"
        @close="navBarStore.isShowPanel = false"
      ></SearchPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import WLInput from '@/components/input/wl-input.vue'
import SearchPanel from './search-panel.vue'
import useNavBarStore from '@/stores/module/nav-bar'
import useSearchStore from '@/stores/module/nav-bar/module/search'
import { debounce } from '@/utils/debounce'
import { EVENT_CODE } from '@/components/config/event_code'
import localStorage from '@/utils/local-storage'
import type { historyType } from '@/stores/module/nav-bar/type'

defineProps({
  isWhiteColor: {
    type: Boolean,
    default: false
  }
})

const navBarStore = useNavBarStore()
const searchStore = useSearchStore()
const router = useRouter()

const searchText = ref('')
watch(
  searchText,
  debounce((text: string) => {
    searchStore.searchText = text
    searchStore.searchAction()
    if (searchText.value) navBarStore.isShowPanel = true
  }, 250)
)

// 按回车 找到精确匹配的 跳转路由,如果没有精确匹配不做反应
const handleKeyDownEnter = () => {
  if (!searchText.value) return
  if (searchStore.searchType == 'tag') {
    const choice = searchStore.searchTagResult.searchData
    if (!choice) return
    const { tagName, tagId } = choice[0]

    router.push({
      name: 'TagPage',
      params: { tagName: tagName },
      query: { query: tagId }
    })
    saveSearch(tagName, tagId)
  } else {
    const choice = searchStore.searchUserResult.searchData
    if (!choice) return
    const { userId, userName } = choice[0]
    router.push({
      name: 'userHome',
      params: { userId: userId }
    })
    saveSearch(userName, userId)
  }
  navBarStore.isShowPanel = false
}

// 处理按回车的情况
useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  if (e.code == EVENT_CODE.enter) handleKeyDownEnter()
})

//路由跳转时 重置
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    searchStore.$reset()
    searchText.value = ''
  }
)

const saveSearch = (text: string, id: string) => {
  let history = localStorage.getCache('searchHistory') as historyType[]
  const searchType = searchStore.searchType === 'tag' ? 0 : 1
  const saveData = { n: text, t: searchType, i: id }
  // 如果没有搜索历史 直接设置
  if (!history) {
    localStorage.setCache('searchHistory', [saveData])
  } else {
    history.unshift(saveData)
    // 去重
    history = Array.from(new Set(history))
    //大于10 删除一个
    if (history.length > 10) history.pop()
    localStorage.setCache('searchHistory', history)
  }
}

// 传递方法 给子组件方便点击结果时保存 历史
provide('saveSearch', saveSearch)
</script>

<style scoped lang="less">
.search-part {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 380px;

  .container {
    position: relative;
    border-radius: 35px;
    transition: background-color 0.5s ease;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(2px);
    width: 100%;
  }
}
.el-input {
  height: 36px;
  :deep(.content) {
    background-color: transparent;
    --primary-hover-color: var(--border-color2-hover);
    --primary-transparent-color: var(--transparent-hover);
    //input 预设文字颜色
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: var(--color-text3);
    }
    input {
      font-weight: 400;
      font-size: 15px;
      color: var(--color-text1);
    }
  }
}
.to-search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 50%;
  border-left: 1.5px solid var(--border-color2);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    border-color: var(--border-color2-hover);
    .icon {
      background-color: var(--bgc-hover);
    }
  }
  .icon {
    display: flex;
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    transition: all 0.3s ease;
    svg {
      stroke: var(--color-text1);
    }
  }
}

//透明时候 文字为白色
.change-white {
  .container {
    background-color: rgba(0, 0, 0, 0.05);
    .el-input {
      :deep(.content) {
        border: 1.3px solid #fff;
        --primary-transparent-color: rgba(255, 255, 255, 0.35);
        //input 预设文字颜色
        input::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #fff;
        }
        input {
          color: #fff;
        }
      }
      .to-search {
        border-left: 1.5px solid #fff;
        &:hover {
          .icon {
            background-color: #6f6f6f;
          }
        }
        svg {
          stroke: #fff;
        }
      }
    }
  }
}
</style>
