<template>
  <div class="user-wrap">
    <div class="artworks">
      <ul class="art-wrap">
        <li v-for="art in userInfo.artworks" :key="art.artworkId">
          <router-link
            class="title"
            :to="{
              name: 'ArtworkDetail',
              params: { artId: art.artworkId }
            }"
            target="_blank"
          >
            <img class="art" draggable="false" v-lazy-img="art.cover" alt="" />
          </router-link>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <div class="user-info">
        <AvatarItem
          :height="40"
          :width="40"
          :user-id="userInfo.userId"
          :img-url="userInfo.avatar"
        ></AvatarItem>
        <div class="text">
          <router-link
            class="title"
            :to="{
              name: 'userHome',
              params: { userId: userInfo.userId }
            }"
            target="_blank"
          >
            <div class="name">
              {{ userInfo.userName }}
              <VTag
                :v-status="userInfo.vStatus"
                style="margin-left: 8px"
              ></VTag>
            </div>
          </router-link>
        </div>
      </div>
      <div class="is-focus">
        <template v-if="loginUserId != userInfo.userId">
          <ElButton
            class="btn focused"
            v-if="userInfo.isFocus"
            @click="postFocus"
          >
            {{ userInfo.isFocus == 1 ? '已关注' : '相互关注' }}
          </ElButton>
          <ElButton class="btn focus" @click="postFocus" v-else>
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
        </template>
        <template v-else>
          <ElButton class="btn focused"> 我自己 </ElButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { AvatarItem, VTag } from '../avatar'
import ElButton from '../button/el-button.vue'
import type { IUserInfo } from './type'

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserInfo>,
    required: true
  },
  // 当前登陆用户
  loginUserId: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['focus'])
const postFocus = () => {
  const { userId, userName, isFocus } = props.userInfo
  emits('focus', { userId, userName, isFocus })
}
</script>

<style scoped lang="less">
.user-wrap {
  margin-right: 5px;
  height: 200px;
  width: 390px;
  border-radius: 8px;
  background-color: var(--transparent-hover);
  overflow: hidden;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .user-info {
    display: flex;
    align-items: center;
    margin: 12px 16px;
    .text {
      margin-left: 10px;
    }
    .status {
      display: flex;
      align-items: center;
      color: #28bc79;
      font-size: 12px;
      margin-top: 1px;
      svg {
        margin-right: 5px;
      }
    }
    .name {
      display: flex;
      font-weight: bold;
      font-size: 14px;
      line-height: 22px;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .is-focus {
    margin-right: 15px;
    .btn {
      padding: 8px 20px;
      svg {
        margin-right: 5px;
      }
    }
    .focused {
      color: var(--color-regular);
      background-color: var(--btn-cancel-color);
    }
    .focused:hover {
      background-color: var(--btn-cancel-hover-color);
    }
  }
}

.artworks {
  .art-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
  }
  .art-wrap::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.02);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  .art {
    border: none;
    width: 130px;
    height: 130px;
    cursor: pointer;
    object-fit: cover;
    transition: opacity 0.2s ease 0s;
  }
  .art:hover {
    opacity: 0.8;
  }
}
</style>
