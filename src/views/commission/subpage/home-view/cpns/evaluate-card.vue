<template>
  <div class="evaluate-card">
    <div class="header">
      <AvatarItem
        :width="35"
        :height="35"
        :user-id="evaluate.userId"
        :file-name="evaluate.avatar"
        :go-to-commission="true"
        :openNew="true"
      ></AvatarItem>
      <div class="name-time">
        <span class="name">{{ evaluate.userName }}</span>
        <span class="time">
          {{ $filters.formatTime(evaluate.createAt, 'YYYY年MM月DD日') }}
        </span>
      </div>
      <div class="setting" @click="isShowReport = true" v-if="!isOwner">
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="12" r="3" />
          <circle cx="24" cy="24" r="3" />
          <circle cx="24" cy="35" r="3" />
        </svg>
        <div
          class="report"
          v-show="isShowReport"
          ref="panelEl"
          @click="handleReport"
        >
          <span> 举报评价 </span>
        </div>
      </div>
    </div>
    <div class="body">
      {{ evaluate.text }}
    </div>
    <div class="footer">
      <el-rate :model-value="Math.round(evaluate.score)" disabled />
      <span class="goto" @click="$emit('showDetail', evaluate.inviteId)">
        查看方案
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AvatarItem } from '@/components/avatar'
import { clickOtherClose } from '@/hooks/click-close'

const props = defineProps({
  evaluate: {
    type: Object,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['showDetail', 'report'])

const isShowReport = ref(false)
const panelEl = ref<HTMLDivElement>()
clickOtherClose(panelEl, () => (isShowReport.value = false))

const handleReport = () => {
  isShowReport.value = false
  emits('report', props.evaluate.evaluateId, props.evaluate.userId)
}
</script>

<style scoped lang="less">
.evaluate-card {
  background-color: var(--surface-color4);
  border-radius: 10px;
  padding: 20px 20px 15px;
  user-select: none;
  .header {
    position: relative;
    display: flex;
    margin-bottom: 10px;
    .name-time {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
      .name {
        font-size: 14px;
        font-weight: 500;
      }
      .time {
        font-size: 12px;
        color: var(--color-text3);
      }
    }
    .setting {
      position: absolute;
      right: 0;
      cursor: pointer;
      svg {
        fill: var(--color-text2);
      }
      .report {
        position: absolute;
        left: -65px;
        top: 20px;
        background-color: var(--surface-color4);
        border-radius: 8px;
        border: 1px solid var(--border-color1);
        box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
        border-radius: 8px;
        z-index: 10;
        padding: 12px 10px;
        white-space: nowrap;
        font-size: 13px;
        &:hover {
          background-color: var(--bgc-chose-color);
          color: var(--primary-middle-color);
        }
      }
    }
  }
  .body {
    line-height: 1.55;
    font-size: 14px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    .goto {
      cursor: pointer;
      font-size: 12px;
    }
  }
}
</style>
