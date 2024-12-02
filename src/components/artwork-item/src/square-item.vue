<template>
  <div class="card" :style="{ ...itemStyle }" v-if="artworkItem.artworkId">
    <div
      class="img-wrap"
      @mouseout="maskShow"
      @mouseover="maskShow"
      @click="handleCancel"
    >
      <div class="rank" v-if="rank" :style="rankBgc">
        <span>{{ rank }}</span>
      </div>
      <div class="who-see" v-if="artworkItem.isOwner && whoSee">
        {{ whoSee }}
      </div>
      <Transition appear>
        <template v-if="!isCanSee">
          <div
            class="no-see mask"
            @click.stop
            v-if="artworkItem.whoSee == 'onlyFans' && !isFans"
          >
            <span>仅粉丝可见</span>
          </div>
          <div
            class="no-see mask"
            @click.stop
            v-else-if="artworkItem.whoSee == 'privacy'"
          >
            <Transition mode="out-in">
              <span v-if="isShowMask && isShowCancel"> 取消收藏 </span>
              <span v-else> 不公开或已删除</span>
            </Transition>
          </div>
        </template>
        <div class="mask" v-else-if="isShowMask">
          <div class="mask-count" v-if="isShowCount">
            <span class="item">
              <svg
                width="19"
                height="19"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ $filters.formatNum(artworkItem.likes) }}
            </span>
            <span class="item">
              <svg
                width="19"
                height="19"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
              </svg>
              {{ $filters.formatNum(artworkItem.collects) }}
            </span>
          </div>
        </div>
      </Transition>
      <RouterLink
        class="title"
        :class="{ 'no-event': !isCanSee && artworkItem.whoSee != 'onlyFans' }"
        :to="{
          name: 'ArtworkDetail',
          params: { artId: artworkItem.artworkId }
        }"
        :target="openNew ? '_blank' : '_self'"
        draggable="false"
      >
        <img
          draggable="false"
          v-lazy-img="artworkItem.cover"
          @load="handleLoad"
          @error="handleImgErr"
        />
      </RouterLink>
      <div class="count-warp" v-if="artworkItem.picCount > 1">
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
        <span class="icon-count text-info">{{ artworkItem.picCount }}</span>
      </div>
    </div>
    <div class="info">
      <RouterLink
        v-if="artworkItem.title"
        class="title"
        :class="{ 'no-event': !isCanSee && artworkItem.whoSee != 'onlyFans' }"
        :to="{
          name: 'ArtworkDetail',
          params: { artId: artworkItem.artworkId }
        }"
        target="_blank"
      >
        <span class="text-info" :class="{ 'big-title': bigTitle }">
          {{ artworkItem.title }}
        </span>
      </RouterLink>
      <div class="like-time" v-if="isShowLike && isShowTime">
        <span class="like text-info" v-if="isShowLike">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="14"
            height="14"
          >
            <path fill="none" d="M0 0H24V24H0z" />
            <path
              d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
              fill="rgba(160,160,160,1)"
            />
          </svg>
          {{ $filters.formatNum(artworkItem.likes) }}</span
        >
        <span class="time text-info" v-if="isShowTime">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="14"
            height="14"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-10V7h-2v7h6v-2h-4z"
              fill="rgba(160,160,160,1)"
            />
          </svg>
          {{ $filters.formatAccuracyTime(artworkItem.createAT) }}</span
        >
      </div>
      <div class="user-info" v-if="isShowUser">
        <AvatarItem
          class="avatar"
          :userId="artworkItem.userId"
          :imgUrl="artworkItem.userAvatar"
          :width="24"
          :height="24"
        ></AvatarItem>
        <router-link
          v-if="artworkItem.userId"
          class="title"
          :to="{
            name: 'userHome',
            params: { userId: artworkItem.userId }
          }"
          target="_blank"
        >
          <span class="name text-info">{{ artworkItem.userName }}</span>
        </router-link>
      </div>
    </div>
  </div>
  <Skeleton v-else :padding-top="paddingTop"></Skeleton>
</template>

<script setup lang="ts">
import { computed, type PropType, type CSSProperties, ref } from 'vue'
import type { ISquareArtwork } from '../type'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import Skeleton from './square-skeleton.vue'
import { handleImgErr } from '@/utils/handle-img'

const emits = defineEmits(['cancel'])
const props = defineProps({
  rank: {
    type: Number
  },
  artworkItem: {
    type: Object as PropType<ISquareArtwork>,
    required: true
  },
  isShowTime: {
    type: Boolean,
    default: true
  },
  isShowLike: {
    type: Boolean,
    default: true
  },
  isShowUser: {
    type: Boolean,
    default: true
  },
  bigTitle: {
    type: Boolean,
    default: false
  },
  itemStyle: {
    type: Object as PropType<CSSProperties>
  },
  // 100% 为正方形,75% = 16:9
  paddingTop: {
    type: String,
    default: '75%'
  },
  openNew: {
    type: Boolean,
    default: true
  },
  isShowCount: {
    type: Boolean,
    default: false
  },
  isShowCancel: {
    type: Boolean,
    default: false
  },
  isFans: {
    type: Number as PropType<0 | 1 | 2>,
    default: 0
  }
})
// 排序时 左上角的 颜色
const rankBgc = computed(() => {
  let bgc: CSSProperties = {}
  switch (props.rank) {
    case 1:
      bgc = { backgroundColor: '#c45656' }
      break
    case 2:
      bgc = { backgroundColor: '#d7bb49' }
      break
    case 3:
      bgc = { backgroundColor: '#337ecc' }
      break
    default:
      break
  }
  return bgc
})

const isShowMask = ref(false)
const maskShow = () => {
  isShowMask.value = !isShowMask.value
}
const handleLoad = (event: Event) => {
  const imgEl = event.target as HTMLImageElement
  imgEl.style.opacity = '1'
}
const whoSee = computed(() => {
  const str = props.artworkItem.whoSee
  if (str === 'onlyFans') {
    return '仅粉丝可见'
  } else if (str === 'privacy') {
    return '仅自己可见'
  } else {
    return ''
  }
})
//删除/私密/不是关注 不展示作品
const isCanSee = computed(() => {
  if (props.artworkItem.isDelete) {
    return false
  }
  if (props.artworkItem.isOwner) return true
  if (props.artworkItem.whoSee == 'privacy') {
    return false
  }
  if (props.artworkItem.whoSee == 'onlyFans') {
    return props.artworkItem.isFocus
  }
  return true
})

const handleCancel = () => {
  if (!props.isShowCancel || isCanSee.value) return
  emits('cancel', props.artworkItem.artworkId, props.artworkItem.userId)
}
</script>

<style scoped lang="less">
.card {
  position: relative;
  padding-top: v-bind('props.paddingTop');
  .img-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: v-bind('props.paddingTop');
    cursor: pointer;
    img {
      border-radius: 8px;
      user-select: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.35s;
    }
    .mask {
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.25);
      pointer-events: none;
      .mask-count {
        flex-grow: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          svg {
            margin-right: 5px;
            stroke: #fff;
            fill: #fff;
          }
        }
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
        margin-left: 5px;
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
    &::before {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.02);
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      border-radius: 8px;
    }
    &:hover {
      a {
        img {
          opacity: 0.8;
        }
      }
    }
  }
  .info {
    margin-top: 6px;
    .user-info {
      display: flex;
      align-items: center;
      margin-top: 5px;
      .avatar {
        margin-right: 10px;
      }
      .name {
        line-height: 22px;
        font-size: 14px;
        color: var(--color-regular);
      }
    }
  }
  .title {
    .big-title {
      color: var(--color-regular) !important;
      font-weight: 700;
      font-size: 14px;
    }
    &:hover {
      span {
        color: #00a1d6;
        cursor: pointer;
      }
    }
  }
  .who-see {
    position: absolute;
    top: 0;
    left: 0;
    color: rgb(255, 255, 255);
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 3px;
  }
  .rank {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    min-width: 25px;
    min-height: 25px;
    font-size: 16px;
    font-weight: 700;
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    span {
      margin: 2px;
      display: flex;
    }
  }
}
.text-info {
  color: var(--color-regular);
  font-size: 13px;
  line-height: 22px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all; // 只对英文起作用，以字母作为依据，强制换行
  line-break: anywhere; // 任意位置都可以作为换行点，包括任意的标点。
  white-space: normal !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.like-time {
  display: flex;
  span {
    display: flex;
    align-items: center;
    svg {
      height: 14px;
      margin-right: 5px;
    }
  }
  .like {
    flex: 1;
  }
  .time {
    min-width: 87px;
    flex: 1;
  }
}
.no-see {
  z-index: 999 !important;
  background-color: var(--transparent-theme-color1) !important;
  backdrop-filter: blur(5px);
  font-size: 16px;
  user-select: none;
}
.no-event {
  pointer-events: none;
}
</style>
