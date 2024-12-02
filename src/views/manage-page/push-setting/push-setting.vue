<template>
  <div class="push">
    <div class="head">
      <span>消息与提醒</span>
      <span class="tip">私信设置/关注/点赞/收藏/评论设置</span>
    </div>
    <div class="body" v-if="config">
      <SettingItem
        ref="messageEl"
        v-model="config.message"
        :title="{ head: '私信设置', tip: '允许谁给我发私信' }"
        :zero-text="'不接收私信'"
        :setting-type="'message'"
        @update="handleUpdate"
      ></SettingItem>
      <SettingItem
        ref="followEl"
        v-model="config.follow"
        :title="{ head: '收到关注设置', tip: '我被谁关注时，我会收到消息通知' }"
        :setting-type="'follow'"
        @update="handleUpdate"
      ></SettingItem>
      <SettingItem
        ref="likeEl"
        v-model="config.like"
        :title="{
          head: '收到点赞设置',
          tip: '我的作品/动态被谁喜欢时，我会收到消息通知'
        }"
        :setting-type="'like'"
        @update="handleUpdate"
      ></SettingItem>
      <SettingItem
        ref="collectEl"
        v-model="config.collect"
        :title="{
          head: '收到收藏设置',
          tip: '有人收藏我的作品时，我会收到消息通知'
        }"
        :setting-type="'collect'"
        @update="handleUpdate"
      ></SettingItem>
      <SettingItem
        ref="commentEl"
        v-model="config.comment"
        :title="{
          head: '收到评论设置',
          tip: '被谁评论或回复时，会收到消息通知'
        }"
        :setting-type="'comment'"
        @update="handleUpdate"
      ></SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SettingItem from './setting-item.vue'
import useNotifyStore from '@/stores/module/setting/notify'
type settingType = 'like' | 'comment' | 'collect' | 'message' | 'follow'
const notifyStore = useNotifyStore()
notifyStore.getNotifyConfigAction()
const { config } = storeToRefs(notifyStore)

const likeEl = ref<InstanceType<typeof SettingItem>>()
const commentEl = ref<InstanceType<typeof SettingItem>>()
const collectEl = ref<InstanceType<typeof SettingItem>>()
const messageEl = ref<InstanceType<typeof SettingItem>>()
const followEl = ref<InstanceType<typeof SettingItem>>()

const handleUpdate = async (type: settingType) => {
  const res = await notifyStore.updateNotifyConfigAction()
  let tip
  if (res.status === 200) {
    tip = { msg: '修改成功', type: 'success' }
  } else {
    tip = { msg: '修改失败，稍后再试', type: 'error' }
  }
  if (type == 'like') likeEl.value?.changeTip(tip.msg, tip.type)
  if (type == 'comment') commentEl.value?.changeTip(tip.msg, tip.type)
  if (type == 'collect') collectEl.value?.changeTip(tip.msg, tip.type)
  if (type == 'message') messageEl.value?.changeTip(tip.msg, tip.type)
  if (type == 'follow') followEl.value?.changeTip(tip.msg, tip.type)
}
</script>

<style scoped lang="less">
.push {
  padding: 50px;
}
.head {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text1);
  .tip {
    margin-top: 5px;
    color: var(--color-text4-hover);
    font-size: 14px;
  }
}
.body {
  margin-top: 30px;
}
</style>
