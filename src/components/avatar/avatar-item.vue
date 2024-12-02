<template>
  <div
    class="avatar-item"
    v-if="userId"
    :class="{ opacity: lazyLoad == 'close' }"
  >
    <span v-if="notLink">
      <img
        draggable="false"
        v-lazy-img:[lazyLoad]="fileNameUrl ?? imgUrl"
        @load="handleLoad"
        @error="handleImgErr"
      />
    </span>
    <router-link
      :to="{ name: page, params: { userId } }"
      :target="openNew ? '_blank' : ''"
      v-else
    >
      <img
        draggable="false"
        v-lazy-img:[lazyLoad]="fileNameUrl ?? imgUrl"
        @load="handleLoad"
        @error="handleImgErr"
        style="cursor: pointer"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { handleImgErr } from '@/utils/handle-img'
import { formatPicUrl } from '@/utils/data-format'
const props = defineProps({
  userId: {
    type: String,
    require: true
  },
  imgUrl: {
    type: String,
    require: true
  },
  height: {
    type: Number,
    default: 40
  },
  width: {
    type: Number,
    default: 40
  },
  notLink: {
    type: Boolean,
    default: false
  },
  lazyLoad: {
    type: String as PropType<'open' | 'close'>,
    default: 'open'
  },
  radius: {
    type: Number,
    default: 100
  },
  openNew: {
    type: Boolean,
    default: false
  },
  fileName: {
    type: String
  },
  goToCommission: {
    type: Boolean,
    default: false
  }
})
const page = computed(() =>
  props.goToCommission ? 'CommissionHome' : 'userHome'
)
const imgHeight = computed(() => props.height + 'px')
const imgWidth = computed(() => props.width + 'px')
const borderRadius = computed(() => props.radius + '%')
const handleLoad = (event: Event) => {
  const imgEl = event.target as HTMLImageElement
  imgEl.style.opacity = '1'
}
const fileNameUrl = computed(() => {
  if (props.fileName !== undefined && props.userId !== undefined) {
    const size = props.height > 50 ? '' : 's'
    return formatPicUrl(props.fileName, props.userId, 'avatars', size)
  }
  return undefined
})
</script>

<style scoped lang="less">
.avatar-item {
  position: relative;
  img {
    width: v-bind(imgWidth);
    height: v-bind(imgHeight);
    border-radius: v-bind(borderRadius);
    border: 1px solid rgba(0, 0, 0, 0.05);
    background-color: #fff;
    object-fit: cover;
    box-sizing: border-box;
    opacity: 0;
    transition: opacity 0.6s;
  }
  &::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.02);
    width: v-bind(imgWidth);
    height: v-bind(imgHeight);
    pointer-events: none;
    z-index: 1;
    border-radius: v-bind(borderRadius);
  }
}
.opacity {
  img {
    opacity: 1 !important;
    transition: opacity 0s !important;
  }
}
</style>
