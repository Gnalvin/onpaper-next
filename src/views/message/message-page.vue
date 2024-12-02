<template>
  <div class="message">
    <div class="chat-wrap">
      <ChatList @chose="handleChose"></ChatList>
      <ChatContainer
        v-if="relation"
        :receiver="relation.receiver"
      ></ChatContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatList from './src/chat-list.vue'
import ChatContainer from './chat-container.vue'
import type { IChatRelation } from '@/service/message/type'

const relation = ref<IChatRelation>()
const handleChose = (item: IChatRelation) => {
  relation.value = item
}
</script>

<style scoped lang="less">
.message {
  display: flex;
  justify-content: center;
  background-color: var(--bgc3);
  min-height: 100vh;
}
.chat-wrap {
  border-radius: 10px;
  background-color: var(--surface-color4);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 1px 1px 10px;
  width: 1000px;
  margin-top: 100px;
  display: flex;
  height: calc(100vh - 200px);
  max-height: 1000px;
  min-height: 645px;
}
</style>
