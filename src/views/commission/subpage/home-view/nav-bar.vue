<template>
  <div class="nav">
    <div class="temp" v-if="userInfo">
      <div class="user-panel">
        <div class="banner">
          <img v-if="userInfo.banner" :src="userInfo.banner" alt="" />
        </div>
        <AvatarItem
          class="avatar"
          :width="80"
          :height="80"
          :user-id="userInfo.userId"
          :img-url="userInfo.avatar"
        ></AvatarItem>
        <div class="name">{{ userInfo.userName }}</div>
        <VTag
          :v-status="userInfo.vStatus"
          :v-tag="userInfo.vTag"
          style="margin-top: 10px"
        ></VTag>
        <span class="switch" v-if="userInfo.isOwner && userInfo.havePlan">
          <el-switch
            size="small"
            v-model="cStore.userPanel!.commission"
            :loading="loading"
            :before-change="updateStatus"
          />
          <span>
            {{ cStore.userPanel!.commission ? '接稿中' : '暂不接稿' }}
          </span>
          <Tooltip :text-list="['7天没有登陆，系统将修改成不接稿']"></Tooltip>
        </span>
        <div class="status" v-else-if="userInfo.commission">
          <svg
            width="15"
            height="15"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="#28bc79"
              stroke="#28bc79"
              stroke-width="4"
            />
            <path
              d="M23 14L18 24H30L25 34"
              stroke="#FFF"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          接稿中
        </div>
        <div class="count">
          <div class="item">
            <span class="num">{{ $filters.formatNum(userInfo.fans) }}</span>
            <span class="text">粉丝</span>
          </div>
          <div class="item">
            <span class="num">{{
              $filters.formatNum(userInfo.likes + userInfo.collects)
            }}</span>
            <span class="text">喜欢 + 收藏</span>
          </div>
          <div class="item">
            <span class="num" v-if="userInfo.rating">
              {{ userInfo.rating.toFixed(1) }}
            </span>
            <span v-else class="no-rating">暂无</span>
            <span class="text">评分</span>
          </div>
        </div>
        <div class="tool">
          <template v-if="!userInfo.isOwner">
            <ElButton
              class="btn"
              :verify-login="true"
              @click="handleInvite"
              :disable="!userInfo.commission"
            >
              {{ userInfo.commission ? '找Ta约稿' : '暂不接稿' }}
            </ElButton>
            <ElButton
              class="btn message"
              :verify-login="true"
              @click="handleShowMessage"
            >
              私信
            </ElButton>
          </template>
          <template v-else>
            <ElButton class="btn" @click="handleUpdatePlan">
              {{ userInfo.havePlan ? '编辑方案' : '创建方案' }}
            </ElButton>
          </template>
        </div>
      </div>
      <div class="menu">
        <RouterLink :to="{ name: 'CommissionHomePlan' }">
          <span class="item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 19H43V41C43 42.1046 42.1046 43 41 43H7C5.89543 43 5 42.1046 5 41V19Z"
                fill="none"
                stroke-linejoin="round"
              />
              <path
                d="M5 10C5 8.89543 5.89543 8 7 8H41C42.1046 8 43 8.89543 43 10V19H5V10Z"
                stroke-linejoin="round"
              />
              <path
                d="M16 31L22 37L34 25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M16 5V13" stroke-width="4" stroke-linecap="round" />
              <path d="M32 5V13" stroke-width="4" stroke-linecap="round" />
            </svg>
            接稿方案
          </span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'CommissionHomeInvite' }"
          v-if="userInfo.isOwner"
        >
          <span class="item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M41 44V20H7V44H41Z"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 44V20"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M41 44H7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect
                x="4"
                y="12"
                width="40"
                height="8"
                fill="none"
                stroke-linejoin="round"
              />
              <path
                d="M16 4L24 12L32 4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            我的企划
          </span>
        </RouterLink>
        <RouterLink :to="{ name: 'CommissionHomeAccept' }">
          <span class="item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            收到邀请
          </span>
        </RouterLink>
        <RouterLink :to="{ name: 'CommissionHomeEvaluate' }">
          <span class="item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 7H4V37H11V42L21 37H44V7Z"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M31 16V17"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 16V17"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M31 25C31 25 29 29 24 29C19 29 17 25 17 25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            完稿评价
          </span>
        </RouterLink>
        <RouterLink :to="{ name: 'userHome' }" target="_blank">
          <span class="item"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="12"
                r="8"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            个人主页
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
  <Message
    :receiver="messageReceiver"
    @close="handleShowMessage"
    v-if="isShowMessage"
  ></Message>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AvatarItem, VTag } from '@/components/avatar'
import ElButton from '@/components/button/el-button.vue'
import useCommissionStore from '@/stores/module/commission'
import Message from '@/views/message/message-mask.vue'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import { notification } from '@/components/notification'
import { stopBodyScroll } from '@/utils/stopScroll'

const cStore = useCommissionStore()
const userInfo = computed(() => cStore.userPanel)

const router = useRouter()
const handleInvite = () => {
  router.push({
    name: 'CommissionInvite',
    params: { userId: userInfo.value?.userId }
  })
}
const loading = ref(false)
const updateStatus = async () => {
  loading.value = true
  const res = await cStore.updateCommissionStatusAction()
  loading.value = false
  if (res.status === 200) {
    notification({
      title: '约稿方案',
      message: '状态修改成功～',
      type: 'success'
    })
    return true
  } else {
    notification({
      title: '约稿方案',
      message: '修改失败...请稍后再试',
      type: 'error'
    })
    return false
  }
}

const handleUpdatePlan = () => {
  const name = userInfo.value?.havePlan
    ? 'CommissionAcceptEdit'
    : 'CommissionAccept'
  router.push({ name })
}

// 私信接收者
const messageReceiver = computed(() => {
  return {
    userId: userInfo.value!.userId,
    userName: userInfo.value!.userName,
    avatar: userInfo.value!.avatar
  }
})
// 是否展示私信框
const isShowMessage = ref(false)
const handleShowMessage = () => {
  isShowMessage.value = !isShowMessage.value
  stopBodyScroll(isShowMessage.value)
}
</script>

<style scoped lang="less">
.nav {
  position: relative;
  margin-right: 10px;
  .temp {
    position: sticky;
    width: 225px;
    padding: 18px;
    top: 65px;
    border-radius: 10px;
    background-color: var(--surface-color4);
  }
}
.user-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .banner {
    width: 100%;
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
        var(--surface-color1) 300%
      );
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .avatar {
    position: absolute;
    top: 80px;
  }
  .name {
    font-size: 15px;
    font-weight: 500;
    margin-top: 55px;
  }
  .status {
    display: flex;
    align-items: center;
    color: #28bc79;
    font-weight: 700;
    font-size: 13px;
    margin-top: 14px;
    svg {
      margin-right: 5px;
    }
  }
  .switch {
    display: flex;
    align-items: center;
    margin-top: 14px;
    font-size: 13px;
    font-weight: 500;
    span {
      margin-left: 10px;
    }
  }
}
.tool {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  .btn {
    margin: 0 0 15px 0;
    padding: 9px 60px;
    border: 1px solid transparent;
  }
  .message {
    color: var(--color-text1);
    background-color: var(--btn-color2);
    border: 1px solid var(--color-text3);
    &:hover {
      background-color: var(--btn-color2-hover);
    }
  }
}
.count {
  display: flex;
  margin-top: 25px;
  width: 100%;
  .item {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
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
    .no-rating {
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
    }
  }
}

.menu {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--transparent-hover);
  margin-top: 20px;
  padding-top: 15px;
  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    padding: 13px 0 13px 40px;
    letter-spacing: 3px;
    user-select: none;
    cursor: pointer;
    color: var(--color-regular);
    svg {
      margin-right: 35px;
      stroke: var(--color-regular);
      stroke-width: 4;
      transition: scale 0.3s ease;
    }
    &:hover {
      color: var(--color-text1);
      font-weight: bold;
      svg {
        scale: 1.2;
      }
    }
  }
}
.router-link-exact-active {
  .item {
    position: relative;
    color: var(--color-text1);
    font-weight: bold;
    svg {
      scale: 1.2;
      stroke: var(--color-text1);
    }
    &::before {
      position: absolute;
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 10px;
      left: 15px;
      background-color: var(--color-text2);
    }
  }
}
</style>
