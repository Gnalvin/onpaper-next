<template>
  <div class="editor">
    <div class="tools">
      <div class="emoji-select">
        <Emoji @emoji="handleEmoji" :show-text="false" :position="'up'"></Emoji>
      </div>
      <div class="pic">
        <UploadUtil
          class="upload"
          @fileData="handleFileData"
          :fileSize="8"
          ref="uploadUtils"
        ></UploadUtil>
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 23C20.7614 23 23 20.7614 23 18C23 15.2386 20.7614 13 18 13C15.2386 13 13 15.2386 13 18C13 20.7614 15.2386 23 18 23Z"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M42 36L31 26L21 35L14 29L6 35"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="text" v-focus>
      <textarea
        ref="textareaEl"
        class="textarea"
        v-model.trim="senderText"
        @input="changHeight"
      ></textarea>
    </div>
    <div class="foot">
      <div class="count">
        <TextCount :text="senderText" :max-count="400"></TextCount>
      </div>
      <span class="tip">{{ tip }}</span>
      <ElButton
        class="btn"
        :verify-login="true"
        @click="handleSendMessage"
        :cancel="messageStore.noReceiveMsg"
        :class="{ noReceiveMsg: messageStore.noReceiveMsg }"
      >
        发送
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import Emoji from '@/components/emoji/emoji-select.vue'
import ElButton from '@/components/button/el-button.vue'
import TextCount from '@/components/trend/cpn/text-count.vue'
import useMessageStore from '@/stores/module/message'
import useMainStore from '@/stores/module/main'
import UploadUtil from '@/components/upload/src/upload-util.vue'
import { useEventListener } from '@vueuse/core'
import { EVENT_CODE } from '@/components/config/event_code'
import { getOSType } from '@/utils/system'
import { compress } from '@/utils/handle-img'
import { notification } from '@/components/notification'
import type { IUserInfo } from '@/service/message/type'
import type { IFilePayload } from '@/components/upload/type'
import type { IRecord } from '@/stores/module/message/type'

const emits = defineEmits(['scrollBottom'])

const props = defineProps({
  receiver: {
    type: Object as PropType<IUserInfo>,
    required: true
  }
})
const mainStore = useMainStore()
const messageStore = useMessageStore()
const { senderText } = storeToRefs(messageStore)

const handleEmoji = (emoji: string) => {
  const index = textareaEl.value?.selectionStart
  senderText.value =
    senderText.value.slice(0, index) + emoji + senderText.value.slice(index)
}

const handleFileData = (fileData: IFilePayload) => {
  if (messageStore.noReceiveMsg) return
  // 显示警告
  if (fileData.isLarge) {
    notification({
      title: '上传图片',
      type: 'error',
      message: '图片不能超过8M'
    })
    return
  }
  const time = new Date()
  // 先模拟一个消息展示在上传
  const data: IRecord = {
    receiver: props.receiver.userId,
    sender: mainStore.userId,
    content: fileData.url,
    msgType: 'pic',
    sendTime: time.toUTCString(),
    msgId: time.getTime().toString(),
    uploading: true
  }
  // 创建对象
  const img = new Image()
  img.src = fileData.url
  img.onload = async () => {
    const size = img.width > 720 ? 720 : img.width
    const scale = size / img.width
    data.width = Math.round(img.width * scale)
    data.height = Math.round(img.height * scale)
    // 获取 压缩过的 图片url
    const blobData = await compress(fileData.url, 0.75, size)
    //释放没有压缩过的 URL
    URL.revokeObjectURL(fileData.url)
    data.content = URL.createObjectURL(blobData)
    messageStore.uploadImgAction(blobData, data)
    nextTick(() => emits('scrollBottom'))
  }
}

const textareaEl = ref<HTMLTextAreaElement>()
//自动改变回复框大小
const changHeight = () => {
  // 这行为了退行时 自动变小
  textareaEl.value!.style.height = '20px'
  //如果大于150px 则锁定高度
  if (textareaEl.value!.scrollHeight > 102) {
    textareaEl.value!.style.height = '102px'
    return
  }
  // 把高度变为 元素 scrollHeight  撑起盒子
  const scrollHeight = textareaEl.value!.scrollHeight
  textareaEl.value!.style.height =
    (scrollHeight > 102 ? scrollHeight : 102) + 'px'
}
// 发布信息
const handleSendMessage = async () => {
  if (messageStore.noReceiveMsg) return
  if (!senderText.value) return
  if (senderText.value.length > 400) {
    notification({
      title: '发送私信',
      type: 'error',
      message: '文字不能超过400字'
    })
    return
  }
  const msg = {
    sender: mainStore.userId,
    receiver: props.receiver.userId,
    content: senderText.value,
    msgType: 'text'
  }
  senderText.value = ''
  await messageStore.sendMessageAction(msg)
  emits('scrollBottom')
}

const handleKeyboardChange = (event: KeyboardEvent) => {
  //用户点击了ctrl+enter触发
  if ((event.ctrlKey || event.metaKey) && event.code === EVENT_CODE.enter) {
    senderText.value += '\n'
    changHeight()
    return
  }
  // 回车键
  if (event.code === EVENT_CODE.enter) {
    // 避免回车键换行
    event.preventDefault()
    handleSendMessage()
    changHeight()
    return
  }
}

useEventListener(window, 'keydown', handleKeyboardChange)

const tip = computed(() => {
  const osType = getOSType()
  const str = osType === 'Mac' ? 'Command' : 'Ctrl'
  return `按住 ${str}+Enter 换行`
})
</script>

<style scoped lang="less">
.editor {
  display: flex;
  flex-direction: column;
  height: 200px;
}
.tools {
  display: flex;
  align-items: center;
  padding-top: 10px;
  margin: 0 15px;
  border-top: 1px solid var(--border-color1);
  .pic {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    margin-left: 10px;
    svg {
      stroke: var(--color-text2);
    }
    .upload {
      position: absolute;
      display: flex;
      align-items: center;
      font-size: 0 !important;
    }
    &:hover {
      color: var(--color-text4-hover);
      svg {
        stroke: var(--color-text4-hover);
      }
    }
  }
}
.text {
  flex-grow: 1;
  padding: 10px 10px 0 10px;
  .textarea {
    width: 100%;
    height: 100%;
    padding: 0px;
    line-height: 25px;
    font-size: 15px;
    color: var(--color-regular);
    resize: none;
    border: none;
    text-align: justify;
    box-shadow: none;
    outline: none;
    background-color: transparent;
    &:focus-visible {
      outline: none;
    }
  }
}
.foot {
  position: relative;
  padding: 0 20px 15px;
  display: flex;
  justify-content: flex-end;
  .count {
    position: absolute;
    left: 10px;
    bottom: 15px;
  }
  .btn {
    margin: 0;
    padding: 8px 20px;
    border-radius: 6px;
  }
  .tip {
    display: flex;
    align-items: center;
    margin-right: 15px;
    font-size: 12px;
    color: var(--color-text3);
  }
}
.noReceiveMsg {
  cursor: not-allowed;
}
</style>
