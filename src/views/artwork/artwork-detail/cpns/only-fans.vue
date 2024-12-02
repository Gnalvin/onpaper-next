<template>
  <div class="top-mask-layer only-fans">
    <AvatarItem
      class="avatar"
      :user-id="artInfo.userId"
      :img-url="artInfo.avatarName"
      :width="80"
      :height="80"
    ></AvatarItem>
    <div class="username">{{ artInfo.userName }}</div>
    <div class="followers">
      <div>
        {{ $filters.formatNum(artInfo.userCount.fans) }}
        <span>粉丝</span>
      </div>
      <div>
        {{ $filters.formatNum(artInfo.userCount.likes) }}
        <span>喜欢</span>
      </div>
      <div>
        {{ $filters.formatNum(artInfo.userCount.collects) }}
        <span>收藏</span>
      </div>
    </div>
    <ElButton class="btn" @click="$emit('focus')">
      <span>
        <svg
          t="1640765563982"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5755"
          width="10"
          height="10"
        >
          <path
            d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z"
            p-id="5756"
            fill="#fff"
          ></path>
        </svg>
      </span>
      <span>关注</span>
    </ElButton>
    <div class="tip">作品仅允许粉丝可见</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import ElButton from '@/components/button/el-button.vue'
import { stopBodyScroll } from '@/utils/stopScroll'

defineEmits(['focus'])

const artworkStore = useArtworkDetailStore()
const artInfo = computed(() => artworkStore.artInfo)

onMounted(() => stopBodyScroll(true))
onUnmounted(() => stopBodyScroll(false))
</script>

<style scoped lang="less">
.only-fans {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: var(--transparent-theme-color2);
  backdrop-filter: blur(5px);
  .tip {
    font-size: 20px;
    font-weight: 600;
    margin-top: 35px;
  }

  .username {
    font-size: 30px;
    font-weight: 600;
    display: flow-root;
    margin-top: 10px;
    color: var(--color-text1);
  }
  .followers {
    display: flex;
    align-items: center;
    color: var(--color-text2);
    font-weight: bold;
    height: 35px;
    margin-top: 10px;
    span {
      margin: 0 15px 0 5px;
      color: var(--color-text3);
      font-size: 15px;
      font-weight: 400;
    }
  }
}
.btn {
  padding: 8px 20px;
  svg {
    margin-right: 5px;
  }
}
</style>
