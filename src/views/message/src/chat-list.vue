<template>
  <div class="chat-list">
    <div class="title">最近联系</div>
    <div v-if="messageStore.chatListEnd && !chatList.length" class="no-people">
      还没有私信哦&nbsp; ,,Ծ‸Ծ,,
    </div>
    <ul
      v-else
      class="list"
      v-lazy-loading="loadMore"
      :lazy-loading-immediate="true"
      :lazy-loading-distance="250"
      :lazy-loading-delay="350"
      :lazy-loading-disabled="messageStore.chatListEnd"
    >
      <li
        class="item"
        :class="{ chose: index == choseIndex }"
        v-for="(item, index) in chatList"
        :key="item.chatId"
        @click="handleChose(index, item)"
      >
        <div class="left">
          <div class="unread" v-if="item.unread">{{ item.unread }}</div>
          <AvatarItem
            class="avatar-warp"
            :user-id="item.receiver.userId"
            :img-url="item.receiver.avatar"
            :width="40"
            :height="40"
            :not-link="true"
          ></AvatarItem>
        </div>

        <div class="right">
          <div class="name-time">
            <span class="name one-line">{{ item.receiver.userName }}</span>
            <span class="time">{{ item.message[0].sendTime }}</span>
          </div>
          <div class="content">
            <span class="text one-line">
              {{
                item.message[0].msgType == 'text'
                  ? item.message[0].content
                  : '[图片]'
              }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AvatarItem from '@/components/avatar/avatar-item.vue'
import useMessageStore from '@/stores/module/message'
import type { IChatRelation } from '@/service/message/type'

const emits = defineEmits(['chose'])

const messageStore = useMessageStore()

const chatList = computed(() => messageStore.chatList)
const choseIndex = ref(-1)
const handleChose = (index: number, item: IChatRelation) => {
  choseIndex.value = index
  const chat = messageStore.chatList.find((i) => i.chatId === item.chatId)
  if (chat) chat.unread = 0
  emits('chose', item)
}

const loadMore = () => {
  messageStore.getChatListAction()
}
</script>

<style scoped lang="less">
.chat-list {
  width: 285px;
  border-right: 1px solid var(--border-color1);
}
.title {
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 500;
}
.list {
  height: 595px;
  overflow: scroll;
  .item {
    display: flex;
    align-items: center;
    padding: 12px 20px 12px 29px;
    position: relative;
    cursor: pointer;
    .left {
      position: relative;
      .unread {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -5px;
        top: -4px;
        z-index: 1;
        background-color: #f1403c;
        color: #fff;
        font-size: 12px;
        border-radius: 8px;
        height: 16px;
        line-height: 16px;
        min-width: 8px;
        padding: 0 4px;
      }
    }
    .right {
      margin-left: 10px;
      flex-grow: 1;
      line-height: 1.5;
      .content {
        display: flex;
        flex-direction: column;
        .text {
          font-size: 13px;
        }
      }
      .name-time {
        display: flex;
        justify-content: space-between;
        .name {
          font-size: 15px;
          color: var(--color-text1);
        }
        .time {
          flex-shrink: 0;
          font-size: 12px;
        }
      }
    }
    &::after {
      background-color: var(--border-color3);
      bottom: 0;
      content: '';
      height: 1px;
      left: 20px;
      position: absolute;
      right: 25px;
    }
  }
}
.chose {
  background-color: var(--transparent-hover);
  &::after {
    height: 0px !important;
  }
}
.no-people {
  display: flex;
  justify-content: center;
  margin-top: 90%;
}
</style>
