<template>
  <div class="user-search" ref="searchEl">
    <div
      class="panel"
      v-lazy-loading="loadMoreUser"
      :lazy-loading-immediate="false"
      :lazy-loading-disabled="isShowSearch || focusStore.isUserEnd"
    >
      <div class="search">
        <WLInput
          class="el-input"
          :placeholder="'搜索关注用户...'"
          v-model="searchText"
          :theme="true"
        ></WLInput>
      </div>
      <ul class="result" v-if="isShowSearch">
        <li
          v-for="item in searchRes"
          :key="item.userId"
          class="item"
          @click="emits('chose', item)"
        >
          <AvatarItem
            :width="38"
            :height="38"
            :user-id="item.userId"
            :img-url="item.avatar"
            :not-link="true"
          ></AvatarItem>
          <span class="nick one-line">{{ item.userName }}</span>
        </li>
        <li class="no-found" v-show="!searchRes.length">
          <span>没有找到用户</span>
        </li>
      </ul>
      <ul class="default" v-else>
        <li
          v-for="item in focusList"
          :key="item.userId"
          class="item"
          @click="emits('chose', item)"
        >
          <AvatarItem
            :width="38"
            :height="38"
            :user-id="item.userId"
            :img-url="item.avatar"
            :not-link="true"
          ></AvatarItem>
          <span class="nick one-line">{{ item.userName }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import useFocusStore from '@/stores/module/home-page/module/focus'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import WLInput from '@/components/input/wl-input.vue'
import { useEventListener } from '@vueuse/core'

const emits = defineEmits(['chose', 'close'])

const focusStore = useFocusStore()
const focusList = computed(() => focusStore.focusList)
const searchText = ref('')

const isShowSearch = ref(false)
watch(searchText, (val) => {
  if (val.length > 0) {
    focusStore.searchFocusUserAction(val)
    isShowSearch.value = true
  } else {
    isShowSearch.value = false
  }
})
const searchRes = computed(() => focusStore.searchUser)

let page = 2 // 页面加载时请求过 1 所有懒加载从2开始
const loadMoreUser = () => {
  focusStore.getUserFocusLitsAction(page++)
}

const searchEl = ref<HTMLDivElement>()
onMounted(() => {
  //监听点击其他地方关闭
  useEventListener(document, 'mouseup', (event: MouseEvent) => {
    const clickEl = event.target as HTMLElement
    const area = searchEl.value?.parentElement
    if (!(clickEl == area || area?.contains(clickEl))) {
      emits('close')
    }
  })
})
</script>

<style scoped lang="less">
.user-search {
  position: absolute;
  top: 100px;
  right: 0px;
  z-index: 99;
  width: 300px;
  padding-bottom: 15px;
  border-radius: 10px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  //箭头
  &::before {
    content: '';
    position: absolute;
    top: -7px;
    right: 25px;
    height: 12px;
    width: 12px;
    transition: background-color 0.3s ease;
    background-color: var(--surface-color1);
    border-top: 1px solid var(--surface-color1-shadow);
    border-left: 1px solid var(--surface-color1-shadow);
    transform: rotate(45deg);
    z-index: 1;
  }
}
.panel {
  position: relative;
  padding: 0 10px 10px;
  max-height: 350px;
  overflow-y: scroll;
  .search {
    background-color: var(--surface-color1);
    position: sticky;
    top: 0;
    padding: 20px 0 5px;
    z-index: 99;

    :deep(.input-wrap) {
      --input--height: 35px;
    }
  }
}
.item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  .nick {
    font-size: 13px;
    font-weight: 400;
    margin-left: 10px;
  }
  &:hover {
    background-color: var(--surface-color3);
  }
}
.no-found {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
