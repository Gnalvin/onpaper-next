<template>
  <Transition appear>
    <div class="search-panel">
      <div class="panel">
        <Transition mode="out-in" appear name="tip">
          <SearchTip
            @close="emits('close')"
            v-if="!isShowSearchResult"
          ></SearchTip>
          <SearchResult @close="emits('close')" v-else></SearchResult>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import SearchTip from './search-tip.vue'
import SearchResult from './search-result.vue'
import useSearchStore from '@/stores/module/nav-bar/module/search'

const emits = defineEmits(['close'])
const searchStore = useSearchStore()
const isShowSearchResult = ref(false)
watch(
  () => searchStore.searchText,
  (val) => {
    if (val.length > 0) {
      isShowSearchResult.value = true
    } else {
      isShowSearchResult.value = false
    }
  },
  { immediate: true }
)
onMounted(() => {
  //监听点击其他地方关闭
  useEventListener(document, 'mouseup', (event: MouseEvent) => {
    const clickEl = event.target as HTMLElement
    const searchEl = document.querySelector('.search-part')
    if (!(clickEl == searchEl || searchEl?.contains(clickEl))) {
      emits('close')
    }
  })
})
</script>

<style scoped lang="less">
.search-panel {
  width: 100%;
  position: absolute;
  top: 0px;
  z-index: -1;
}

.panel {
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 12px;
  background-color: var(--surface-color1);
  border-radius: 10px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  overflow: hidden;
  min-height: 250px;
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.2s ease;
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}
</style>
