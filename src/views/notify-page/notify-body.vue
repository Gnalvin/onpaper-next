<template>
  <div class="notify-body">
    <div class="main-body">
      <div class="message" @click.self="handleMsgClick">
        <div class="left">
          <AvatarItem
            open-new
            :width="50"
            :height="50"
            :user-id="notify.sender.userId"
            :img-url="notify.sender.avatar"
          ></AvatarItem>
          <div class="icon">
            <svg
              v-if="action == 'like'"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                fill="rgb(251, 52, 85)"
                stroke="rgb(251, 52, 85)"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="bevel"
              />
            </svg>
            <svg
              v-if="action == 'collect'"
              width="22"
              height="22"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
                fill="#ff9c33"
                stroke="#ff9c33"
                stroke-width="4"
                stroke-linejoin="bevel"
              />
            </svg>
          </div>
        </div>
        <div class="right">
          <div class="up">
            <RouterLink
              :to="{
                name: 'userHome',
                params: { userId: notify.sender.userId }
              }"
              target="_blank"
            >
              <div class="name">
                {{ notify.sender.userName }}
              </div>
            </RouterLink>
          </div>
          <div class="down">
            <div class="action">{{ actionDesc }}{{ tType }}</div>
            <div class="time">
              {{ $filters.formatUtcToShowTime(notify.updateAt) }}
            </div>
          </div>
        </div>
      </div>
      <div class="handle">
        <div class="focus" v-if="action == 'focus'">
          <ELButton
            @click="handleFocus"
            class="focus-btn"
            :class="{ focused: content.isFocus }"
            >{{ content.isFocus == 0 ? '回粉' : '相互关注' }}</ELButton
          >
        </div>
        <div class="img" v-else>
          <img
            v-if="content.cover"
            v-lazy-img="content.cover"
            alt=""
            @click="handleCoverClick"
          />
        </div>
      </div>
    </div>
    <div class="other-info" v-if="content" @click="handleMsgClick">
      <div class="trend-text" v-if="content.text">
        <div class="my-text">
          {{ content.text }}
        </div>
      </div>
      <div class="like-comment" v-if="content.beLikeContent">
        <div class="my-text">
          {{ content.beLikeContent }}
        </div>
      </div>
      <div class="comment" v-if="action == 'comment'" ref="commentEl">
        <div class="sender-text">
          {{ content.sendContent }}
        </div>
        <div class="my-text" v-if="content.beReplyContent">
          {{ content.beReplyContent }}
        </div>
        <div class="reply-like" v-if="!content.sendIsDel">
          <div class="reply" @click.stop="handleShowReply">回复评论</div>
          <div
            class="like"
            :class="{ liked: content.isLike }"
            @click.stop="handleQuickLike"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="bevel"
              />
            </svg>
          </div>
        </div>
        <ReplyItem
          @click.stop
          v-model="replyText"
          :emoji-position="'left'"
          v-if="isShowReplyItem"
          class="reply-item"
          :placeholder="`回复：${notify.sender.userName}`"
          @reply="handleQuickReply"
        ></ReplyItem>
      </div>
    </div>
  </div>
  <FloorPanel
    v-if="isShowCommentPanel && notifyStore.commentDetail"
    :comment="notifyStore.commentDetail"
    :rootIndex="1"
    :isEnd="notifyStore.childCommentEnd"
    @loadMore="handleShowMoreChildComment"
    @reply="handlePanelReply"
    @close="handleCloseComment"
    @post-like="handleLike"
    :author="''"
  ></FloorPanel>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import ReplyItem from '@/components/comment/reply-item.vue'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import ELButton from '@/components/button/el-button.vue'
import { FloorPanel } from '@/components/comment'
import useMainStore from '@/stores/module/main'
import { clickOtherClose } from '@/hooks/click-close'
import type { INotifyBody } from '@/service/notify-page/type'
import type {
  ICommentNotify,
  ILikeCommentNotify
} from '@/service/notify-page/type'
import type { IFloorPanelReply } from '@/components/comment'
import useNotifyStore from '@/stores/module/notify-page'
import { notification } from '@/components/notification'
import { MessageBox, TipBox } from '@/components/message-box'
import { debounce } from '@/utils/debounce'

const notifyStore = useNotifyStore()
const mainStore = useMainStore()
const router = useRouter()
const props = defineProps({
  notify: {
    type: Object as PropType<INotifyBody>,
    required: true
  },
  content: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits(['postComment', 'comment'])

const action = computed(() => props.notify.action)
const targetType = computed(() => props.notify.targetType)
const targetId = computed(() => props.notify.targetId)

const actionDesc = computed(() => {
  if (action.value == 'like') return '赞了你的'
  if (action.value == 'collect') return '收藏了你的'
  if (action.value == 'focus') return '开始关注你'
  if (action.value == 'comment') {
    if (tType.value == '评论') {
      return '回复了你的'
    } else {
      return '评论了你的'
    }
  }
  if (action.value == 'update') {
    if (props.content.status === 0) return '向你发起约稿'
    if (props.content.status === 1) return '希望与你联系'
    if (props.content.status === 2) return '开始进行创作'
    if (props.content.status === 3) return '完成你的企划'
    if (props.content.status === -1) return '关闭了企划'
    if (props.content.status === -2) return '终止了企划'
  }
  return ''
})
const tType = computed(() => {
  if (targetType.value == 'aw') return '作品'
  if (targetType.value == 'tr') return '动态'
  if (targetType.value == 'cm') return '评论'
  return ''
})

// 点击封面跳转到内容主页
const handleCoverClick = () => {
  if (action.value == 'comment' || props.notify.targetType == 'cm') {
    const content = props.notify.content as ICommentNotify
    let pathName, params, query
    if (content.ownType == 'aw') {
      pathName = 'ArtworkDetail'
      params = { artId: content.ownId }
    } else {
      pathName = 'trendDetail'
      params = { user: mainStore.userName, trendId: content.ownId }
      query = { type: 'tr' }
    }
    const url = router.resolve({ name: pathName, params, query })
    window.open(url.href, '_blank')
    return
  }
  handleMsgClick()
}

const handleMsgClick = () => {
  // 喜欢或者收藏
  if (
    (action.value == 'like' && props.notify.targetType != 'cm') ||
    action.value == 'collect'
  ) {
    let pathName, params, query
    if (targetType.value == 'aw') {
      pathName = 'ArtworkShow'
      params = { artId: targetId.value }
    } else {
      pathName = 'trendDetail'
      params = { user: mainStore.userName, trendId: targetId.value }
      query = { type: 'tr' }
    }
    const url = router.resolve({ name: pathName, params, query })
    window.open(url.href, '_blank')
    return
  }
  // 新增关注
  if (action.value == 'focus') {
    const url = router.resolve({
      name: 'userHome',
      params: { userId: props.notify.sender.userId }
    })
    window.open(url.href, '_blank')
    return
  }
  // 查看评论
  if (action.value == 'comment') {
    const content = props.notify.content as ICommentNotify
    if (content.sendIsDel) {
      TipBox({ text: '评论已删除', msgType: 'error' })
      return
    }
    // 如果target 是cm target 就是 根回复的id
    const rootId = targetType.value == 'cm' ? targetId.value : content.sendCId
    handleShowComment(rootId, content.ownType)
    return
  }
  // 点赞评论通知
  if (action.value == 'like' && props.notify.targetType == 'cm') {
    const content = props.notify.content as ILikeCommentNotify
    if (content.commentIsDel) {
      TipBox({ text: '评论已删除', msgType: 'error' })
      return
    }
    const rootId = content.rootId == '0' ? content.beLikeCId : content.rootId
    handleShowComment(rootId, content.ownType)
    return
  }
  // 约稿消息
  if (props.notify.targetType == 'com') {
    // 登陆用户是否是画师
    const isArtist = mainStore.userId !== props.content.owner
    const url = router.resolve({
      name: isArtist ? 'CommissionHomeAccept' : 'CommissionHomeInvite',
      params: { userId: mainStore.userId }
    })
    window.open(url.href, '_blank')
    return
  }
}
const replyText = ref('')
const isShowReplyItem = ref(false)
const handleShowReply = () => {
  isShowReplyItem.value = !isShowReplyItem.value
}

//快速回复
const handleQuickReply = async () => {
  const content = props.notify.content as ICommentNotify
  // 如果target 是cm target 就是 根回复的id
  const rootId = targetType.value == 'cm' ? targetId.value : content.sendCId
  const replyId = targetType.value == 'cm' ? content.sendCId : '0'
  // 发送回复网络请求
  const data = {
    ownId: content.ownId, // 作品或动态的id
    replyId: replyId, // 回复的是哪个评论
    replyUserId: props.notify.sender.userId, // 回复的是哪个用户
    rootId: rootId, // 回复的评论属于哪个根回复
    replyUserName: props.notify.sender.userName, // 回复用户的名字
    text: replyText.value, //回复的内容
    type: content.ownType, // 属于aw 还是tr 回复
    senderName: mainStore.userName, // 发送人
    senderAvatar: mainStore.avatar //发送人头像
  }
  emits('postComment', data)
  replyText.value = ''
  isShowReplyItem.value = false
}

//查看评论详情
const isShowCommentPanel = ref(false)
const handleShowComment = async (rid: string, type: 'aw' | 'tr') => {
  const res = await notifyStore.getCommentDetail(rid, type)
  if (res.status === 1017) {
    notification({
      type: 'error',
      title: '查看评论',
      message: '评论不存在'
    })
  }
  if (res.status === 200) {
    isShowCommentPanel.value = true
    notifyStore.getChildCommentAction(type)
  }
}
//加载更多子回复
const handleShowMoreChildComment = () => {
  const content = props.notify.content as ICommentNotify
  notifyStore.getChildCommentAction(content.ownType)
}
// 关闭评论面板
const handleCloseComment = () => {
  isShowCommentPanel.value = false
  notifyStore.childCommentEnd = false
  notifyStore.commentDetail = null
}
const handlePanelReply = (payload: IFloorPanelReply) => {
  const { replyCid, replyUserId, replyRootId, replyUserName, text } = payload
  const data = {
    ownId: props.content.ownId,
    replyId: replyCid,
    replyUserId: replyUserId,
    rootId: replyRootId,
    replyUserName,
    senderName: mainStore.userName,
    senderAvatar: mainStore.avatar,
    text: text,
    type: props.content.ownType
  }
  emits('postComment', data)
}

// 点击其他地方关闭快速回复输入框
const commentEl = ref<HTMLDivElement>()
clickOtherClose(commentEl, () => {
  isShowReplyItem.value = false
})
// 评论点赞
const handleLike = (cId: string, authorId: string, isLike: boolean) => {
  const postData = { cId, authorId, isCancel: isLike }
  notifyStore.postLikeCommentAction(postData)
}
// 直接点红心点赞
const handleQuickLike = () => {
  const content = props.notify.content as ICommentNotify
  handleLike(content.sendCId, props.notify.sender.userId, content.isLike)
}

// 发送关注
const handleFocus = debounce(() => {
  const isFocus = props.content.isFocus
  const userId = props.notify.sender.userId
  const userName = props.notify.sender.userName
  //取消关注时 弹出提示
  if (isFocus) {
    MessageBox({
      text: `是否取消关注 @${userName} ?`
    }).then(() => {
      notifyStore.postUserFocusAction(isFocus, userId)
    })
    return
  }
  notifyStore.postUserFocusAction(isFocus, userId)
}, 120)
</script>

<style scoped lang="less">
.notify-body {
  padding: 15px 30px;
  position: relative;
  cursor: pointer;
  &::after {
    background-color: var(--border-color3);
    bottom: 0;
    content: '';
    height: 1px;
    left: 20px;
    position: absolute;
    right: 25px;
  }
  .main-body {
    display: flex;
    position: relative;
    .message {
      display: flex;
      flex-grow: 1;
    }
  }
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.6;
  .up {
    display: flex;
    .name {
      color: var(--color-text1);
    }
  }
  .down {
    display: flex;
    color: var(--color-text3);
    font-size: 13px;
    .action {
      width: 105px;
    }
  }
}
.left {
  display: flex;
  align-items: center;
  margin-right: 13px;
  position: relative;
  .icon {
    position: absolute;
    right: -7px;
    bottom: 2px;
  }
}
.handle {
  .img {
    background-color: var(--surface-color2);
    width: 60px;
    height: 60px;
    border-radius: 5px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .focus {
    display: flex;
    justify-content: center;
    width: 126px;
  }
}
.other-info {
  margin: 0 65px;
  .my-text {
    padding: 5px 10px;
    color: var(--color-text3);
    font-size: 13px;
    border-left: 2px solid var(--border-color1);
  }
  .comment {
    .sender-text {
      color: var(--color-text2);
    }
    .my-text {
      margin-top: 10px;
    }
    .reply-like {
      font-size: 12px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      .reply {
        cursor: pointer;
        display: inline-block;
        padding: 3px 8px;
        background-color: var(--surface-color3);
        border-radius: 8px;
        margin-right: 20px;
      }
      .like {
        cursor: pointer;
        display: flex;
        svg {
          path {
            fill: none;
            stroke: #727272;
          }
        }
      }
      .liked {
        svg {
          path {
            fill: #e35856;
            stroke: #e35856;
          }
        }
      }
    }
    .reply-item {
      padding: 15px 20px 0px;
      :deep(.textarea-wrap) {
        flex: 1;
        textarea {
          flex: 1;
        }
      }
    }
  }
}
.focus-btn {
  padding: 8px 28px;
  background-color: var(--bgc4);
  border: 1px solid #f1403c;
  color: #f1403c;
  &:hover {
    background-color: var(--bgc4);
  }
}
.focused {
  padding: 8px 18px;
  color: var(--color-regular);
  background-color: var(--btn-cancel-color);
  border: 1px solid transparent;
  color: var(--color-regular);
}
.focused:hover {
  background-color: var(--btn-cancel-hover-color);
}
</style>
