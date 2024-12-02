<template>
  <div class="trend-item" v-if="isShowTrend">
    <div class="container" @click="$emit('goToDetail', trendItem)">
      <div class="header" @click.stop>
        <div class="info">
          <AvatarItem
            @click.stop
            :height="45"
            :width="45"
            :user-id="trendItem.userId"
            :img-url="trendItem.avatar"
            :lazyLoad="'close'"
            :notLink="notLink"
            :open-new="true"
          ></AvatarItem>
          <div class="nick-time">
            <div class="nick" @click.stop>
              <router-link
                :to="{
                  name: 'userHome',
                  params: { userId: trendItem.userId }
                }"
                target="_blank"
                >{{ trendItem.userName }}
                <VTag
                  :v-status="trendItem.vStatus"
                  style="margin-left: 5px"
                ></VTag>
              </router-link>
            </div>
            <div class="time">
              {{
                $filters.formatUtcToShowTime(
                  trendItem.createAt,
                  trendItem.type == 'aw' ? 0 : 8
                )
              }}
              <div class="click" @click="handleGoToArtPage(trendItem)">
                &nbsp;·&nbsp;{{
                  trendItem.type == 'aw' ? '投稿作品' : '发布动态'
                }}
              </div>
              <div v-if="whoSee">&nbsp;·&nbsp;{{ whoSee }}</div>
            </div>
          </div>
        </div>
        <div class="setting" @click.stop="handleShowSetting">
          <svg
            width="16"
            height="16"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36 18L24 30L12 18"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <SettingPanel
            v-if="isShowSetting"
            @close="handleShowSetting"
            @delete="handleDelete(trendItem.trendId)"
            @permission="handleShowPermission"
            @report="handleReport"
            :userId="trendItem.userId"
            :type="trendItem.type"
            :userName="trendItem.userName"
            :trendId="trendItem.trendId"
          ></SettingPanel>
        </div>
      </div>
      <div class="body">
        <div
          class="link"
          v-if="
            trendItem.type == 'tr' && trendItem.topic.topicId && isShowTopic
          "
        >
          <RouterLink
            :to="{
              name: 'topicDetail',
              params: { topicId: trendItem.topic.topicId }
            }"
            target="_blank"
          >
            <span class="topic" @click.stop>
              <svg
                width="14"
                height="14"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                  fill="#1bad1b"
                  stroke="#1bad1b"
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
              <span class="topic-text"> {{ trendItem.topic.text }}</span>
            </span>
          </RouterLink>
        </div>
        <div class="intro">
          <span v-html="$xss(intro)"></span>
          <span
            @click.stop
            class="intro-btn"
            v-show="!isShowAll && isShowMoreBtn"
            @click="handleShowAllFn"
          >
            展开
          </span>
          <span
            @click.stop
            class="intro-btn"
            v-show="isShowAll && isShowMoreBtn"
            @click="handleShowAllFn"
          >
            收起
          </span>
        </div>
        <div class="no-see" v-if="trendItem.forward?.isDelete">
          动态已被作者删除
        </div>
        <div class="no-see" v-else-if="trendItem.forward?.whoSee == 'privacy'">
          私密动态不可见
        </div>
        <div
          v-else-if="forward"
          class="forward-item"
          @click.stop="
            $emit('goToDetail', forward), $emit('goToForward', forward)
          "
        >
          <div class="nick">@{{ forward.userName }}</div>
          <div class="link" v-if="forward.type == 'tr'">
            <span class="topic" v-if="forward.topic.topicId" @click.stop>
              <svg
                width="13"
                height="13"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 26.7117 4.53967 29.2974 5.51747 31.6554C6.02232 32.8729 6.64396 34.0297 7.36843 35.1119C7.61157 35.4751 7.15543 37.7711 6 42C10.2289 40.8446 12.5249 40.3884 12.8881 40.6316C13.9703 41.356 15.1271 41.9777 16.3446 42.4825C18.7026 43.4603 21.2883 44 24 44Z"
                  fill="#1bad1b"
                  stroke="#1bad1b"
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
              <span class="topic-text"> {{ forward.topic.text }}</span>
            </span>
          </div>
          <div class="intro">
            <span v-html="$xss(forward.intro)"></span>
          </div>
          <ImgWrap :pics="forward.pics"></ImgWrap>
          <FootItem
            :trend-item="forward"
            :is-forward="true"
            @comment="$emit('goToDetail', forward)"
          >
          </FootItem>
        </div>
        <ImgWrap :pics="trendItem.pics"></ImgWrap>
      </div>
    </div>
    <FootItem
      :trend-item="trendItem"
      @like="$emit('like', trendItem)"
      @comment="isShowReply = !isShowReply"
    ></FootItem>
    <ReplyItem
      v-if="quickReply && isShowReply"
      :avatar="mainStore.avatarUrl"
      v-model="commentText"
      @reply="comment"
    ></ReplyItem>
  </div>
  <Permission
    v-if="isShowPermission"
    :whoSee="trendItem.whoSee"
    :comment="trendItem.comment"
    :trend-id="trendItem.trendId"
    @update="handleUpdatePermission"
    @close="handleShowPermission"
  ></Permission>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { AvatarItem, VTag } from '@/components/avatar'
import SettingPanel from '../cpn/setting-panel.vue'
import ImgWrap from '../cpn/img-wrap.vue'
import FootItem from '../cpn/foot-item.vue'
import Permission from '../cpn/permission-setting.vue'
import { ReplyItem } from '@/components/comment'
import { ReportPanel } from '@/components/report'
import { MessageBox } from '@/components/message-box'
import type { ITrend, IPermission } from '@/service/trend-page/type'
import { reBytesStr } from '@/utils/data-format'
import { stopBodyScroll } from '@/utils/stopScroll'
import useMainStore from '@/stores/module/main'
import useDetailStore from '@/stores/module/trend/detail'

const emits = defineEmits([
  'goToDetail',
  'goToForward',
  'like',
  'delete',
  'update'
])
const props = defineProps({
  trendItem: {
    type: Object as PropType<ITrend>,
    required: true
  },
  notLink: {
    type: Boolean,
    default: false
  },
  isShowTopic: {
    type: Boolean,
    default: true
  },
  // 是否开启快速回复
  quickReply: {
    type: Boolean,
    default: true
  }
})
const router = useRouter()
const mainStore = useMainStore()
const detailStore = useDetailStore()
const forward = computed(() => props.trendItem.forward)
const isOwner = computed(() => props.trendItem.userId === mainStore.userId)
const whoSee = computed(() => {
  const str = props.trendItem.whoSee
  if (str === 'onlyFans') {
    return '仅粉丝可见'
  } else if (str === 'privacy') {
    return '仅自己可见'
  } else {
    return ''
  }
})
//删除/私密/不是关注 不展示动态
const isShowTrend = computed(() => {
  if (props.trendItem.isDelete) {
    return false
  }
  if (isOwner.value) return true
  if (props.trendItem.whoSee == 'privacy') {
    return false
  }
  if (props.trendItem.whoSee == 'onlyFans') {
    return props.trendItem.interact.isFocusAuthor
  }
  return true
})

// 处理 描述文字函数
const isShowAll = ref(false)
const isShowMoreBtn = ref(false)

const introFn = (introStr: string | undefined) => {
  if (!introStr) {
    return props.trendItem.type == 'aw' ? '分享作品' : ''
  }
  // eslint-disable-next-line no-control-regex
  const bLen = introStr.replace(/[^\x00-\xff]/g, '01').length
  //如果大于 240个字节 则隐藏一部分
  if (bLen > 240 && isShowAll.value === false) {
    isShowMoreBtn.value = true
    return reBytesStr(introStr, 240) + '  ...'
  }

  return introStr
}
const intro = computed(() => introFn(props.trendItem.intro))

const handleShowAllFn = () => {
  isShowAll.value = !isShowAll.value
}

const isShowSetting = ref(false)
const handleShowSetting = () => {
  isShowSetting.value = !isShowSetting.value
}
// 跳转到作品页
const handleGoToArtPage = (item: ITrend) => {
  if (item.type === 'aw') {
    const url = router.resolve({
      name: 'ArtworkDetail',
      params: { artId: item.trendId }
    })
    window.open(url.href, '_blank')
  } else {
    emits('goToDetail', item)
  }
}

const handleDelete = (trendId: string) => {
  MessageBox({
    title: '确定删除?',
    text: '删除之后动态不可恢复'
  }).then(() => emits('delete', trendId))
}

const isShowPermission = ref(false)
const handleShowPermission = () => {
  isShowPermission.value = !isShowPermission.value
  stopBodyScroll(isShowPermission.value)
}
const handleUpdatePermission = (data: IPermission) => {
  emits('update', data)
  handleShowPermission()
}
// 发送举报消息
const handleReport = () => {
  if (!mainStore.verifyIsLogin()) return
  const { trendId, userId, type } = props.trendItem
  ReportPanel({ msgId: trendId, msgType: type, defendant: userId })
}

const isShowReply = ref(false)
const commentText = ref('')
// 发送回复网络请求
const comment = async () => {
  const data = {
    ownId: props.trendItem.trendId,
    replyId: '0',
    replyUserId: props.trendItem.userId,
    rootId: '0',
    replyUserName: '',
    text: commentText.value,
    type: props.trendItem.type,
    senderName: mainStore.userName,
    senderAvatar: mainStore.avatar
  }
  await detailStore.postCommentAction(data)
  //发送完后 清空字符串
  commentText.value = ''
}
</script>

<style scoped lang="less">
@import '../css/img-show.less';
.trend-item {
  flex: 1;
  border-radius: 5px;
  background-color: var(--surface-color4);
  margin-bottom: 5px;
  font-size: 15px;
}
.container {
  padding: 20px 20px 0 20px;
  cursor: pointer;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: auto;
  .setting {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    svg {
      stroke: var(--color-text3);
    }
  }

  .info {
    display: flex;
    align-items: center;
    .nick-time {
      margin-left: 10px;
      .time {
        display: flex;
        font-size: 12px;
        color: var(--color-text3);
      }
      .click {
        cursor: pointer;
        &:hover {
          color: var(--color-text4);
        }
      }
    }
  }
}

.nick {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
  a {
    color: var(--color-text2);
    display: inline-flex;
    align-items: center;
  }
}
.body {
  margin-left: 55px;
  margin-top: 5px;
  .intro {
    line-height: 24px;
    margin-bottom: 10px;
    margin-top: 5px;
    line-break: anywhere;
    color: var(--color-regular) !important;
    font-weight: 400 !important;
    .intro-btn {
      margin-left: 5px;
      display: inline-block;
      color: #eb7350;
      cursor: pointer;
    }
  }
}

.forward-item {
  padding: 10px 20px;
  margin: 8px -10px 0px;
  background-color: var(--bgc4);
  border-radius: 10px;
  .nick {
    font-size: 12px;
    margin: 5px 0px 8px;
  }
  .intro {
    font-size: 13px;
    color: var(--color-regular) !important;
    font-weight: 400 !important;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
  }
  .topic {
    font-size: 12px;
  }
}
.no-see {
  padding: 20px;
  margin: 8px -10px 0px;
  background-color: var(--bgc4);
  border-radius: 10px;
  text-align: center;
}
:deep(.reply) {
  border-top: 1px solid var(--transparent-little-hover);
  border-bottom: 1px solid var(--transparent-little-hover);
  background-color: var(--surface-color4) !important;
  padding-bottom: 25px !important;
  padding-top: 20px !important;
  margin: 0 !important;
  .textarea-wrap {
    flex: 1 !important;
  }
  textarea {
    width: 100% !important;
  }
}
</style>
