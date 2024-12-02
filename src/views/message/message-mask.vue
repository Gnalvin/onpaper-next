<template>
  <Teleport to="body">
    <Transition appear>
      <div class="top-mask-layer" @mousedown.self="handleClose">
        <div class="chat-wrap">
          <Message
            :receiver="receiver"
            :showClose="true"
            @close="handleClose"
          ></Message>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import Message from './chat-container.vue'
import useMessageStore from '@/stores/module/message'
import { MessageBox } from '@/components/message-box'

defineProps({
  receiver: {
    type: Object as PropType<{
      userId: string
      userName: string
      avatar: string
    }>,
    required: true
  }
})
const emits = defineEmits(['close'])
const messageStore = useMessageStore()
const handleClose = () => {
  if (messageStore.senderText) {
    MessageBox({
      title: '是否关闭对话',
      text: '未发送的文本<span style=color:red>不会被保存</span>'
    }).then(() => {
      emits('close')
    })
    return
  }
  emits('close')
}
</script>

<style scoped lang="less">
.chat-wrap {
  border-radius: 10px;
  background-color: var(--surface-color4);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 1px 1px 10px;
  display: flex;
  align-items: center;
  margin: 100px auto 0;
  width: 685px;
  height: calc(100vh - 200px);
  max-height: 1000px;
  min-height: 645px;
}
</style>
