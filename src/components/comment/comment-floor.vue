<template>
  <div :class="{ floor: floorType == 'root' }">
    <AvatarItem
      v-if="floorType === 'root'"
      :userId="comment.userId"
      :imgUrl="comment.avatar"
      :width="35"
      :height="35"
      :open-new="true"
      :lazy-load="'close'"
    ></AvatarItem>
    <div
      class="comment-info"
      :class="{
        choice: choiceStyle,
        blink: comment.isNew,
        'child-info': floorType == 'child'
      }"
    >
      <div class="content" :class="{ 'root-content': floorType == 'root' }">
        <router-link
          :to="{ name: 'userHome', params: { userId: comment.userId } }"
          target="_blank"
        >
          <span class="username"
            >{{ comment.userName }}
            <VTag :v-status="comment.vStatus" :size="14"></VTag>
          </span>
          <span class="author" v-if="comment.userId == author">作者</span>
        </router-link>
        <span class="text">
          <span v-if="comment.replyUserId && comment.replyId !== '0'">
            <span> 回复 </span>
            <router-link
              :to="{
                name: 'userHome',
                params: { userId: comment.replyUserId }
              }"
              target="_blank"
            >
              <span class="username">{{ comment.replyUserName }}</span>
            </router-link>
          </span>
          <span v-if="floorType == 'child'"> : </span>
          <span> {{ comment.text }}</span>
        </span>
      </div>
      <div class="other-content">
        <div class="time">
          {{ $filters.formatAccuracyTime(comment.createAT, 0, true) }}
        </div>
        <div class="like-reply" v-if="!comment.isDelete">
          <span
            class="report"
            v-if="!isPoster"
            title="举报"
            @click.stop="handleReport"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M4 20v-6a8 8 0 1 1 16 0v6h1v2H3v-2h1zm2 0h12v-6a6 6 0 1 0-12 0v6zm5-18h2v3h-2V2zm8.778 2.808l1.414 1.414-2.12 2.121-1.415-1.414 2.121-2.121zM2.808 6.222l1.414-1.414 2.121 2.12L4.93 8.344 2.808 6.222zM7 14a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3H7z"
              />
            </svg>
          </span>
          <span
            title="删除"
            class="delete"
            v-if="isOwner"
            @click.stop="handleDelete"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 10V44H39V10H9Z" fill="none" stroke-linejoin="round" />
              <path
                d="M20 20V33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M28 20V33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 10H44"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 10L19.289 4H28.7771L32 10H16Z"
                fill="none"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span title="点赞" class="like" @click.stop="handleLike">
            <svg
              v-if="!comment.isLike"
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              viewBox="0 96 960 960"
              width="16"
            >
              <path
                d="M720 912H264V432l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906 589L786.93 868.199Q778 888 760 900t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48V432h216Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 96 960 960"
              width="15"
            >
              <path
                d="M720 912H264V432l288-288 32 22q18 13 26.5 33t3.5 41l-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906 589L787 868q-9 20-27 32t-40 12ZM192 432v480H48V432h144Z"
                fill="#eb7350"
              />
            </svg>
            <span class="count" v-if="comment.likes">
              {{ $filters.formatNum(comment.likes) }}</span
            >
          </span>
          <span
            title="回复"
            @click.stop="
              showReplyCpn(rootIndex, -1, comment.userName),
                getReplyData('0', comment.userId, comment.userName, comment.cId)
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M2 8.994A5.99 5.99 0 0 1 8 3h8c3.313 0 6 2.695 6 5.994V21H8c-3.313 0-6-2.695-6-5.994V8.994zM20 19V8.994A4.004 4.004 0 0 0 16 5H8a3.99 3.99 0 0 0-4 3.994v6.012A4.004 4.004 0 0 0 8 19h12zm-6-8h2v2h-2v-2zm-6 0h2v2H8v-2z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { ICommentType } from './type'
import { MessageBox } from '@/components/message-box'
import useMainStore from '@/stores/module/main'
import { AvatarItem, VTag } from '@/components/avatar'

const props = defineProps({
  // 评论展示数据
  comment: {
    type: Object as PropType<ICommentType>,
    required: true
  },
  //属于第几个跟回复
  rootIndex: {
    type: Number,
    required: true
  },
  //评论楼层类型 是 根回复 还是 子回复
  floorType: {
    type: String as PropType<'root' | 'child'>,
    required: true
  },
  //如果是 子回复 是第几个子回复, -1 表示不是子回复
  childIndex: {
    type: Number,
    default: -1
  },
  //如果是子回复 属于那个 根回复
  rootId: {
    type: String
  },
  // 被选择时的style
  choiceStyle: {
    type: Boolean,
    default: false
  },
  // 动态或作品的作者
  author: {
    type: String,
    required: true
  }
})
const emits = defineEmits([
  'showReply',
  'getReplyData',
  'postLike',
  'postReport',
  'delete'
])

const mainStore = useMainStore()
// 登陆用户是否是评论发布人
const isPoster = computed(() => mainStore.userId == props.comment.userId)
// 登陆用户是否是  否是评论发布人 or 作品/动态作者
const isOwner = computed(
  () => isPoster.value || mainStore.userId == props.author
)

const showReplyCpn = (floor: number, childIndex: number, userName: string) => {
  if (!mainStore.verifyIsLogin()) return
  if (props.floorType === 'child') childIndex = props.childIndex
  emits('showReply', { floor, childIndex, userName })
}

/**
 * cid 回复的评论cid
 * userId 回复的用户id
 * userName 回复的用户名
 * rootId 属于的根评论
 */
const getReplyData = (
  cid: string,
  userId: string,
  userName: string,
  rootId: string
) => {
  if (props.floorType === 'child') {
    // 如果是子回复 没有穿 rootId 报错
    if (!props.rootId) {
      console.warn('floorType is child need prop rootId value')
      return
    }
    cid = props.comment.cId
    rootId = props.rootId
  }
  emits('getReplyData', cid, userId, userName, rootId)
}

const handleLike = () => {
  if (!mainStore.verifyIsLogin()) return
  const { cId, userId, isLike } = props.comment
  emits('postLike', cId, userId, isLike)
}

const handleReport = () => {
  if (!mainStore.verifyIsLogin()) return
  const { cId, userId } = props.comment
  emits('postReport', cId, userId)
}

const handleDelete = () => {
  MessageBox({
    title: '删除评论',
    text: `${props.comment.text}`
  }).then(() => {
    emits('delete', props.comment.cId)
  })
}
</script>

<style scoped lang="less">
.floor {
  display: flex;
  padding: 5px 0px 5px 7px;
  margin-top: 8px;
}

.comment-info {
  flex: 1;
  line-height: 20px;
  font-size: 13px;
  padding: 2px 0px 2px 5px;
  border-radius: 8px;
  margin-left: 5px;
  text-align: justify;
  white-space: pre-wrap;
  color: var(--color-regular);
  font-weight: 400;
  .root-content {
    display: flex;
    flex-direction: column;
  }
  .content {
    .author {
      margin-left: 4px;
      padding: 2px 6px;
      font-size: 12px;
      background: var(--surface-color3);
      border-radius: 10px;
      font-weight: 400;
    }
    .text {
      font-size: 14px;
      line-height: 24px;
      margin-top: 5px;
    }
  }
  .username {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    color: #eb7350;
  }
  .other-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 7px;
    .time {
      font-size: 12px;
      color: #939393;
    }
    .like-reply {
      display: flex;
      span {
        display: flex;
        align-items: center;
        fill: #a7a7a7;
        cursor: pointer;
        font-size: 12px;
        transition: opacity 0.3s ease;
        svg {
          margin-left: 20px;
        }
      }
      svg:hover {
        fill: #eb7350;
        color: #eb7350;
        transform: scale(1.15);
      }
      .like {
        color: #9d9d9d;
        .count {
          margin-left: 5px;
        }
      }
      .report {
        opacity: 0;
      }
      .delete {
        opacity: 0;
        stroke: #9d9d9d;
        stroke-width: 4;
        &:hover {
          stroke: #eb7350;
        }
      }
    }
  }
  &:hover {
    .like-reply {
      .report {
        opacity: 1;
      }
      .delete {
        opacity: 1;
      }
    }
  }
}

.child-info {
  padding-top: 7px;
}
.choice {
  background-color: #008eff2b;
}

@keyframes blink {
  0% {
    background-color: #008eff2b;
  }

  100% {
    background-color: transparent;
  }
}

.blink {
  animation-name: blink;
  animation-duration: 3000ms;
  animation-iteration-count: 1;
  animation-timing-function: ease;
}
</style>
