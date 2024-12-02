<template>
  <div class="handle">
    <Transition mode="out-in">
      <div class="save-cancel" v-if="showBtn && tipType === 'unknown'">
        <ElButton class="btn" @click="emits('save')">保存</ElButton>
        <ElButton
          class="btn"
          v-if="showCancel"
          :cancel="true"
          @click="emits('cancel')"
        >
          重置
        </ElButton>
      </div>
      <div class="mes-wrap" v-else>
        <Transition mode="out-in" name="tip" appear>
          <span class="icon fail-icon" v-if="tipType === 'fail'">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M29.6567 18.3432L18.343 29.6569"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.3433 18.3432L29.657 29.6569"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ message }}
          </span>
          <span class="icon success-icon" v-else-if="tipType === 'success'">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M16 24L22 30L34 18"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ message }}
          </span>
          <span v-else></span>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import ElButton from '@/components/button/el-button.vue'

const emits = defineEmits(['cancel', 'save'])
defineProps({
  tipType: {
    type: String as PropType<'success' | 'fail' | 'unknown'>,
    default: 'unknown'
  },
  message: {
    type: String,
    default: ''
  },
  showBtn: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.handle {
  margin-left: 45px;

  .save-cancel {
    .btn {
      padding: 6px 20px;
      margin: 0 15px;
    }
  }
  .mes-wrap {
    display: flex;
    align-items: center;
    .icon {
      display: flex;
      align-items: center;
      height: 24px;
      svg {
        margin-right: 10px;
      }
    }
    .fail-icon {
      color: var(--primary-err-color);
      stroke: var(--primary-err-color);
    }
    .success-icon {
      color: var(--primary-success-color);
      stroke: var(--primary-success-color);
    }
  }
}

// 默认的vue 动画
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.7s ease;
}
</style>
