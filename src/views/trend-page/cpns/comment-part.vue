<template>
  <div
    class="comment-wrap"
    v-lazy-loading="loadMoreComment"
    :lazy-loading-delay="300"
    :lazy-loading-immediate="false"
    :lazy-loading-distance="200"
  >
    <ReplyItem
      :avatar="avatar"
      v-model="rootReplyText"
      @reply="getReplyData('0', '0', '', '0'), reply('root')"
    ></ReplyItem>
    <div class="title">推荐评论</div>
    <div class="container">
      <div class="tip" v-if="closeCom">
        <span class="text">由于作者设置, 评论暂时关闭</span>
      </div>
      <template v-else>
        <template v-for="(root, rootIndex) in comments" :key="root.cId">
          <CommentFloor
            :author="authorId"
            :comment="root"
            :root-index="rootIndex"
            :floor-type="'root'"
            :choice-style="childFloor === -1 && isShowReplyCpn === rootIndex"
            @ShowReply="showReplyCpn"
            @GetReplyData="getReplyData"
            @post-like="handleLike"
            @post-report="handleReport"
            @delete="handleDelete"
          ></CommentFloor>
          <div class="child-floor">
            <template
              v-for="(child, childIndex) in root.childComments"
              :key="child.cId"
            >
              <CommentFloor
                :comment="child"
                :floor-type="'child'"
                :root-index="rootIndex"
                :child-index="childIndex"
                :rootId="root.cId"
                @ShowReply="showReplyCpn"
                @GetReplyData="getReplyData"
                @post-like="handleLike"
                @post-report="handleReport"
                @delete="handleDelete"
                :author="authorId"
                :choice-style="
                  childFloor === childIndex && isShowReplyCpn === rootIndex
                "
              ></CommentFloor>
            </template>
            <div
              class="reply-count"
              v-if="root.rootCount > 2"
              @click="handleShowChildComment(root, rootIndex)"
            >
              共 {{ root.rootCount }} 条回复
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 16l-6-6h12z" fill="rgba(235,115,80,1)" />
                </svg>
              </span>
            </div>
          </div>
          <ReplyItem
            class="child-reply"
            :reply-who="replyWho"
            :avatar="avatar"
            v-model="childReplyText"
            @reply="reply('child')"
            v-if="isShowReplyCpn === rootIndex"
          ></ReplyItem>
        </template>
        <span class="end" v-if="!commentEnd">
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
        <span class="end" v-else-if="!zeroComment"> 没有更多评论了 </span>
        <template v-else>
          <div
            class="tip"
            v-if="detailStore.trendDetail!.comment == 'public' || onlyFansCom"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                fill="none"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path
                d="M16.6045 19.8201H33.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.8467 15.7378L18.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M28.8467 15.7378L25.933 32.2622"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6045 28H31.3838"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text">快来发表你的评论吧</span>
          </div>
          <div class="tip" v-else>
            <span class="text">由于作者设置, 只允许粉丝评论</span>
          </div>
        </template>
      </template>
    </div>
  </div>
  <FloorPanel
    v-if="isShowChildComment && detailStore.commentDetail"
    :comment="detailStore.commentDetail"
    :rootIndex="rootIndex"
    :isEnd="detailStore.childCommentEnd"
    @loadMore="handleShowMoreChildComment"
    @reply="handleFloorPanelReply"
    @delete="handleDelete"
    @close="handleShowChildComment(null, -1)"
    @post-like="handleLike"
    :author="authorId"
  ></FloorPanel>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import type { commentType } from '@/stores/module/trend/type'
import useDetailStore from '@/stores/module/trend/detail'
import useMainStore from '@/stores/module/main'
import { CommentFloor, ReplyItem, FloorPanel } from '@/components/comment'
import type { IFloorPanelReply, IShowReply } from '@/components/comment'
import { ReportPanel } from '@/components/report'
import { stopBodyScroll } from '@/utils/stopScroll'
import { deepClone } from '@/utils/deep-clone'

const props = defineProps({
  cType: {
    type: String as PropType<'aw' | 'tr'>,
    required: true
  }
})

const detailStore = useDetailStore()
const mainStore = useMainStore()
//评论信息
const comments = computed(() => detailStore.comments)
//当前登录用户的头像
const avatar = computed(() => mainStore.avatarUrl)
//加载更多根评论
const loadMoreComment = () => detailStore.getRootCommentNextAction()
// 没有更多评论了
const commentEnd = computed(() => detailStore.commentEnd)
// 0个评论
const zeroComment = computed(() => detailStore.zeroComment)
//关闭评论
const closeCom = computed(() => detailStore.trendDetail!.comment === 'close')
// 动态作者
const authorId = computed(() => detailStore.trendDetail!.userId)
// 是否关注作者
const isFocus = computed(
  () =>
    detailStore.trendDetail!.interact.isFocusAuthor ||
    authorId.value === mainStore.userId
)
//只允许粉丝评论
const onlyFansCom = computed(
  () => detailStore.trendDetail!.comment == 'onlyFans' && isFocus.value
)

const rootReplyText = ref('')
const childReplyText = ref('')
const replyWho = ref('') //回复哪个用户

//是否展示回复组件
const isShowReplyCpn = ref(-1)
const childFloor = ref(-1) //回复哪一个子回复
// 显示楼层回复组件
const showReplyCpn = (data: IShowReply) => {
  // 对应赋值显示相关数据
  childFloor.value = data.childIndex
  isShowReplyCpn.value = data.floor
  replyWho.value = data.userName
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

// 发送回复网络请求
const reply = async (replyType: 'child' | 'root') => {
  const text = replyType === 'root' ? rootReplyText.value : childReplyText.value
  const data = {
    ownId: detailStore.trendDetail!.trendId,
    replyId: replyCid,
    replyUserId: replyType === 'root' ? authorId.value : replyUserId,
    rootId: replyRootId,
    replyUserName,
    text: text,
    type: props.cType,
    senderName: mainStore.userName,
    senderAvatar: mainStore.avatar
  }
  await detailStore.postCommentAction(data)
  //发送完后 清空字符串
  rootReplyText.value = ''
  childReplyText.value = ''
}

// 是否展示 子回复组件
const isShowChildComment = ref(false)
const rootIndex = ref(-1)
const handleShowChildComment = (comment: commentType | null, index: number) => {
  rootIndex.value = index
  isShowChildComment.value = !isShowChildComment.value
  stopBodyScroll(isShowChildComment.value, false)
  // 组件关闭时 重置 数据
  if (!comment) {
    detailStore.commentDetail = null
    detailStore.childCommentEnd = false
    return
  }
  detailStore.commentDetail = deepClone(comment)
  detailStore.commentDetail!.childComments = []
  detailStore.getChildCommentAction()
}
// 加载更多子回复
const handleShowMoreChildComment = () => {
  detailStore.getChildCommentAction()
}
//处理子回复面板回复
const handleFloorPanelReply = (payload: IFloorPanelReply) => {
  const { replyCid, replyUserId, replyRootId, replyUserName, text } = payload
  const data = {
    ownId: detailStore.trendDetail!.trendId,
    replyId: replyCid,
    replyUserId: replyUserId,
    rootId: replyRootId,
    replyUserName,
    senderName: mainStore.userName,
    senderAvatar: mainStore.avatar,
    text: text,
    type: props.cType
  }
  detailStore.postCommentAction(data)
}
// 评论点赞
const handleLike = (cId: string, authorId: string, isLike: boolean) => {
  const postData = { cId, authorId, isCancel: isLike }
  detailStore.postLikeCommentAction(postData)
}
const handleReport = (cId: string, userId: string) => {
  ReportPanel({ msgId: cId, msgType: 'cm', defendant: userId })
}
const handleDelete = (cId: string) => {
  detailStore.delCommentAction(cId)
}
</script>

<style scoped lang="less">
.comment-wrap {
  padding: 0 20px;
  .container {
    display: flex;
    flex-direction: column;
    min-height: 150px;
  }
  .end {
    display: flex;
    justify-content: center;
    color: var(--color-text2);
    margin: 15px 0 25px;
    font-size: 12px;
    svg {
      fill: var(--color-text2);
    }
  }
  .tip {
    // 撑满高度
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .text {
      margin-top: 10px;
      color: var(--color-text3);
      font-size: 15px;
    }
    svg {
      stroke: var(--surface-color3-hover);
    }
  }
}
.title {
  font-weight: 700;
  padding-bottom: 10px;
}
.child-floor {
  position: relative;
  margin-left: 55px;
  border-left: 2px solid var(--border-color1);
  .reply-count {
    font-size: 12px;
    color: #eb7350;
    margin: 6px 0 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      height: 16px;
    }
  }
}

:deep(.reply) {
  border-top: 1px solid var(--transparent-little-hover);
  border-bottom: 1px solid var(--transparent-little-hover);
  background-color: var(--surface-color4);
  padding-bottom: 25px;
  padding-top: 20px;
  margin-bottom: 15px;
  .textarea-wrap {
    flex: 1;
  }
  textarea {
    width: 100%;
  }
}

.child-reply {
  padding-top: 10px;
  border-top: none;
  :deep(.reply-who) {
    bottom: 5px;
  }
}

.scroller-item {
  display: flex;
  flex-direction: column;
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
