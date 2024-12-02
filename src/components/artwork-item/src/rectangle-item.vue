<template>
  <div
    class="item"
    :style="{
      width: artInfo.width + 'px',
      height: artInfo.height + 'px'
    }"
  >
    <Skeleton v-if="isShowSkeleton"></Skeleton>
    <transition>
      <div class="more-info" v-if="isShowMoreInfo" appear>
        <div class="count-warp" v-if="artInfo.picCount > 1">
          <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="13"
              height="13"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"
                fill="rgba(255,255,255,1)"
              />
            </svg>
          </span>
          <span class="icon-count text-info">{{ artInfo.picCount }}</span>
        </div>
        <div class="title">{{ artInfo.title }}</div>
        <div class="user-info">
          <AvatarItem
            :width="32"
            :height="32"
            :user-id="artInfo.userId"
            :img-url="artInfo.userAvatar"
          ></AvatarItem>
          <div class="username">
            <router-link
              :to="{
                name: 'userHome',
                params: { userId: artInfo.userId }
              }"
              target="_blank"
            >
              {{ artInfo.userName }}
            </router-link>
          </div>
        </div>
      </div>
    </transition>
    <router-link
      class="link"
      :to="{
        name: 'ArtworkDetail',
        params: { artId: artInfo.artworkId }
      }"
      target="_blank"
      @mouseenter="showMoreInfo"
      @mouseleave="showMoreInfo"
    >
      <img
        draggable="false"
        class="img-item"
        @load="handleImgOk"
        v-lazy-img="artInfo.firstPic"
        @error="handleImgErr"
        alt=""
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import AvatarItem from '@/components/avatar/avatar-item.vue'
import Skeleton from './rectangle-skeleton.vue'
import { ref, type PropType } from 'vue'
import type { IRectangleArtwork } from '../type'
import { handleImgErr } from '@/utils/handle-img'

defineProps({
  artInfo: {
    type: Object as PropType<IRectangleArtwork>,
    required: true
  }
})

const isShowMoreInfo = ref(false)
const showMoreInfo = () => {
  isShowMoreInfo.value = !isShowMoreInfo.value
}
const isShowSkeleton = ref(true)
const handleImgOk = (event: Event) => {
  isShowSkeleton.value = false
  const imgEl = event.target as HTMLImageElement
  imgEl.style.opacity = '1'
}
</script>

<style scoped lang="less">
.item {
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  border-radius: 13px;
  background-color: var(--surface-color2);
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.02);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    border-radius: 8px;
  }
  .more-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.35);
    width: 100%;
    height: 100%;
    cursor: pointer;
    pointer-events: none;
    .title {
      margin-left: 15px;
      font-size: 15px;
      color: #fff;
      font-weight: 500;
    }
    .user-info {
      height: 50px;
      width: 100%;
      display: flex;
      align-items: flex-end;
      padding: 0 0 11px 12px;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 0, 0, 0.6) 81%
      );
      .avatar {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      .username {
        height: 32px;
        width: 150px;
        a {
          color: white;
          line-height: 32px;
          margin-left: 12px;
          font-size: 15px;
          font-weight: 500;
          display: inline-block;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .link {
    position: absolute;
    top: 0;
    bottom: 0;
    .img-item {
      box-sizing: border-box;
      object-fit: cover;
      width: 236px;
      height: 100%;
      opacity: 0;
      transition: opacity 0.5s;
    }
  }

  .count-warp {
    margin: 3px 3px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 18px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.32);
    span {
      display: flex;
    }
    .icon {
      margin-left: 6px;
      font-size: 16px;
      line-height: 16px;
    }
    .icon-count {
      color: white;
      font-weight: bold;
      overflow: visible;
      line-height: 13.8px;
      margin: 0 4px;
    }
  }
}
</style>
