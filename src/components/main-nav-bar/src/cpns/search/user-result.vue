<template>
  <div class="user">
    <div class="title">精确匹配</div>
    <div class="res" v-if="userRes.searchData">
      <span class="item" v-for="item in userRes.searchData" :key="item.userId">
        <RouterLink
          @click="handleResClick(item.userName, item.userId)"
          :to="{
            name: 'userHome',
            params: { userId: item.userId }
          }"
        >
          <AvatarItem
            class="avatar"
            :height="32"
            :width="32"
            :img-url="item.avatar"
            :user-id="item.userId"
            :not-link="true"
          ></AvatarItem>
          <span v-html="$xss(item.showName!)" class="nick"></span>
          <VTag :v-status="item.vStatus" style="margin-left: 5px"></VTag>
        </RouterLink>
      </span>
    </div>
    <div class="res" v-else>
      <div class="not-found">
        没有找到昵称为 {{ searchStore.searchText }} 的画师
      </div>
    </div>
    <div class="title">推荐搜索</div>
    <div class="res" v-if="userRes.likeData">
      <span class="item" v-for="item in userRes.likeData" :key="item.userId">
        <RouterLink
          @click="handleResClick(item.userName, item.userId)"
          :to="{
            name: 'userHome',
            params: { userId: item.userId }
          }"
        >
          <AvatarItem
            class="avatar"
            :height="32"
            :width="32"
            :img-url="item.avatar"
            :user-id="item.userId"
          ></AvatarItem>
          <span v-html="$xss(item.showName!,xssOpt)"></span>
          <VTag :v-status="item.vStatus" style="margin-left: 5px"></VTag>
          <span class="count">
            {{ $filters.formatNum(item.likes) }}个喜欢
          </span>
        </RouterLink>
      </span>
    </div>
    <div class="res" v-else>
      <div class="not-found">没有相关推荐</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, inject } from 'vue'
import useSearchStore from '@/stores/module/nav-bar/module/search'
import { AvatarItem, VTag } from '@/components/avatar'

//v-html 白名单
const xssOpt = {
  whiteList: {
    span: ['style']
  }
}

const searchStore = useSearchStore()
const emits = defineEmits(['close'])
const userRes = computed(() => searchStore.searchUserResult)

onActivated(() => {
  searchStore.searchAction()
})
const saveSearch = inject<(t: string, i: string) => void>('saveSearch')
const handleResClick = (t: string, i: string) => {
  emits('close')
  if (saveSearch) saveSearch(t, i)
}
</script>

<style scoped lang="less">
.user {
  display: flex;
  flex-direction: column;
  font-size: 15px;
  font-weight: 400;
  .title {
    margin: 10px 0;
    font-weight: 400;
    font-size: 16px;
  }
}
.item {
  a {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    &:hover {
      background-color: var(--surface-color3);
    }
  }
  .nick {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    line-break: anywhere;
    white-space: normal !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    max-width: 200px;
  }
  .avatar {
    margin-right: 10px;
  }
  .count {
    position: absolute;
    right: 20px;
    font-size: 12px;
  }
  svg {
    margin-left: 5px;
  }
}
.not-found {
  font-size: 13px;
  padding: 10px 0;
}
</style>
