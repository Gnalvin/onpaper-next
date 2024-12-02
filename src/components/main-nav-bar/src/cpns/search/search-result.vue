<template>
  <div class="container">
    <div class="search-title">
      <span
        class="type"
        v-for="(item, i) in searchType"
        :key="item"
        :class="{ 'chose-type': i != choseIndex }"
        @click="changeSearchType(i)"
      >
        {{ item }}
      </span>
    </div>
    <div class="result">
      <Transition mode="out-in" appear name="tab">
        <KeepAlive>
          <component
            :is="searchCpns[choseIndex]"
            @close="emits('close')"
          ></component>
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useSearchStore from '@/stores/module/nav-bar/module/search'
import TagResult from './tag-result.vue'
import UserResult from './user-result.vue'
import TopicResult from './topic-result.vue'
const emits = defineEmits(['close'])
const searchStore = useSearchStore()

const choseIndex = ref(0)
const searchType = ['搜标签', '搜画师', '搜话题']
const searchCpns = [TagResult, UserResult, TopicResult]
const changeSearchType = (index: number) => {
  choseIndex.value = index
  if (index === 0) {
    searchStore.searchType = 'tag'
  } else if (index === 1) {
    searchStore.searchType = 'user'
  } else {
    searchStore.searchType = 'topic'
  }
}
changeSearchType(0)
</script>

<style scoped lang="less">
.container {
  margin: 35px 15px 10px;
  .search-title {
    display: flex;
    position: relative;
    .type {
      display: flex;
      justify-content: center;
      flex-grow: 1;
      padding: 8px;
      cursor: pointer;
      &:first-child {
        margin-left: -15px;
        border-right: 1px solid var(--border-color1);
      }
      &:last-child {
        margin-right: -15px;
      }
    }
  }
}
.result {
  margin-top: 10px;
}
.chose-type {
  background-color: var(--btn-color3);
}

.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.2s ease;
}
.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}
</style>
