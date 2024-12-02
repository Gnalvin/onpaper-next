<template>
  <div class="info-bar-wrap" ref="infoBartEl">
    <div class="other-info" v-if="userId">
      <div class="header">
        <AvatarItem
          class="avatar"
          :user-id="userId"
          :img-url="artInfo.avatarName"
          :width="50"
          :height="50"
        ></AvatarItem>
        <div class="head-body">
          <router-link
            :to="{
              name: 'userHome',
              params: { userId }
            }"
            target="_blank"
          >
            <div class="user">
              {{ artInfo.userName }}
            </div>
            <VTag :v-status="artInfo.vStatus"></VTag>
          </router-link>
          <div class="time">
            {{ $filters.formatUtcToShowTime(artInfo.createAT, 0) }}
          </div>
        </div>
        <div class="is-focus" v-if="!isOwner" @click="emits('focus')">
          <ElButton class="btn focused" v-if="interact.isFocusAuthor">
            {{ interact.isFocusAuthor == 1 ? '已关注' : '相互关注' }}
          </ElButton>
          <ElButton class="btn focus" v-else>
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
        </div>
        <div class="edit" v-else @click="emits('showEdit')">
          <ElButton class="btn" v-if="interact.isFocusAuthor">
            编辑作品
          </ElButton>
        </div>
      </div>
      <div class="intro">
        <span v-html="$xss(intro)"></span>
        <span
          class="intro-btn"
          v-show="!isShowAll && isShowBtn"
          @click="isShowAllFn"
        >
          展开
        </span>
        <span
          class="intro-btn"
          v-show="isShowAll && isShowBtn"
          @click="isShowAllFn"
          >收起</span
        >
      </div>
      <div class="foot">
        <span
          :title="interact.isLike ? '取消点赞' : '点赞'"
          class="like"
          @click="emits('like')"
        >
          <span class="like-bgc icon-bgc" :class="{ liked: interact.isLike }">
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text" :class="{ liked: interact.isLike }">
            {{ artInfo.likes }}
          </span>
        </span>
        <span
          :title="interact.isCollect ? '取消收藏' : '收藏'"
          class="collect"
          @click="emits('collect')"
        >
          <span
            class="collect-bgc icon-bgc"
            :class="{ collected: interact.isCollect }"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text" :class="{ collected: interact.isCollect }">
            {{ artInfo.collects }}
          </span>
        </span>
        <span class="share">
          <span class="share-bgc icon-bgc">
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 28.6292C26.5104 28.6292 28.5455 26.6004 28.5455 24.0979C28.5455 21.5954 26.5104 19.5667 24 19.5667C21.4897 19.5667 19.4546 21.5954 19.4546 24.0979C19.4546 26.6004 21.4897 28.6292 24 28.6292Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M16 15C10.6667 19.9706 10.6667 28.0294 16 33"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M32 33C37.3333 28.0294 37.3333 19.9706 32 15"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.85786 10C2.04738 17.7861 2.04738 30.4098 9.85786 38.1959"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M38.1421 38.1959C45.9526 30.4098 45.9526 17.7861 38.1421 10"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="text"> 分享</span>
        </span>
      </div>
    </div>
    <OtherShow></OtherShow>
    <CommentPart
      @scrollTop="scrollTop"
      @scrollBefore="scrollBefore"
      :key="refresh"
    ></CommentPart>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import useArtworkDetailStore from '@/stores/module/artwork-detail'
import { AvatarItem, VTag } from '@/components/avatar'
import ElButton from '@/components/button/el-button.vue'
import OtherShow from './other-show.vue'
import CommentPart from './comment-part.vue'
import { debounce } from '@/utils/debounce'
import {
  getScrollContainer,
  getScrollPosition
} from '@/components/utils/scroll'
import { reBytesStr } from '@/utils/data-format'

const emits = defineEmits(['focus', 'collect', 'like', 'showEdit'])

const artworkStore = useArtworkDetailStore()

// 作品相关信息
const artInfo = computed(() => artworkStore.artInfo)
const userId = computed(() => artworkStore.artInfo.userId)
const interact = computed(() => artworkStore.artInfo.interact)
const isOwner = computed(() => artworkStore.artInfo.isOwner)
const intro = ref()

// 是否展示全部文字
const isShowAll = ref(false)
const isShowBtn = ref(false)
const isShowAllFn = () => {
  isShowAll.value = !isShowAll.value
  intro.value = introFn(artworkStore.artInfo.intro)
}
// 处理 描述文字函数
const introFn = (introStr: string) => {
  // eslint-disable-next-line no-control-regex
  const bLen = introStr.replace(/[^\x00-\xff]/g, '01').length
  //如果大于 240个字节 则隐藏一部分
  if (bLen > 240 && isShowAll.value === false) {
    isShowBtn.value = true
    return reBytesStr(introStr, 240) + '  ...'
  }
  return introStr || '分享作品'
}

//切换作品时 介绍改变 重置属性
const refresh = ref(1)
watch(
  () => artworkStore.artInfo.artworkId,
  () => {
    isShowAll.value = false
    isShowBtn.value = false
    intro.value = introFn(artworkStore.artInfo.intro)

    // 强制刷新 评论组件
    refresh.value++
  },
  { immediate: true }
)

//右边的画布元素
const infoBartEl = ref<HTMLElement>()
let tempHight: number | undefined
const scrollTop = (smooth = false, record = false) => {
  const scrollEl = getScrollContainer(infoBartEl.value!)
  const clientWidth = document.documentElement.clientWidth
  const commentEl = infoBartEl.value?.getElementsByClassName(
    'comment'
  )[0] as HTMLElement

  //保存滚动前的高度
  const scrollY = getScrollPosition(scrollEl).y
  if (record) tempHight = scrollY

  // 获取评论元素 用于滚动位置
  const offsetTop =
    clientWidth < 1200 ? infoBartEl.value!.offsetTop - 50 : commentEl.offsetTop

  const behavior = smooth ? 'smooth' : 'auto'
  scrollEl!.scrollTo({ top: offsetTop, behavior })
}

//滚回之前的高度
const scrollBefore = () => {
  nextTick(() => {
    if (tempHight) {
      const scrollEl = getScrollContainer(infoBartEl.value!)
      //这是评论区在 右边的情况
      scrollEl!.scrollTo(0, tempHight)
    }
  })
}

//当组件挂载上的时候
let isOldRight: boolean
onMounted(() => {
  // 首次挂载的时候是否 在评论区是否在左边
  isOldRight = document.documentElement.clientWidth > 1200
  artworkStore.windowSize = document.documentElement.clientWidth
  //监听浏览器变化
  window.onresize = debounce(() => {
    //浏览器视口宽度
    const clientWidth = document.documentElement.clientWidth
    artworkStore.windowSize = clientWidth
    const isRight = clientWidth > 1200
    if (isOldRight !== isRight) {
      //刷新评论组件 才能查询懒加载
      refresh.value++
      isOldRight = isRight
      // 是否在点开子评论详情时 调整大小,如果是 需要对评论数据重置
      const tempCid = artworkStore.tempComments[0]?.rootId
      if (tempCid === undefined) return
      const cItem = artworkStore.comments.find((i) => i.cId === tempCid)
      cItem!.childComments = artworkStore.tempComments
      artworkStore.tempComments = []
    }
  }, 1000)
})
//组件销毁时 取消监听
onUnmounted(() => {
  window.onresize = null
})
</script>

<style scoped lang="less">
.info-bar-wrap {
  position: sticky;
  top: 65px;
  flex: 1;
  max-width: 335px;
  overflow-y: auto;
  height: calc(100vh - 60px - 26px);
  padding: 20px 20px 0 10px;
  border-radius: 5px;
  background-color: var(--bgc);
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
}
.header {
  display: flex;
  height: 50px;
  position: relative;
  padding-left: 10px;
  a {
    display: flex;
    align-items: center;
  }
  .avatar {
    margin-right: 10px;
  }
  .head-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    .user {
      font-weight: bolder;
      line-height: 20px;
      font-size: 14px;
      max-width: 145px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 5px;
    }
    .user:hover {
      cursor: pointer;
    }
    .time {
      margin-top: 5px;
      color: #939393;
      font-size: 12px;
    }
  }
}

.is-focus {
  .focused {
    color: var(--color-regular);
    background-color: var(--btn-cancel-color);
  }
  .focused:hover {
    background-color: var(--btn-cancel-hover-color);
  }
}
.btn {
  padding: 8px 20px;
  svg {
    margin-right: 5px;
  }
}
.intro {
  padding-left: 15px;
  margin: 15px 0;
  white-space: pre-line;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 24px;
  .intro-btn {
    margin-left: 5px;
    display: inline-block;
    color: #eb7350;
    cursor: pointer;
  }
}
.foot {
  display: flex;
  padding-bottom: 15px;
  font-size: 15px;
  line-height: 14px;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    cursor: pointer;
    svg {
      fill: none;
      stroke: var(--color-regular);
    }
    .icon-bgc {
      margin: 0 5px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .like {
    flex: 1;
    &:hover {
      color: rgb(251, 52, 85);
      .like-bgc {
        svg {
          stroke: rgb(251, 52, 85);
        }
        background-color: rgba(249, 24, 128, 0.1);
      }
    }
  }

  .liked {
    color: rgb(251, 52, 85);
    svg {
      fill: rgb(251, 52, 85);
      stroke: rgb(251, 52, 85);
    }
  }

  .collect {
    flex: 1;
    &:hover {
      color: #ff9c33;
      .collect-bgc {
        svg {
          stroke: #ff9c33;
        }
        background-color: #ffac0025;
      }
    }
  }
  .collected {
    color: #ff9c33;
    svg {
      fill: #ff9c33;
      stroke: #ff9c33;
    }
  }
  .share {
    flex: 1;
    &:hover {
      color: var(--btn-color1);
      .share-bgc {
        svg {
          stroke: var(--btn-color1);
        }
        background-color: rgba(29, 138, 240, 0.15);
      }
    }
  }
}

@media (max-width: 1200px) {
  .info-bar-wrap {
    max-width: none;
    position: relative;
    top: 0;
    flex: none;
    overflow: visible;
    height: auto;
    margin: 0 30px;
    padding: 10px 0 0 0;
    .other-info {
      display: none;
    }
    .other-art {
      display: none;
    }
  }
}
</style>
