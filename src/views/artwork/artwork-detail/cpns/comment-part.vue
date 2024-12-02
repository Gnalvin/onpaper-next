<template>
  <div class="comment" @click.stop="cancelShowReply">
    <div class="title" v-if="isShowRoot">
      热门评论
      <span
        class="top"
        @click="$emit('scrollTop', true)"
        v-if="comments.length"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"
            fill="rgba(255,255,255,1)"
          />
        </svg>
      </span>
    </div>
    <div class="title child-title" v-else>
      <span class="back" @click="comeBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"
            fill="rgba(255,255,255,1)"
          />
        </svg>
      </span>
      共 {{ countALlReply }} 条评论
      <span class="top" @click="$emit('scrollTop', true)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"
            fill="rgba(255,255,255,1)"
          />
        </svg>
      </span>
    </div>
    <div
      class="comment-wrap"
      v-lazy-loading="loadMoreComment"
      :lazy-loading-delay="300"
      :lazy-loading-distance="100"
      :lazy-loading-immediate="false"
      :lazy-loading-disabled="isCloseLoadRootComment"
    >
      <div :class="{ tempHeight: !isShowRoot }" v-if="comSetting != 'close'">
        <template v-for="(root, rootIndex) in comments" :key="root.cId">
          <div
            style="flex: 1"
            v-if="isShowRoot || choiceRootIndex == rootIndex"
          >
            <CommentFloor
              :comment="root"
              :root-index="rootIndex"
              :floor-type="'root'"
              :choice-style="childFloor === -1 && isShowReplyCpn === rootIndex"
              @ShowReply="showReplyCpn"
              @GetReplyData="getReplyData"
              @post-like="handleLike"
              @post-report="handleReport"
              @delete="handleDelete"
              :author="artworkStore.artInfo.userId"
            ></CommentFloor>
            <div
              class="child-floor"
              v-if="root.childComments && (isShowRoot || root.cId === tempCid)"
              v-lazy-loading="loadMoreChildComment"
              :lazy-loading-delay="300"
              :lazy-loading-immediate="false"
              :lazy-loading-disabled="isCloseLoadChildComment"
            >
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
                  :author="artworkStore.artInfo.userId"
                  :choice-style="
                    childFloor === childIndex && isShowReplyCpn === rootIndex
                  "
                ></CommentFloor>
              </template>
              <div
                class="reply-count"
                v-if="root.rootCount > 2 && isShowRoot"
                @click="
                  ShowAllChildComment(rootIndex, root.cId, root.rootCount)
                "
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
          </div>
          <ReplyItem
            @click.stop
            :reply-who="replyWho"
            :avatar="avatar"
            v-model="replyText"
            @reply="reply('child')"
            :class="{ 'child-reply': !isShowRoot }"
            v-if="isShowReplyCpn === rootIndex"
          ></ReplyItem>
        </template>
        <span class="end" v-show="!(commentEnd || childCommentEnd)">
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
        <span
          class="end"
          v-show="
            (childCommentEnd || commentEnd) &&
            !zeroComment &&
            isShowReplyCpn == -1
          "
          >没有更多评论了
        </span>
      </div>
      <div class="tip" v-if="closeCom">
        <span class="text">由于作者设置, 评论暂时关闭</span>
      </div>
      <template v-else-if="zeroComment">
        <div class="tip" v-if="comSetting == 'public' || onlyFansCom">
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

      <br />
      <ElButton
        v-if="comSetting != 'close'"
        class="reply-art-btn"
        v-show="!isShowRootReply && !zeroComment && isShowRoot"
        @click.stop="showRootReply(), getReplyData('0', '0', '', '0')"
      >
        评论作品
      </ElButton>
    </div>
    <ReplyItem
      @click.stop
      :avatar="avatar"
      v-model="replyText"
      @reply="reply('root')"
      class="root-reply"
      v-if="
        !closeCom &&
        isShowRoot &&
        (isShowRootReply ||
          (zeroComment && (onlyFansCom || comSetting == 'public')))
      "
    ></ReplyItem>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CommentFloor, ReplyItem, type IShowReply } from '@/components/comment'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import useMainStore from '@/stores/module/main'
import { ReportPanel } from '@/components/report'
import { reSetComment } from '@/stores/module/artwork-detail/handle'
import ElButton from '@/components/button/el-button.vue'
import { notification } from '@/components/notification'

const emits = defineEmits(['scrollTop', 'scrollBefore'])

const mainStore = useMainStore()
const artworkStore = useArtworkDetailStore()
//评论信息
const comments = computed(() => artworkStore.comments)
//是否加载到根评论最后的评论
const commentEnd = computed(() => artworkStore.commentEnd)
const childCommentEnd = computed(() => artworkStore.childCommentEnd)
//是否初始就是 0 评论
const zeroComment = computed(() => artworkStore.zeroComment)
//当前登录用户的头像
const avatar = computed(() => mainStore.avatarUrl)
//评论权限
const comSetting = computed(() => artworkStore.artInfo.comSetting)
//是否关注作者
const isFocus = computed(() => artworkStore.artInfo.interact.isFocusAuthor)
//只允许粉丝评论
const onlyFansCom = computed(
  () => comSetting.value == 'onlyFans' && isFocus.value
)
//关闭评论
const closeCom = computed(() => comSetting.value === 'close')

//评论的文本
const replyText = ref('')

//监听评论长度
watch(replyText, (text) => {
  //如果超过140字 限定字数
  if (text.length > 140) {
    // 截取 还未超过的部分
    replyText.value = text.substring(0, 140)
  }
})

//是否展示回复组件
const isShowReplyCpn = ref(-1)
const replyWho = ref('') //回复哪个用户
const childFloor = ref() //回复哪一个子回复
const showReplyCpn = (data: IShowReply) => {
  if (!isFocus.value && comSetting.value == 'onlyFans') {
    notification({
      type: 'error',
      title: '发表评论',
      message: '由于作者设置, 只允许粉丝评论'
    })
    return
  }

  // 对应赋值显示相关数据
  childFloor.value = data.childIndex
  isShowReplyCpn.value = data.floor
  replyWho.value = data.userName

  // 不显示评论作品框
  isShowRootReply.value = false
}
//是否显示评论作品框
const isShowRootReply = ref(false)
const showRootReply = () => {
  if (!isFocus.value && comSetting.value == 'onlyFans') {
    notification({
      type: 'error',
      title: '发表评论',
      message: '由于作者设置, 只允许粉丝评论'
    })
    return
  }
  isShowRootReply.value = true
  //不显示评论回复框
  isShowReplyCpn.value = -1
}

//加载更多根评论
const loadMoreComment = () => {
  artworkStore.getRootCommentNextAction()
}

//当前根回复一共有几个子回复
const countALlReply = ref()

//展示所有的子回复
const isShowRoot = ref(true) //是否显示根评论
const choiceRootIndex = ref(-1)
// 展示所有子评论回复时 是否关闭根评论的动态加载更多  false 为不关闭
const isCloseLoadRootComment = ref(false)
const isCloseLoadChildComment = ref(true)
const tempCid = ref() //保存临时的选择评论id 用于评论恢复
const ShowAllChildComment = async (
  rootIndex: number,
  rid: string,
  count: number
) => {
  emits('scrollTop', false, true)
  isShowReplyCpn.value = -1 //不显示回复组件
  childFloor.value = -2 //重置选中的子回复
  tempCid.value = rid //赋值保存这次选中的根回复ID
  countALlReply.value = count //赋值展示这次有多少个根回复
  isCloseLoadRootComment.value = true //关闭根回复的懒加载
  isShowRoot.value = false //是否展示所有根回复
  choiceRootIndex.value = rootIndex //当前选中的根回复是第几个跟回复
  await artworkStore.getChildCommentAction(rid)
  isCloseLoadChildComment.value = false
}
//加载更多子评论
const loadMoreChildComment = () => {
  artworkStore.getChildCommentNextAction(tempCid.value)
}
//返回显示所有根评论
const comeBack = () => {
  //重置数据
  isShowReplyCpn.value = -1
  isShowRoot.value = true
  childFloor.value = -2
  choiceRootIndex.value = -1
  isCloseLoadRootComment.value = false
  isCloseLoadChildComment.value = true
  reSetComment(tempCid.value)
  emits('scrollBefore')
}

let replyCid = '0' //回复的评论cid
let replyUserId = '0' //回复的用户id 如果是根回复则 回复的是动态作者
let replyRootId = '0' // 回复属于哪个 根评论
let replyUserName = ''
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
const reply = async (type: string) => {
  const authorId = artworkStore.artInfo.userId
  const data = {
    ownId: artworkStore.artInfo.artworkId,
    replyId: replyCid,
    replyUserId: replyRootId === '0' ? authorId : replyUserId,
    rootId: replyRootId,
    replyUserName,
    senderName: mainStore.userName,
    senderAvatar: mainStore.avatar,
    text: replyText.value,
    type: 'aw' as 'aw'
  }
  await artworkStore.postArtworkCommentAction(data)
  //发送完后 清空字符串
  replyText.value = ''
  isShowReplyCpn.value = -1
  if (type !== 'child') {
    emits('scrollTop')
  }
}

const cancelShowReply = () => {
  isShowReplyCpn.value = -1
  isShowRootReply.value = false
}

// 评论点赞
const handleLike = (cId: string, authorId: string, isLike: boolean) => {
  const postData = { cId, authorId, isCancel: isLike }
  artworkStore.postLikeCommentAction(postData)
}

const handleReport = (cId: string, userId: string) => {
  ReportPanel({ msgId: cId, msgType: 'cm', defendant: userId })
}

const handleDelete = (cid: string) => {
  artworkStore.delCommentAction(cid)
}
</script>

<style scoped lang="less">
.comment {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  .end {
    display: flex;
    justify-content: center;
    color: var(--color-text2);
    padding: 15px 0 35px;
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
  .reply-art-btn {
    margin: 0 auto;
    border-radius: 14px;
    padding: 8px 11px;
    position: sticky;
    bottom: 30px;
    width: 80px;
  }
}

.title {
  display: flex;
  position: sticky;
  justify-content: space-between;
  top: -20px;
  z-index: 1;
  padding: 17px 0 10px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  background-color: var(--bgc);
  border-bottom: 1px solid var(--border-color1);
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #5c68a3;
    cursor: pointer;
  }
}
.child-title {
  font-weight: 500;
}

.comment-wrap {
  margin-top: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .tempHeight {
    display: flex;
    flex-direction: column;
    min-height: 85vh;
  }
}

.avatar {
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.05);
    background-color: #fff;
    object-fit: cover;
  }
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

.child-reply {
  position: sticky;
  bottom: 0px;
  border-top: 1px solid var(--border-color1);
  padding: 20px 5px 35px 26px;
}
.root-reply {
  z-index: 9;
  position: sticky;
  bottom: 0;
  padding: 15px 5px 25px;
  justify-content: center;
  background-color: var(--bgc);
  border-top: 1px solid var(--border-color1);

  :deep(.avatar) {
    display: none;
  }
}

/*通过@keyframes规则,能够创建动画 , que 定义动画的名称 可自己定义*/
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
  animation: loading 800ms linear infinite;
}
@media (max-width: 1200px) {
  .comment {
    padding: 0 50px;
    min-height: 400px;
    .title {
      top: 50px;
      padding: 17px 0;
    }
    :deep(.reply) {
      textarea {
        width: 275px;
      }
    }
    .root-reply {
      :deep(.avatar) {
        display: block;
      }
    }
    :deep(.comment-info) {
      .content {
        max-width: 550px;
      }
      .like-reply {
        margin-right: 20px;
      }
    }

    .tempHeight {
      min-height: auto !important;
    }
  }
}
</style>
