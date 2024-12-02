<template>
  <div class="avatar-menu">
    <div class="content">
      <div class="content-wrap">
        <div class="title">
          <div class="item">
            <AvatarItem
              class="avatar-warp"
              :user-id="mainStore.userId"
              :img-url="mainStore.avatarUrl"
              :width="45"
              :height="45"
            ></AvatarItem>
            <div class="info">
              <span class="name-edit">
                <span class="name">{{ mainStore.userName }}</span>
              </span>
              <span class="count">
                <span>
                  关注: {{ $filters.formatNum(navBarStore.following) }}
                </span>
                <span> 粉丝: {{ $filters.formatNum(navBarStore.fans) }} </span>
              </span>
            </div>
          </div>
        </div>
        <div class="border-color">
          <div class="item" @click="goToHome">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="24"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            个人主页
          </div>
          <div class="item" @click="goToCommission">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M41 44V20H7V44H41Z"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="4"
                />
                <path
                  d="M24 44V20"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="4"
                />
                <path
                  d="M41 44H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="4"
                />
                <rect
                  x="4"
                  y="12"
                  width="40"
                  height="8"
                  fill="none"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 4L24 12L32 4"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            我的约稿
          </div>
          <div class="item" @click="changeTheme" v-if="theme === 'light'">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.0527 4.41085C22.5828 5.83695 18.5455 10.8106 18.5455 16.7273C18.5455 23.7564 24.2436 29.4545 31.2727 29.4545C37.1894 29.4545 42.1631 25.4172 43.5891 19.9473C43.8585 21.256 44 22.6115 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C25.3885 4 26.744 4.14149 28.0527 4.41085Z"
                  fill="none"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            深色模式
          </div>
          <div class="item" @click="changeTheme" v-if="theme === 'dark'">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.15039 9.15088L11.3778 11.3783"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 24H6.15"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.15039 38.8495L11.3778 36.6221"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M38.8495 38.8495L36.6221 36.6221"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M44.9996 24H41.8496"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M38.8495 9.15088L36.6221 11.3783"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 3V6.15"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 45.0001V41.8501"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            浅色模式
          </div>
          <div class="item" @click="$emit('showCode')">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 4H4V44H44V4Z"
                  fill="none"
                  stroke-width="4"
                  stroke-linejoin="bevel"
                />
                <path
                  d="M12 16V32"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="bevel"
                />
                <path
                  d="M20 16V32"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="bevel"
                />
                <path
                  d="M28 16V32"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="bevel"
                />
                <path
                  d="M36 16V32"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="bevel"
                />
              </svg>
            </span>
            邀请码
          </div>
        </div>
        <div class="border-color">
          <div class="item" @click="goToSetting">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="15"
                  fill="none"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 39V44"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M39 23H44"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 23H9"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 4V9"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M34.6064 34.6064L38.142 38.142"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M33.8994 12.6865L37.4349 9.15099"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.15088 37.4351L12.6864 33.8995"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.85791 9.85791L13.3934 13.3934"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            设置
          </div>
          <div class="item" @click="handleHelp">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                  fill="none"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 28.6248V24.6248C27.3137 24.6248 30 21.9385 30 18.6248C30 15.3111 27.3137 12.6248 24 12.6248C20.6863 12.6248 18 15.3111 18 18.6248"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M24 37.6248C25.3807 37.6248 26.5 36.5055 26.5 35.1248C26.5 33.7441 25.3807 32.6248 24 32.6248C22.6193 32.6248 21.5 33.7441 21.5 35.1248C21.5 36.5055 22.6193 37.6248 24 37.6248Z"
                  fill="#000000"
                />
              </svg>
            </span>
            帮助
          </div>
          <div class="item" @click="$emit('showFeedback')">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 7H4V37H11V42L21 37H44V7Z"
                  fill="none"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M31 16V17"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 16V17"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M31 25C31 25 29 29 24 29C19 29 17 25 17 25"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            意见反馈
          </div>
        </div>
        <div class="border-color">
          <div class="item" @click="exitAccount">
            <span class="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.9917 6H6V42H24"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M33 33L42 24L33 15"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 23.9917H42"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            退出登录
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import useMainStore from '@/stores/module/main'
import useNavBarStore from '@/stores/module/nav-bar'
import { clearAllStore } from '@/stores/utils'
import colorScheme from '@/utils/color-scheme'
import AvatarItem from '../../../avatar/avatar-item.vue'
import { MessageBox } from '@/components/message-box'

const mainStore = useMainStore()
const navBarStore = useNavBarStore()

defineEmits(['showCode', 'showFeedback'])

//改变颜色主题
const theme = ref(colorScheme.getNowTheme())
const changeTheme = () => {
  if (theme.value === 'dark') {
    colorScheme.setTheme('light', true)
    theme.value = 'light'
  } else {
    colorScheme.setTheme('dark', true)
    theme.value = 'dark'
  }
}

// 跳转个人首页
const goToHome = () => {
  const url = router.resolve({
    name: 'userHome',
    params: {
      userId: mainStore.userId
    }
  })
  window.open(url.href, '_blank')
}

const goToCommission = () => {
  const url = router.resolve({
    name: 'CommissionHome',
    params: {
      userId: mainStore.userId
    }
  })
  window.open(url.href, '_blank')
}

const goToSetting = () => {
  router.push({
    name: 'manageProfile'
  })
}

// 帮助提示
const handleHelp = () => {
  MessageBox({
    text: '如果需要帮助可以<a href="/about" style="color:#409eff;" target="_blank">联系我们</a>',
    onlyTip: true
  })
}

// 退出账号
const exitAccount = async () => {
  await router.replace({
    name: 'LoginPage'
  })
  clearAllStore()
}
</script>

<style scoped lang="less">
.avatar-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: var(--color-text1);
  z-index: 3000;
  position: absolute;
  right: 5px;
  user-select: none;
}

//箭头
.content::before {
  content: '';
  position: absolute;
  top: -7px;
  right: 25px;
  height: 12px;
  width: 12px;
  transition: background-color 0.3s ease;
  background-color: var(--bgc2);
  border-top: 1px solid var(--border-color1);
  border-left: 1px solid var(--border-color1);
  transform: rotate(45deg);
  z-index: 1;
}
.content {
  position: relative;
  top: 9px;
  white-space: nowrap;
  background-color: var(--bgc2);
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  .content-wrap {
    padding: 10px 0;
    min-width: 223px;

    .item {
      display: flex;
      padding: 10px 8px 10px 16px;
      cursor: pointer;
      .icon {
        margin-right: 10px;
        svg {
          stroke: var(--color-text1);
        }
      }
      &:hover {
        background-color: var(--surface-color3);
      }
    }
    .title {
      padding-bottom: 15px;
      .avatar-warp {
        flex-shrink: 0;
        margin-right: 15px;
      }
      .info {
        display: flex;
        flex-direction: column;
        width: 100%;
        .name-edit {
          display: flex;
          .name {
            max-width: 115px;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          }
        }
        .count {
          margin-top: 10px;
          font-size: 12px;
          font-weight: 500;
          span {
            margin-right: 10px;
          }
        }
      }
      .item {
        cursor: default;
        &:hover {
          background-color: var(--surface-color1);
        }
      }
    }
    .border-color {
      border-top: 1px solid var(--border-color1);
      padding-top: 5px;
      margin-top: 5px;
    }
  }
}
</style>
