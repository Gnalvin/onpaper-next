<template>
  <div class="left-part" :class="{ 'change-white': isWhiteColor }">
    <div class="more-menu">
      <ElButton class="more-btn" @click="emits('showSidebar')">
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.94971 11.9497H39.9497"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.94971 23.9497H39.9497"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.94971 35.9497H39.9497"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </ElButton>
    </div>
    <h2 class="title">
      <router-link :to="{ name: 'HomePage' }">Onpaper</router-link>
    </h2>
    <h3 class="sub-title">
      <router-link
        :to="{ name: 'ArtworkShow', query: { zone: 'all', sort: 'hot' } }"
      >
        作品
      </router-link>
    </h3>
    <h3 class="sub-title">
      <router-link :to="{ name: 'AllUserShow', query: { type: 'hot' } }">
        画师
      </router-link>
    </h3>
  </div>
</template>

<script setup lang="ts">
import ElButton from '@/components/button/el-button.vue'
const emits = defineEmits(['showSidebar'])
defineProps({
  isWhiteColor: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.left-part {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 306px; // 和右边部分一样 保存搜索框居中

  .more-menu {
    margin: 0 15px;
    cursor: pointer;
    .more-btn {
      margin: auto;
      display: flex;
      padding: 10px;
      border-radius: 50%;
      background-color: transparent;
      &:hover {
        background-color: var(--bgc-hover);
      }
      svg {
        stroke: var(--color-text1);
      }
    }
  }
  .title {
    user-select: none;
    position: relative;
    cursor: pointer;
    bottom: 2px;
    font-size: 22px;
  }
  .sub-title {
    user-select: none;
    font-size: 17px;
    font-weight: 600;
    margin-left: 25px;
  }
}
//透明时候 文字为白色
.change-white {
  .more-menu {
    .more-btn {
      &:hover {
        background-color: var(--transparent-hover);
      }
      svg {
        stroke: #fff;
      }
    }
  }
  .title {
    a {
      color: #fff;
    }
  }
}
</style>
