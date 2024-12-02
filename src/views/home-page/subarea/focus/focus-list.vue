<template>
  <section class="header">
    <div class="all">
      <div
        class="item jump"
        :class="{ chose: choseIndex === -1 }"
        @click="handleChoseUser(choseFeed, -1)"
      >
        <div class="pic icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 20C27.866 20 31 16.866 31 13C31 9.13401 27.866 6 24 6C20.134 6 17 9.13401 17 13C17 16.866 20.134 20 24 20Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 7.25488C10.1865 8.51983 9 10.6214 9 13.0002C9 15.5465 10.3596 17.7753 12.3924 19.0002"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36 7.25488C37.8135 8.51983 39 10.6214 39 13.0002C39 15.3789 37.8135 17.4806 36 18.7455"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 40V42H36V40C36 36.2725 36 34.4087 35.391 32.9385C34.5791 30.9783 33.0217 29.4209 31.0615 28.609C29.5913 28 27.7275 28 24 28C20.2725 28 18.4087 28 16.9385 28.609C14.9783 29.4209 13.4209 30.9783 12.609 32.9385C12 34.4087 12 36.2725 12 40Z"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M43.9999 42.0001V40.8001C43.9999 36.3197 43.9999 34.0795 43.128 32.3682C42.361 30.8629 41.1371 29.6391 39.6318 28.8721"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.00009 42.0001V40.8001C4.00009 36.3197 4.00009 34.0795 4.87204 32.3682C5.63902 30.8629 6.86287 29.6391 8.36816 28.8721"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="name">所有关注</div>
      </div>
    </div>
    <div class="users">
      <SlideShow :arrayItem="focusList" :item-key="'userId'" ref="slideShowEl">
        <template v-slot:default="slotProps">
          <div
            class="item jump"
            :class="{ chose: choseIndex === slotProps.index }"
            @click="handleChoseUser(slotProps.item, slotProps.index)"
          >
            <div class="pic">
              <img :src="slotProps.item.avatar" alt="" />
            </div>
            <div class="name one-line">{{ slotProps.item.userName }}</div>
          </div>
        </template>
      </SlideShow>
    </div>
    <div class="search">
      <div class="item jump" @click="handleShowSearch">
        <div class="pic icon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z"
              fill="none"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <path
              d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M33.2216 33.2217L41.7069 41.707"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="name">搜索用户</div>
      </div>
      <UserSearch
        @chose="handleSearchChose"
        @close="handleShowSearch"
        v-if="isShowSearch"
      ></UserSearch>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useFocusStore from '@/stores/module/home-page/module/focus'
import SlideShow from '@/components/slide-show/slide-show.vue'
import UserSearch from './user-search.vue'
import type { ISimpleUserType } from '@/stores/module/home-page/type'

const focusStore = useFocusStore()
const focusList = computed(() => focusStore.focusList)

const choseFeed = {
  userId: 'all',
  userName: '关注画师',
  avatar: ''
}

// 是否展示用户搜索
const isShowSearch = ref(false)
const handleShowSearch = () => {
  isShowSearch.value = !isShowSearch.value
}
const choseIndex = ref(-1)
// 点击用户头像时 请求对应用户的 最近作品
const handleChoseUser = (userInfo: ISimpleUserType, index: number) => {
  choseIndex.value = index
  focusStore.choseUser = userInfo
}

const slideShowEl = ref<InstanceType<typeof SlideShow>>()
// 处理 搜索结果的点击
const handleSearchChose = (userInfo: ISimpleUserType) => {
  let index = focusStore.focusList.findIndex(
    (item) => item.userId === userInfo.userId
  )
  //如果在之前加载的数据中没有找到 将搜索的结果添加到 之前数据的尾部
  if (index == -1) {
    focusStore.focusList.push(userInfo)
    index = focusStore.focusList.length - 1
  }
  slideShowEl.value?.toItemPosition(index)
  choseIndex.value = index
  focusStore.choseUser = userInfo
  isShowSearch.value = false
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  .all {
    margin-right: 25px;
  }
  .search {
    position: relative;
    margin-left: 25px;
  }
  .users {
    .item {
      margin-left: 10px;
    }
  }
}
.users {
  width: calc(100% - 220px);
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 65px;
  height: 92px;
  cursor: pointer;

  &:hover {
    .name {
      color: var(--primary-middle-color);
    }
  }
  .pic {
    border-radius: 6px;
    padding: 2px;
    border: 2px solid var(--border-color2-hover);
    width: 48px;
    height: 48px;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      top: -2px;
      left: -2px;
      bottom: -2px;
      right: -2px;
      border-radius: 8px;
      box-shadow: 0 0 0 2px var(--primary-middle-color);
      transform: scale(1);
      transition: transform 0.4s ease-out;
      opacity: 0;
      pointer-events: none;
    }
    img {
      border-radius: 3px;
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
  .name {
    color: var(--color-regular);
    font-size: 13px;
    line-height: 25px;
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--border-color2-hover);
    background-color: var(--surface-color3);
    svg {
      fill: var(--color-text2);
      stroke: var(--color-text2);
    }
  }
}
.chose {
  .pic {
    transition: border-color 0;
    border: 3px solid var(--primary-middle-color) !important;
    &::before {
      animation: disperse 1s 2;
    }
  }
  .name {
    color: var(--primary-middle-color);
  }
  @keyframes disperse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(1.25);
      opacity: 0;
    }
  }
}
.jump:hover {
  .pic {
    animation: jump 0.5s;
  }
  @keyframes jump {
    0% {
      transform: translate(0px, 0px);
    }
    50% {
      transform: translate(0px, -8px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }
}
</style>
