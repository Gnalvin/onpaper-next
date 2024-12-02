<template>
  <div class="profile-wrap">
    <div class="container">
      <div
        class="avatar"
        @mouseleave="editAvatarShow"
        @mouseenter="editAvatarShow"
      >
        <img draggable="false" :src="profileStore.avatarUrl" alt="" />
        <Transition>
          <div
            class="mask"
            v-show="isAvatarMask"
            @click="isShowAvatarUpload = true"
          >
            <div class="mask-img">
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
              >
                <path
                  d="M896.000854 170.666667h0.384A127.616 127.610 0 0 1 1024.000853 298.666667v554.666666c0 70.698667-57.258667 128-127.616 128H127.574187A127.616 127.616 0 0 1 0.000853 853.333333V298.666667c0-70.698667 57.258667-128 127.616-128H128.000853v-0.298667A128.042667 128.042667 0 0 1 255.702187 42.666667h512.597333A128.042667 128.042667 0 0 1 896.000853 170.368V170.666667z m-85.333333 0v-0.298667C810.66752 123.008 772.352853 128 725.078187 128H298.92352C251.606187 128 213.334187 122.794667 213.334187 170.368V170.666667h597.333333zM85.334187 340.992v470.016C85.334187 857.898667 123.350187 896 170.240853 896h683.52c46.592 0 84.906667-38.058667 84.906667-84.992V340.992A84.992 84.992 0 0 0 853.760853 256H170.240853C123.69152 256 85.334187 294.058667 85.334187 340.992zM213.334187 170.666667v85.333333h597.333333V170.666667H213.334187z m298.666666 640a256 256 0 1 1 0-512 256 256 0 0 1 0 512z m0-85.333334a170.666667 170.666667 0 1 0 0-341.333333 170.666667 170.666667 0 0 0 0 341.333333z m256-341.333333c0-23.552 18.901333-42.666667 42.624-42.666667h42.752c23.552 0 42.624 18.944 42.624 42.666667 0 23.552-18.901333 42.666667-42.624 42.666667h-42.752A42.538667 42.538667 0 0 1 768.000853 384z"
                  fill="#ffffff"
                ></path>
              </svg>
              <span class="img-text">替换头像</span>
            </div>
          </div>
        </Transition>
      </div>
      <div class="user-info">
        <div class="username">{{ profileStore.userName }}</div>
        <div class="tag">
          <VTag
            style="margin-right: 15px"
            :v-status="profileStore.vStatus"
            :v-tag="profileStore.vTag"
          ></VTag>
          <RouterLink
            v-if="profileStore.userId"
            :to="{
              name: 'CommissionHome',
              params: { userId: profileStore.userId }
            }"
          >
            <div class="status" v-if="profileStore.commission">
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
          </RouterLink>
        </div>

        <div class="followers">
          <div>
            {{ $filters.formatNum(profileStore.count.following) }}
            <span>关注</span>
          </div>
          <div>
            {{ $filters.formatNum(profileStore.count.fans) }}
            <span>粉丝</span>
          </div>
          <div>
            {{ $filters.formatNum(profileStore.count.likes) }}
            <span>喜欢</span>
          </div>
        </div>
        <SnsLink
          class="links"
          :QQ="profileStore.QQ"
          :Twitter="profileStore.Twitter"
          :Email="profileStore.workEmail"
          :Pixiv="profileStore.Pixiv"
          :Weibo="profileStore.Weibo"
          :WeChat="profileStore.WeChat"
          :Bilibili="profileStore.Bilibili"
        ></SnsLink>
        <div class="introduce">
          <span class="content" v-if="profileStore.introduce">
            {{ introduce }}
          </span>
          <span class="see-more" @click="handleSHowPanel"> 查看更多 </span>
        </div>
        <div class="handle" v-if="userHomeStore.owner">
          <RouterLink :to="{ name: 'accountManage' }">
            <ElButton class="edit"> 编辑个人资料 </ElButton>
          </RouterLink>
        </div>
        <div class="handle" v-else>
          <ElButton
            class="btn focused"
            v-if="userHomeStore.isFocus"
            :verifyLogin="true"
            @click="handleFocus"
          >
            {{ userHomeStore.isFocus == 1 ? '已关注' : '相互关注' }}
          </ElButton>
          <ElButton
            class="btn add-focus"
            :verifyLogin="true"
            @click="handleFocus"
            v-else
          >
            关注
          </ElButton>
          <ElButton
            class="btn message"
            :verifyLogin="true"
            @click="handleShowMessage"
            >私信
          </ElButton>
        </div>
      </div>
      <span class="report" v-if="!userHomeStore.owner" @click="handleShowReport"
        ><svg
          width="14"
          height="14"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z"
            fill="none"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M8 42H40"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 13L7 14"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 3.9999L14 6.9999"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.0001 9.99989L7.00009 6.99989"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        举报
      </span>
    </div>
  </div>
  <AvatarUpload
    v-if="isShowAvatarUpload"
    @close="isShowAvatarUpload = false"
    @upload="handleAvatarUpload"
  ></AvatarUpload>
  <ProfilePanel
    v-if="isShowPanel"
    @close="handleSHowPanel"
    @focus="handleFocus"
  ></ProfilePanel>
  <Message
    :receiver="messageReceiver"
    @close="handleShowMessage"
    v-if="isShowMessage"
  ></Message>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useUserProfileStore from '@/stores/module/user-home/module/profile'
import useUserHomeStore from '@/stores/module/user-home'
import useMainStore from '@/stores/module/main'
import ElButton from '@/components/button/el-button.vue'
import SnsLink from '@/components/sns-link/src/sns-link.vue'
import ProfilePanel from './profile-panel.vue'
import AvatarUpload from '@/components/avatar-upload/src/avatar-upload.vue'
import Message from '@/views/message/message-mask.vue'
import VTag from '@/components/avatar/verify-tag.vue'
import { MessageBox } from '@/components/message-box'
import { ReportPanel } from '@/components/report'
import { debounce } from '@/utils/debounce'
import { stopBodyScroll } from '@/utils/stopScroll'
import { reBytesStr } from '@/utils/data-format'
import type { uploadPayload } from '@/stores/module/user-home/type'

const profileStore = useUserProfileStore()
const userHomeStore = useUserHomeStore()
const mainStore = useMainStore()

// 是否展示 头像上传蒙版
const isAvatarMask = ref(false)
const editAvatarShow = () => {
  if (userHomeStore.owner) isAvatarMask.value = !isAvatarMask.value
}

const isShowAvatarUpload = ref(false)
//上传头像

const handleAvatarUpload = (payload: uploadPayload) => {
  profileStore.uploadAvatarAction(payload)
}
//关注/取消关注
// 关注/取消关注
const handleFocus = debounce(() => {
  //取消关注时 弹出提示
  if (userHomeStore.isFocus) {
    MessageBox({
      text: `是否取消关注 @${profileStore.userName} ?`
    }).then(() => {
      userHomeStore.postUserFocusAction()
    })
    return
  }
  userHomeStore.postUserFocusAction()
}, 350)

const introduce = computed(() => {
  // eslint-disable-next-line no-control-regex
  const bLen = profileStore.introduce.replace(/[^\x00-\xff]/g, '01').length
  //如果大于 120字节 则隐藏一部分
  if (bLen > 120) {
    return reBytesStr(profileStore.introduce, 120) + '  ...'
  }
  return profileStore.introduce
})

const isShowPanel = ref(false)
const handleSHowPanel = () => {
  isShowPanel.value = !isShowPanel.value
  stopBodyScroll(isShowPanel.value)
}
// 私信接收者
const messageReceiver = computed(() => {
  return {
    userId: profileStore.userId,
    userName: profileStore.userName,
    avatar: profileStore.avatarUrl
  }
})
// 是否展示私信框
const isShowMessage = ref(false)
const handleShowMessage = () => {
  isShowMessage.value = !isShowMessage.value
  stopBodyScroll(isShowMessage.value)
}

//举报用户
const handleShowReport = () => {
  if (!mainStore.verifyIsLogin()) return
  ReportPanel({
    msgId: profileStore.userId,
    msgType: 'usr',
    defendant: profileStore.userId
  })
}
</script>

<style scoped lang="less">
.profile-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  transition: background-color 0.5s ease;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: -60px;
  border-radius: 100%;
  background: #fff;
  width: 125px;
  height: 125px;
  img {
    width: 120px;
    height: 120px;
    border-radius: 100%;
    object-fit: cover;
  }
  &::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.02);
    width: 120px;
    height: 120px;
    pointer-events: none;
    z-index: 1;
    border-radius: 100%;
  }
  .mask {
    border-radius: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.35);
    width: 120px;
    height: 120px;
    cursor: pointer;
    .mask-img {
      position: absolute;
      top: 35px;
      right: 30px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .img-text {
        margin-top: 5px;
        color: #fff;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
.user-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .username {
    display: flex;
    font-size: 30px;
    font-weight: 600;
    display: flow-root;
    margin-top: 10px;
    color: var(--color-text1);
  }
  .handle {
    margin: 15px 0 20px;
    .btn {
      width: 100px;
      padding: 8px 17px;
    }
    .add-focus {
      background-color: var(--btn-color1);
      &:hover {
        background-color: var(--btn-color1-hover);
      }
    }
    .message {
      height: 28px;
      color: var(--color-text1);
      background-color: var(--btn-color2);
      border: 1px solid var(--color-text1);
      &:hover {
        background-color: var(--btn-color2-hover);
      }
    }
    .focused {
      color: var(--color-text1);
      background-color: var(--btn-color3);
      &:hover {
        background-color: var(--btn-color3-hover);
      }
    }
    .edit {
      padding: 15px 25px;
      border-radius: 20px;
      letter-spacing: 1.5px;
      color: var(--color-text1);
      background-color: var(--btn-color3);
      &:hover {
        background-color: var(--btn-color3-hover);
      }
    }
  }
  .followers {
    display: flex;
    align-items: center;
    color: var(--color-text2);
    font-weight: bold;
    height: 35px;
    margin-top: 13px;
    span {
      margin: 0 15px 0 5px;
      color: var(--color-text3);
      font-size: 15px;
      font-weight: 400;
    }
  }
  .introduce {
    margin-top: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    color: var(--color-text3);
    .see-more {
      position: relative;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-middle-color);
      cursor: pointer;
    }
  }

  .links {
    margin: 5px;
  }
}
.tag {
  display: flex;
  align-items: center;
  margin-top: 15px;
  .status {
    display: flex;
    align-items: center;
    color: #28bc79;
    font-weight: 700;
    font-size: 13px;
    svg {
      margin-right: 5px;
    }
  }
}
.report {
  position: absolute;
  right: 20px;
  top: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--color-text3);
  svg {
    margin-right: 2px;
    stroke: var(--color-text3);
  }
}
</style>
