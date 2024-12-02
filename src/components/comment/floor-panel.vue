<template>
  <div class="floor-panel top-mask-layer" @click.self="emits('close')">
    <div class="container">
      <div class="title">
        <span v-if="!comment.isDelete">共{{ comment.rootCount }}条回复</span>
        <span class="close" @click="emits('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </span>
      </div>
      <ElScrollbar v-if="!comment.isDelete">
        <div
          class="comment"
          v-lazy-loading="loadMoreComment"
          :lazy-loading-delay="300"
          :lazy-loading-immediate="false"
          :lazy-loading-distance="300"
        >
          <CommentFloor
            :comment="comment"
            :rootIndex="rootIndex"
            :floorType="'root'"
            :choiceStyle="childFloor == -1"
            @showReply="handleShowReply"
            @GetReplyData="getReplyData"
            @post-like="handleLike"
            @post-report="handleReport"
            @delete="handleDelete"
            :author="author"
          ></CommentFloor>
          <div class="child-floor">
            <template
              v-for="(child, childIndex) in comment.childComments"
              :key="child.cId"
            >
              <CommentFloor
                :author="author"
                :comment="child"
                :floor-type="'child'"
                :root-index="rootIndex"
                :child-index="childIndex"
                :rootId="comment.cId"
                :choiceStyle="childFloor == childIndex"
                @showReply="handleShowReply"
                @GetReplyData="getReplyData"
                @post-like="handleLike"
                @post-report="handleReport"
                @delete="handleDelete"
              ></CommentFloor>
            </template>
          </div>
          <span class="end" v-if="!isEnd">
            <svg
              class="waiting"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
              />
            </svg>
          </span>
          <span class="end" v-else>没有更多评论了</span>
          <ReplyItem
            @click.stop
            v-if="showReplyItem"
            class="child-reply"
            v-model="replyText"
            :avatar="mainStore.avatarUrl"
            :replyWho="replyWho"
            @reply="reply"
          ></ReplyItem>
        </div>
      </ElScrollbar>
      <div class="no-see" v-else>顶层评论已被删除，所有的相关评论不可见</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { commentType } from '@/stores/module/trend/type'
import CommentFloor from './comment-floor.vue'
import ReplyItem from '@/components/comment/reply-item.vue'
import useMainStore from '@/stores/module/main'
import { ReportPanel } from '@/components/report'
const mainStore = useMainStore()
defineProps({
  comment: {
    type: Object as PropType<commentType>,
    required: true
  },
  rootIndex: {
    type: Number,
    required: true
  },
  // 动态或作品的作者
  author: {
    type: String,
    required: true
  },
  isEnd: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits([
  'loadMore',
  'close',
  'reply',
  'postLike',
  'postReport',
  'delete'
])
const loadMoreComment = () => {
  emits('loadMore')
}

const replyWho = ref('')
const showReplyItem = ref(false)
const childFloor = ref(-2) //回复哪一个子回复
type IShowReply = { floor: number; childIndex: number; userName: string }
const handleShowReply = (data: IShowReply) => {
  showReplyItem.value = true
  replyWho.value = data.userName
  childFloor.value = data.childIndex
}

let replyCid = '0' //回复的评论cid
let replyUserId = '0' //回复的用户id 如果是根回复则 回复的是动态作者
let replyRootId = '0' // 回复属于哪个 根评论
let replyUserName = '' // 被回复的用户名字
// 获取用于发布评论的数据
const getReplyData = (
  cid: string,
  userId: string,
  userName: string,
  rootId = '0'
) => {
  replyCid = cid
  replyUserId = userId
  replyRootId = rootId
  replyUserName = userName
}

const replyText = ref('')
const reply = () => {
  emits('reply', {
    replyCid,
    replyUserId,
    replyRootId,
    replyUserName,
    text: replyText.value
  })
  //发送完后 清空字符串
  replyText.value = ''
}
// 评论点赞
const handleLike = (
  cId: string,
  authorId: string,
  isLike: boolean,
  rootId: string,
  content: string
) => {
  emits('postLike', cId, authorId, isLike, rootId, content)
}
//  举报
const handleReport = (cId: string, authorId: string) => {
  ReportPanel({ msgId: cId, msgType: 'cm', defendant: authorId })
}
const handleDelete = (cId: string) => {
  emits('delete', cId)
}
</script>

<style scoped lang="less">
.floor-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  width: 600px;
  min-height: 500px;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--surface-color4);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 2px 4px;
  .title {
    position: sticky;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-left: 20px;
    font-weight: 700;
    height: 50px;
    background-color: var(--surface-color4);
    .close {
      margin-right: 20px;
      cursor: pointer;
      svg {
        fill: var(--color-text2);
      }
    }
  }

  .comment {
    height: 470px;
    padding: 7px 25px 7px 10px;
    .child-floor {
      position: relative;
      margin-left: 55px;
      border-left: 2px solid var(--border-color1);
    }
  }
}
.child-reply {
  position: sticky;
  bottom: 0px;
  border-top: 1px solid var(--border-color1) !important;
  padding: 20px 5px 30px 12px !important;
  margin: 0;
  :deep(.reply-who) {
    bottom: 10px;
  }
  :deep(.textarea-wrap) {
    flex-grow: 1;
    textarea {
      flex-grow: 1;
    }
  }
}
.end {
  display: flex;
  justify-content: center;
  color: var(--color-text2);
  padding: 15px 10px 25px;
  font-size: 12px;
  svg {
    fill: var(--color-text2);
  }
}
.no-see {
  margin-top: 150px;
  text-align: center;
  font-size: 16px;
}

/*通过@keyframes规则,能够创建动画 , 定义动画的名称 可自己定义*/
@keyframes loading {
  /*以百分比来规定改变发生的时间 也可以通过"from"和"to",等价于0% 和 100%*/
  0% {
    /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.waiting {
  /*animation (动画) :绑定选择器, 4s完成动画 linear(匀速) infinite(循环) */
  animation: loading 600ms linear infinite;
}
</style>
