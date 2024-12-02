<template>
  <transition name="copy-tip" appear>
    <div class="copy" @mouseleave="mouseLeave" v-if="isShow">
      <div class="arrow"></div>
      <div class="link-content">
        <div class="link">{{ link }}</div>
        <div class="copy-btn" @click="copy">
          <span v-if="!isSuccess">复制内容</span>
          <span v-else>已复制</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { copyText } from '@/utils/system'
export default defineComponent({
  props: {
    link: {
      type: String,
      default: ''
    },
    bottom: {
      type: String,
      default: '-40px'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['leave'],
  setup(props, { emit }) {
    const isSuccess = ref(false)
    const copy = () => {
      isSuccess.value = true
      const text = props.link
      copyText(text)
    }
    const mouseLeave = () => {
      if (isSuccess.value) {
        isSuccess.value = false
        emit('leave')
      }
    }
    useEventListener(document, 'click', () => {
      emit('leave')
    })
    return {
      isSuccess,
      mouseLeave,
      copy
    }
  }
})
</script>

<style scoped lang="less">
.copy {
  position: absolute;
  background-color: var(--bgc);
  box-shadow: 0px 1px 4px var(--surface-color1-shadow);
  color: var(--color-text1);
  z-index: 2;
  font-size: 14px;
  font-weight: 700;
  width: 260px;
  right: -140px;
  bottom: v-bind(bottom);
  border-radius: 5px;
  .link-content {
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    .link {
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
      padding: 9px 0px 7px 12px;
      white-space: nowrap;
      width: 150px;
      cursor: text;
      background-color: var(--surface-color3);
    }
    .copy-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      padding: 5px 18px;
      font-weight: 500;
      transition: background-color 0.3s ease;
      background-color: var(--btn-color3);
      &:hover {
        background-color: var(--btn-color3-hover);
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: -5px;
      right: 160px;
      height: 12px;
      width: 12px;
      background-color: var(--surface-color3);
      transform: rotate(45deg);
      z-index: 1;
    }
  }
}
.copy-tip-enter-active,
.copy-tip-leave-active {
  transition: opacity 0.3s;
}
.copy-tip-enter,
.copy-tip-leave-to {
  opacity: 0;
}
</style>
