<template>
  <div class="chat">
    <div class="title">
      <div class="name">
        {{ receiver.userName }}
        <Transition>
          <ringLoading
            :size="'14'"
            class="loading"
            v-if="messageStore.isLoading"
          ></ringLoading>
        </Transition>
      </div>
      <div class="close" v-if="showClose" @click="$emit('close')">
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 14L34 34"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 34L34 14"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="tip" v-if="messageStore.tipMsg">{{ messageStore.tipMsg }}</div>
    <div class="container">
      <ChatRecord :receiver="receiver" ref="chatRecordEL"></ChatRecord>
      <ChatEditor
        :receiver="receiver"
        @scroll-bottom="handleScrollBottom"
      ></ChatEditor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, onUnmounted } from 'vue'
import ChatRecord from './src/chat-record.vue'
import ChatEditor from './src/chat-editor.vue'
import useMessageStore from '@/stores/module/message'
import { ringLoading } from '@/components/loading/index'
import type { IUserInfo } from '@/service/message/type'

defineEmits(['close'])

defineProps({
  receiver: {
    type: Object as PropType<IUserInfo>,
    required: true
  },
  showClose: {
    type: Boolean,
    default: false
  }
})
const messageStore = useMessageStore()

const chatRecordEL = ref<InstanceType<typeof ChatRecord>>()
const handleScrollBottom = () => {
  chatRecordEL.value?.scrollBottom()
}
onUnmounted(() => {
  messageStore.$reset()
})
</script>

<style scoped lang="less">
.chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.title {
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--border-color1);
  font-size: 15px;
  line-height: 20px;
  margin: 0 15px;
  padding: 17px 0 13px;
  font-weight: 500;
  .name {
    position: relative;
    .loading {
      position: absolute;
      right: -20px;
      top: 3px;
    }
  }
  .close {
    position: absolute;
    right: 0px;
    bottom: 7px;
    cursor: pointer;
    svg {
      stroke: var(--color-regular);
    }
  }
}
.container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.tip {
  width: 100%;
  line-height: 1.5;
  background-color: rgb(251, 234, 231);
  color: rgb(255, 40, 0);
  text-align: center;
  font-size: 15px;
}
</style>
