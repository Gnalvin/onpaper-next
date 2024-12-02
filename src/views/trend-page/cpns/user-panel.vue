<template>
  <div class="user-info" v-if="userProfile">
    <div class="banner">
      <img v-if="userProfile.banner" :src="userProfile.banner" alt="" />
    </div>
    <div class="info">
      <div class="avatar">
        <AvatarItem
          :height="60"
          :width="60"
          :user-id="userProfile.userId"
          :radius="10"
          :not-link="true"
          :img-url="userProfile.avatar"
        ></AvatarItem>
      </div>
      <div class="nick" :class="{ 'margin-top': !userProfile.vStatus }">
        <span class="one-line">{{ userProfile.userName }}</span>
        <VTag
          :v-status="userProfile.vStatus"
          :v-tag="userProfile.vTag"
          style="margin-top: 5px"
        ></VTag>
      </div>
    </div>
    <div class="count">
      <div class="item">
        <span class="num">{{ $filters.formatNum(userProfile.fans) }}</span>
        <span class="text">粉丝</span>
      </div>
      <div class="item">
        <span class="num">{{ $filters.formatNum(userProfile.likes) }}</span>
        <span class="text">喜欢</span>
      </div>
      <div class="item">
        <span class="num">{{ $filters.formatNum(userProfile.collects) }}</span>
        <span class="text">收藏</span>
      </div>
    </div>
    <div class="tools" v-if="!userProfile.isOwner">
      <ElButton
        class="btn focused"
        :verifyLogin="true"
        v-if="isFocus"
        @click="handleFocus"
      >
        {{ isFocus == 1 ? '已关注' : '相互关注' }}
      </ElButton>
      <ElButton class="btn" v-else :verifyLogin="true" @click="handleFocus">
        关注
      </ElButton>
      <ElButton class="btn message" :verifyLogin="true" @click="handleSendMsg">
        私信
      </ElButton>
    </div>
  </div>
  <Message
    :receiver="messageReceiver"
    @close="handleSendMsg"
    v-if="isShowMessage"
  ></Message>
</template>

<script setup lang="ts">
import { computed, ref, onDeactivated } from 'vue'
import { AvatarItem, VTag } from '@/components/avatar'
import useTrendStore from '@/stores/module/trend'
import useDetailStore from '@/stores/module/trend/detail'
import ElButton from '@/components/button/el-button.vue'
import Message from '@/views/message/message-mask.vue'
import { MessageBox } from '@/components/message-box'
import { debounce } from '@/utils/debounce'
import { stopBodyScroll } from '@/utils/stopScroll'

const trendStore = useTrendStore()
const detailStore = useDetailStore()

const userProfile = computed(() => trendStore.userPanel)
// 是否关注作者
const isFocus = computed(() => detailStore.trendDetail?.interact.isFocusAuthor)

onDeactivated(() => {
  trendStore.userPanel = null
})

const handleFocus = debounce(() => {
  //取消关注时 弹出提示
  if (isFocus.value) {
    MessageBox({
      text: `是否取消关注 @${userProfile.value!.userName} ?`
    }).then(() => {
      detailStore.postUserFocusAction()
    })
    return
  }
  detailStore.postUserFocusAction()
}, 100)

// 私信接收者
const messageReceiver = computed(() => {
  return {
    userId: userProfile.value!.userId,
    userName: userProfile.value!.userName,
    avatar: userProfile.value!.avatar
  }
})

const isShowMessage = ref(false)
const handleSendMsg = () => {
  isShowMessage.value = !isShowMessage.value
  stopBodyScroll(isShowMessage.value)
}
</script>

<style scoped lang="less">
.user-info {
  border-radius: 5px;
  padding: 18px;
  background-color: var(--surface-color4);
  .banner {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    border: 0.5px solid var(--border-color1);
    height: 120px;
    background-color: var(--bgc3);
    &::after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        var(--surface-color1) 180%
      );
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    display: flex;
    .avatar {
      position: relative;
      top: -17px;
      margin-left: 20px;
    }
    .nick {
      font-weight: 500;
      margin: 7px 0 0 20px;
    }
    .margin-top {
      margin-top: 13px;
    }
  }
  .count {
    display: flex;
    margin-top: 10px;
    .item {
      flex: 1 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .num {
        font-size: 16px;
        font-weight: 600;
      }
      .text {
        margin-top: 5px;
        font-size: 12px;
        font-weight: 400;
        color: var(--color-text3);
      }
    }
  }
  .tools {
    margin: 15px 5px 0;
    display: flex;
    justify-content: space-around;
    .btn {
      height: 28px;
      padding: 8px 30px;
    }
    .message {
      color: var(--color-text1);
      background-color: var(--btn-color2);
      border: 1px solid var(--color-text1);
      &:hover {
        background-color: var(--btn-color2-hover);
      }
    }
  }
}
.focused {
  color: var(--color-regular);
  background-color: var(--btn-cancel-color);
}
.focused:hover {
  background-color: var(--btn-cancel-hover-color);
}
</style>
