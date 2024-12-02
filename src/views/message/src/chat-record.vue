<template>
  <div class="record" ref="recordEL" @scroll="handleScroll">
    <template v-for="item in messageStore.messageRecord" :key="item.msgId">
      <div class="message">
        <div class="time" v-if="item.showTime">{{ item.showTime }}</div>
        <div
          class="msg-body"
          :class="{ 'msg-reverse': mainStore.userId == item.sender }"
        >
          <AvatarItem
            class="avatar"
            :user-id="
              mainStore.userId == item.sender
                ? mainStore.userId
                : receiver.userId
            "
            :img-url="
              mainStore.userId == item.sender
                ? mainStore.avatarUrl
                : receiver.avatar
            "
            :width="40"
            :height="40"
            :lazyLoad="'close'"
          ></AvatarItem>
          <div class="text" v-if="item.msgType == 'text'">
            {{ item.content }}
          </div>
          <div v-else class="img" @click="handleShowLargePic(item.content)">
            <img
              :src="item.content"
              alt=""
              draggable="false"
              :style="calculateImgSize(item.width!, item.height!)"
            />
            <div class="uploading" v-if="item.uploading">
              <div class="fail" v-if="item.uploadFail">上传失败</div>
              <ringLoading :size="'20'" v-else></ringLoading>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <ImgView
    v-if="isShowImgLarge"
    :pic-list="pics"
    :index="0"
    :background-color="'rgba(0, 0, 0, 0.5)'"
    @close="handleShowLargePic"
  ></ImgView>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type PropType } from 'vue'
import useMessageStore from '@/stores/module/message'
import useMainStore from '@/stores/module/main'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import ImgView from '@/components/img-view/img-view.vue'
import { ringLoading } from '@/components/loading/index'
import { getScrollPosition } from '@/components/utils/scroll'
import { stopBodyScroll } from '@/utils/stopScroll'
import type { IUserInfo } from '@/service/message/type'
import type { fileType } from '@/components/img-view/type'

const props = defineProps({
  receiver: {
    type: Object as PropType<IUserInfo>,
    required: true
  }
})
const mainStore = useMainStore()
const messageStore = useMessageStore()

const recordEL = ref<HTMLDivElement>()
const scrollBottom = () => {
  nextTick(() => recordEL.value?.scrollTo({ top: 99999 }))
}

// 传过来的用户改变则查询对应的聊天记录
watch(
  () => props.receiver.userId,
  async (receiver) => {
    messageStore.messageRecord = []
    messageStore.messageEnd = false
    messageStore.isLoading = true
    await messageStore.getMessageRecordAction(mainStore.userId, receiver)
    messageStore.isLoading = false
    scrollBottom()
  },
  { immediate: true }
)

// 滚动加载更多聊天
const handleScroll = async (event: Event) => {
  if (messageStore.messageEnd || messageStore.isLoading) return
  const { y } = getScrollPosition(event.target)
  const receiver = props.receiver.userId
  if (y <= 400) {
    messageStore.isLoading = true
    await messageStore.getMessageRecordAction(mainStore.userId, receiver)
    messageStore.isLoading = false
  }
}

// 计算图片显示大小
const calculateImgSize = (w: number, h: number) => {
  const maxWidth = 300
  const maxHeight = 300
  const minSize = 150
  let newWidth = w
  let newHeight = h

  // 横长图
  if (w / h > 1) {
    if (w > maxWidth) {
      newWidth = maxWidth
      newHeight = (h * maxWidth) / w
    }
    if (newHeight < minSize) {
      newHeight = minSize
      newWidth = (w * minSize) / h
    }
  }
  // 竖长图
  else {
    if (h > maxHeight) {
      newHeight = maxHeight
      newWidth = (w * maxHeight) / h
    }

    if (newWidth < minSize) {
      newWidth = minSize
      newHeight = (h * minSize) / w
    }
  }
  return { width: newWidth + 'px', height: newHeight + 'px' }
}

// 展示大图
const isShowImgLarge = ref(false)
const pics = ref<fileType[]>([])
const handleShowLargePic = (imgUrl: string) => {
  if (imgUrl) pics.value = [{ fileName: imgUrl, sort: 0 }]
  isShowImgLarge.value = !isShowImgLarge.value
  stopBodyScroll(isShowImgLarge.value)
}

defineExpose({ scrollBottom })
</script>

<style scoped lang="less">
.record {
  overflow: scroll;
  height: 407px;
}
.message {
  .time {
    font-size: 12px;
    line-height: 20px;
    padding-top: 15px;
    text-align: center;
  }
  .msg-body {
    margin: 23px 20px;
    display: flex;
    .avatar {
      display: flex;
      align-items: center;
    }
    .text {
      color: var(--color-text1);
      background-color: var(--surface-color3);
      margin: 0 10px;
      word-wrap: break-word;
      border-radius: 8px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 14px;
      letter-spacing: 0.4px;
      line-height: 20px;
      max-width: 388px;
      min-height: 40px;
      padding: 10px 12px;
      position: relative;
      text-align: left;
      white-space: pre-wrap;
      word-break: break-all;
      &::before {
        content: '';
        position: absolute;
        bottom: calc(50% - 4px);
        left: -3px;
        height: 8px;
        width: 8px;
        transition: background-color 0.3s ease;
        background-color: var(--surface-color3);
        transform: rotate(45deg);
        z-index: 1;
      }
    }
    .img {
      position: relative;
      margin: 0 10px;
      border-radius: 8px;
      overflow: hidden;
      user-select: none;
      img {
        max-width: 300px;
        max-height: 300px;
        object-fit: cover;
        cursor: zoom-in;
      }
      .uploading {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .fail {
        color: var(--primary-err-color);
      }
    }
  }
  .msg-reverse {
    flex-direction: row-reverse;
    .text {
      color: #fff;
      background-color: var(--btn-color1);
      &::before {
        content: '';
        right: -3px;
        left: auto;
        background-color: var(--btn-color1);
      }
    }
  }
}
.img-view {
  background-color: #fff;
}
</style>
