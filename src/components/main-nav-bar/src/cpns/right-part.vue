<template>
  <div class="right-part" :class="{ 'change-white': isWhiteColor }">
    <!-- 未登录状态 -->
    <div class="login-register" v-if="!mainStore.userId">
      <ElButton class="btn login-btn" @click="goToLogin">
        登陆 / 注册
      </ElButton>
    </div>
    <!-- 登录状态 -->
    <div class="login-status" v-else>
      <div class="item upload-artwork">
        <router-link :to="{ name: 'UploadPage' }" target="_blank">
          <ElButton class="upload-btn"> 上传作品 </ElButton>
        </router-link>
      </div>
      <div class="item message jump">
        <router-link :to="{ name: 'MessagePage' }" target="_blank">
          <svg
            t="1636599224421"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6471"
            width="23"
            height="23"
          >
            <path
              d="M1022.08 716.928V300.48l-217.28 217.344 217.28 199.04M655.36 667.2a188.16 188.16 0 0 1-133.888 55.488c-50.56 0-98.176-19.712-133.952-55.488L270.976 550.592 20.864 779.84v38.4c0 50.24 40.832 91.072 91.008 91.072h819.2c50.176 0 91.008-40.832 91.008-91.008v-39.68l-249.536-228.608-117.12 117.12"
              p-id="6472"
            ></path>
            <path
              d="M932.928 128h-819.2C63.616 128 22.848 168.832 22.848 219.008v19.008l398.784 398.912c27.2 27.136 63.36 42.112 101.76 42.112 38.464 0 74.624-14.976 101.76-42.112L1024 238.016v-19.008C1024 168.832 983.04 128 932.928 128M20.864 300.48v417.6L238.72 518.4 20.864 300.48"
              p-id="6473"
            ></path>
          </svg>
          <span class="unread" v-if="navStore.messageUnread">
            {{ navStore.messageUnread }}
          </span>
        </router-link>
      </div>
      <div class="item reminder jump">
        <router-link :to="{ name: 'NotifyPage' }" target="_blank">
          <svg
            t="1641782698423"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5522"
            width="25"
            height="25"
          >
            <path
              d="M808 712l-48-108.8V448c0-102.4-65.6-195.2-160-232-3.2-44.8-41.6-80-88-80s-83.2 35.2-88 80c-96 36.8-160 129.6-160 232v155.2l-48 108.8c-6.4 14.4-4.8 30.4 3.2 43.2 8 12.8 22.4 20.8 38.4 20.8h508.8c16 0 30.4-8 38.4-20.8s9.6-30.4 3.2-43.2zM512 880c44.8 0 80-35.2 80-80H432c0 44.8 35.2 80 80 80z"
              p-id="5523"
            ></path>
          </svg>
          <span class="unread" v-if="navStore.notifyUnread">
            {{ navStore.notifyUnread }}
          </span>
        </router-link>
      </div>
      <div class="item avatar" @mouseleave="closeAvatarMenu">
        <AvatarItem
          @mouseenter="showAvatarMenu"
          :img-url="mainStore.avatarUrl"
          :user-id="mainStore.userId"
          :width="38"
          :height="38"
          :lazy-load="'close'"
        ></AvatarItem>
        <Transition>
          <AvatarMenu
            v-if="isShowAvatarMenu"
            @showCode="$emit('showCode')"
            @show-feedback="$emit('showFeedback')"
          ></AvatarMenu>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ElButton from '@/components/button/el-button.vue'
import useMainStore from '@/stores/module/main'
import useNavStore from '@/stores/module/nav-bar'
import AvatarMenu from './avatar-menu.vue'
import AvatarItem from '../../../avatar/avatar-item.vue'

defineEmits(['showCode', 'showFeedback'])

defineProps({
  isWhiteColor: {
    type: Boolean,
    default: false
  }
})

const mainStore = useMainStore()
const navStore = useNavStore()
//展示头像菜单
const isShowAvatarMenu = ref(false)
const showAvatarMenu = () => {
  isShowAvatarMenu.value = true
}
const closeAvatarMenu = () => {
  isShowAvatarMenu.value = false
}

//跳转到注册
const goToLogin = () => {
  mainStore.isShowLogin = true
}
</script>

<style scoped lang="less">
.right-part {
  padding-right: 30px;
  min-width: 306px;
}
.login-register {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .login-btn {
    color: #fff;
    height: 35px;
    padding: 8px 13px;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 500;
    background-color: #1565dc;
    &:hover {
      background-color: #1359c1;
    }
  }
}

.login-status {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  .item {
    padding-left: 20px;
    position: relative;
    .unread {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: -10px;
      top: -3px;
      z-index: 1;
      background-color: #f1403c;
      color: #fff;
      font-size: 12px;
      border-radius: 8px;
      height: 16px;
      line-height: 16px;
      min-width: 8px;
      padding: 0 4px;
    }
  }
  .upload-artwork {
    position: relative;
    .upload-btn {
      font-size: 13px;
      background-color: #fff;
      padding: 8px 18px;
      border: 1px solid #6d6c6c45;
      border-radius: 18px;
      color: #000;
      cursor: pointer;
      &:hover {
        background-color: var(--primary-white-hover-color);
      }
    }
  }
  // 两个icon 样式
  svg {
    fill: var(--color-text1);
    cursor: pointer;
    position: relative;
    top: 1px;
  }
  .jump:hover {
    svg {
      animation: jump 0.5s;
    }
    @keyframes jump {
      0% {
        transform: translate(0px, 0px);
      }
      50% {
        transform: translate(0px, -5px);
      }
      100% {
        transform: translate(0px, 0px);
      }
    }
  }
}

.avatar {
  position: relative;
  margin-right: -20px;
  padding-right: 20px;
}

//透明时候 文字为白色
.change-white {
  .login-status {
    svg {
      fill: #fff;
    }
  }
}
</style>
