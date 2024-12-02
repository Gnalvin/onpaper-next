<template>
  <div
    class="banner-wrap"
    @mouseleave="showHandleBanner"
    @mouseenter="showHandleBanner"
  >
    <div class="upload" v-if="ownerNoBanner" @click="handleUploadShow">
      <div class="edit-wrap">
        <span class="icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.0654 27.8812L23.9999 20.9238L31.1318 28.0002"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24 38.0001V24.4619"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <div class="tip">设置主页背景</div>
      </div>
    </div>
    <div class="banner" v-if="banner">
      <img
        draggable="false"
        :src="userProfileStore.bannerUrl"
        alt=""
        class="picture"
        @error="handleImgErr"
        @load="handleImgLoad"
      />
    </div>
    <Transition>
      <div class="handle-banner" v-if="ownerHaveBanner && showHandle">
        <ElButton class="chang-banner btn" @click="handleUploadShow">
          <svg
            width="16"
            height="16"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42 26V40C42 41.1046 41.1046 42 40 42H8C6.89543 42 6 41.1046 6 40V8C6 6.89543 6.89543 6 8 6L22 6"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 26.7199V34H21.3172L42 13.3081L34.6951 6L14 26.7199Z"
              fill="none"
              stroke="#fff"
              stroke-width="4"
              stroke-linejoin="round"
            />
          </svg>
        </ElButton>
        <ElButton class="delete-banner btn" @click="handleDeleteBanner">
          <svg
            width="16"
            height="16"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 11L40 11"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 5L30 5"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 17H36V40C36 41.6569 34.6569 43 33 43H15C13.3431 43 12 41.6569 12 40V17Z"
              fill="none"
              stroke="#fff"
              stroke-width="4"
              stroke-linejoin="round"
            />
            <path
              d="M20 25L28 33"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M28 25L20 33"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </ElButton>
      </div>
    </Transition>
  </div>
  <Transition appear>
    <BannerUpload v-if="isShowUpload" @close="handleUploadShow"></BannerUpload>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useUserProfileStore from '@/stores/module/user-home/module/profile'
import useUserHomeStore from '@/stores/module/user-home'
import ElButton from '@/components/button/el-button.vue'
import { MessageBox } from '@/components/message-box'
import BannerUpload from './banner-upload.vue'
import { stopBodyScroll } from '@/utils/stopScroll'
import { handleImgErr } from '@/utils/handle-img'

const userProfileStore = useUserProfileStore()
const userHomeStore = useUserHomeStore()

//是首页主人但没有图片 显示上传提示
const ownerNoBanner = computed(() => {
  return userHomeStore.owner && !userProfileStore.bannerUrl
})
//只要有图片 则显示图片
const banner = computed(() => {
  return !!userProfileStore.bannerUrl
})
//是主人且有图片 显示编辑按钮
const ownerHaveBanner = computed(() => {
  return userHomeStore.owner && userProfileStore.bannerUrl
})

const isShowUpload = ref(false)
const handleUploadShow = () => {
  isShowUpload.value = !isShowUpload.value
  stopBodyScroll(isShowUpload.value, false)
}

const handleDeleteBanner = () => {
  MessageBox({
    text: '是否删除背景封面'
  }).then(() => {
    userProfileStore.deleteUserBannerAction()
  })
}
// 鼠标进入banner 显示 删除和上传
const showHandle = ref(false)
const showHandleBanner = () => {
  showHandle.value = !showHandle.value
}

const handleImgLoad = (event: Event) => {
  const el = event.target as HTMLImageElement
  el.dataset.times = '0'
}
</script>

<style scoped lang="less">
.banner-wrap {
  position: relative;
  height: 370px;
  width: 100%;
  border-radius: 25px;
  overflow: hidden;
  background-color: var(--surface-color2);
  transition: background-color 0.5s ease;
}
.upload {
  display: flex;
  justify-content: center;
  height: 370px;
  width: 100%;
  background-color: var(--surface-color2);
  transition: background-color 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: var(--surface-color2-hover);
  }
  .edit-wrap {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      svg {
        stroke: var(--color-text1);
      }
    }

    .tip {
      margin-top: 15px;
      color: var(--color-text1);
    }
  }
}
.banner {
  .picture {
    height: 370px;
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }
}
.handle-banner {
  .btn {
    display: flex;
    padding: 10px;
    margin: auto;
    border-color: transparent;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease 0s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .chang-banner {
    position: absolute;
    bottom: 10px;
    right: 80px;
  }
  .delete-banner {
    position: absolute;
    bottom: 10px;
    right: 20px;
  }
}
</style>
