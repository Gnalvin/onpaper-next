<template>
  <div class="user-big-card">
    <div class="userInfo">
      <AvatarItem
        :user-id="userInfo.userId"
        :img-url="userInfo.avatar"
        :width="70"
        :height="70"
        :open-new="true"
      ></AvatarItem>
      <div class="info">
        <div class="name-focus">
          <span class="name">
            <router-link
              :to="{
                name: 'userHome',
                params: { userId: userInfo.userId }
              }"
              target="_blank"
              >{{ userInfo.userName }}
            </router-link>
            <VTag :v-status="userInfo.vStatus" style="margin-left: 5px"></VTag>
          </span>
          <span class="is-focus" v-if="userInfo.userId != mainStore.userId">
            <ElButton
              class="btn focused"
              :verify-login="true"
              @click="$emit('focus', userSimpleInfo)"
              v-if="userInfo.isFocus"
            >
              {{ userInfo.isFocus == 1 ? '已关注' : '相互关注' }}
            </ElButton>
            <ElButton
              class="btn focus"
              :verify-login="true"
              @click="$emit('focus', userSimpleInfo)"
              v-else
            >
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
          </span>
        </div>
        <span class="intro">{{ userInfo.intro }}</span>
        <SnsLink
          :QQ="userInfo.QQ"
          :Twitter="userInfo.Twitter"
          :Email="userInfo.workEmail"
          :Pixiv="userInfo.Pixiv"
          :Weibo="userInfo.Weibo"
          :WeChat="userInfo.WeChat"
          :Bilibili="userInfo.Bilibili"
        ></SnsLink>
      </div>
    </div>
    <div class="artwork-info">
      <ul>
        <li v-for="art in userInfo.artworks" :key="art.artworkId" class="pic">
          <SquareArtItem
            :padding-top="'100%'"
            :artwork-item="art"
            :is-show-user="false"
            :is-show-time="false"
            :big-title="true"
          ></SquareArtItem>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SnsLink } from '@/components/sns-link'
import { SquareArtItem } from '@/components/artwork-item'
import { AvatarItem, VTag } from '@/components/avatar'
import useMainStore from '@/stores/module/main'

import { computed, type PropType } from 'vue'
import type { IUserInfo } from '@/service/rank-page/type'

import ElButton from '@/components/button/el-button.vue'

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserInfo>,
    required: true
  },
  maxShowArt: {
    type: Number,
    default: 4
  },
  picSize: {
    type: String,
    default: '220px'
  }
})

defineEmits(['focus'])
const userSimpleInfo = computed(() => {
  return {
    isFocus: props.userInfo.isFocus,
    userName: props.userInfo.userName,
    userId: props.userInfo.userId
  }
})
const mainStore = useMainStore()
</script>

<style scoped lang="less">
.user-big-card {
  flex-grow: 1;
  display: flex;
}
.userInfo {
  display: flex;
  flex-shrink: 0;
  width: 440px;
  .info {
    display: flex;
    flex-direction: column;
    margin: 0 20px 0 25px;
    .name-focus {
      display: flex;
      align-items: center;
    }
    .name {
      margin-right: 15px;
      font-size: 16px;
      display: flex;
      align-items: center;
      a {
        font-weight: bold;
        color: var(--color-regular);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 120px;
        display: inline-block;
      }
    }
    .intro {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 3; //显示的行
      font-size: 14px;
      line-height: 1.5;
      margin: 15px 0 20px;
      color: var(--color-text2);
      word-break: break-all;
    }
    .is-focus {
      .btn {
        padding: 7.5px 15px;
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
}
.btn {
  margin-left: 0;
  margin-right: 0;
}
.artwork-info {
  flex: 1;
  ul {
    display: grid;
    grid-template-columns: repeat(v-bind('props.maxShowArt'), 1fr);
    grid-gap: 20px;
    .pic {
      max-width: v-bind('props.picSize');
    }
  }
}
</style>
