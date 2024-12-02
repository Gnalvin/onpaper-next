<template>
  <div class="notify">
    <div class="container">
      <div class="nav">
        <div class="title">消息中心</div>
        <ul>
          <li
            class="item"
            :class="{ chose: index == choseIndex }"
            v-for="(item, index) in navTabs"
            :key="item.title"
            @click="handleNavClick(item.val, index)"
          >
            {{ item.title }}
            <div class="unread" v-if="item.unread">{{ item.unread }}</div>
          </li>
        </ul>
      </div>
      <div
        class="content"
        v-lazy-loading="loadMore"
        :lazy-loading-immediate="false"
        :lazy-loading-distance="200"
        :lazy-loading-delay="300"
        :lazy-loading-disabled="notifyStore.isEnd"
      >
        <template v-for="item in notifyStore.notify" :key="item.notifyId">
          <Notify
            :notify="item"
            :content="item.content"
            @post-comment="handlePostComment"
          ></Notify>
        </template>
        <div class="none" v-if="notifyStore.noHavMsg">暂时没有新消息</div>
        <div class="end" v-else-if="notifyStore.isEnd">
          ,,Ծ‸Ծ,, &nbsp;&nbsp; 没有更多消息了
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Notify from './notify-body.vue'
import useNotifyStore from '@/stores/module/notify-page'
import type { IPostCommentData } from '@/service/comment/type'

type valType = 'focus' | 'comment' | 'likeAndCollect' | 'commission'
type navType = { title: string; val: valType; unread: number }

const choseIndex = ref(0)
const notifyStore = useNotifyStore()
notifyStore.getUnreadCountAction()
const navTabs = computed<navType[]>(() => {
  return [
    {
      title: '喜欢和收藏',
      val: 'likeAndCollect',
      unread: notifyStore.unread.collect + notifyStore.unread.like
    },
    {
      title: '新增关注',
      val: 'focus',
      unread: notifyStore.unread.follow
    },
    {
      title: '评论我的',
      val: 'comment',
      unread: notifyStore.unread.comment
    },
    {
      title: '约稿信息',
      val: 'commission',
      unread: notifyStore.unread.commission
    }
  ]
})

watch(
  choseIndex,
  () => {
    notifyStore.notify = []
    notifyStore.noHavMsg = false
    notifyStore.isEnd = false
    notifyStore.getNotifyAction()
  },
  {
    immediate: true
  }
)

const handleNavClick = (val: valType, index: number) => {
  choseIndex.value = index
  notifyStore.notifyType = val
}
// 发布评论
const handlePostComment = (data: IPostCommentData) => {
  notifyStore.postCommentAction(data)
}
const loadMore = () => {
  notifyStore.getNotifyAction()
}
</script>

<style scoped lang="less">
.notify {
  display: flex;
  justify-content: center;
  background-color: var(--bgc3);
  min-height: 100vh;
}
.container {
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
  .nav {
    width: 230px;
    border-right: 1px solid var(--border-color1);
    .title {
      padding: 16px 20px;
      font-size: 15px;
      font-weight: 500;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 18px 40px;
      position: relative;
      cursor: pointer;
      .unread {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f1403c;
        color: #fff;
        font-size: 12px;
        border-radius: 8px;
        height: 16px;
        line-height: 16px;
        min-width: 8px;
        padding: 0 4px;
        margin-left: 10px;
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
      &::before {
        content: '';
        position: absolute;
        left: 25px;
        top: 45%;
        border: 1px solid var(--color-regular);
        background-color: var(--color-regular);
        display: inline-block;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        margin-right: 12px;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    padding: 10px 0;
  }
}

.chose {
  background-color: var(--transparent-hover);
  &::after {
    height: 0px !important;
  }
}
.none {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.end {
  display: flex;
  justify-content: center;
  padding: 40px 0 20px;
  font-size: 12px;
}
</style>
