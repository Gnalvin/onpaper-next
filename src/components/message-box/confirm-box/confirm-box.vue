<template>
  <transition name="message" appear>
    <div class="message-wrap" v-if="isShow" @click.self="closeMessageShow">
      <div class="message">
        <div v-if="isVNode(text)" ref="tempEl"></div>
        <div v-else class="text">
          <span v-if="title" class="title">{{ title }}</span>
          <span v-html="text"></span>
        </div>
        <div class="foot" v-if="onlyTip">
          <ElButton class="confirm btn" @click="$emit('action', 'confirm')">
            {{ confirmButtonText }}
          </ElButton>
        </div>
        <div class="foot" v-else>
          <ElButton class="cancel btn" @click="$emit('action', 'cancel')">
            {{ cancelButtonText }}
          </ElButton>
          <ElButton
            class="confirm btn"
            @click="$emit('action', 'confirm')"
            :style="{ backgroundColor: confirmBtnColor }"
          >
            {{ confirmButtonText }}
          </ElButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, isVNode, onMounted, render } from 'vue'
import ElButton from '@/components/button/el-button.vue'

export default defineComponent({
  components: { ElButton },
  props: {
    title: {
      type: String
    },
    text: {
      type: [String, Object]
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    onlyTip: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '280px'
    },
    confirmBtnColor: {
      type: String,
      default: ''
    }
  },
  emits: ['action'],
  setup(props, { emit }) {
    const isShow = ref(true)
    const closeMessageShow = () => {
      emit('action', 'cancel')
    }
    const tempEl = ref<HTMLDivElement>()
    onMounted(() => {
      if (isVNode(props.text)) {
        render(props.text, tempEl.value!)
      }
    })

    return {
      tempEl,
      isShow,
      closeMessageShow,
      isVNode
    }
  }
})
</script>

<style scoped lang="less">
.message-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.55);
}
.message {
  color: var(--color-text1);
  margin: 30vh auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: v-bind('$props.width');
  min-height: 135px;
  background-color: var(--surface-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 8px;
  padding: 15px;

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 15px;
    width: 100%;
    line-height: 30px;
    text-align: center;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 17px;
      text-align: center;
    }
  }
  .foot {
    display: flex;
    align-items: center;
    .btn {
      padding: 8px 25px;
      margin: 10px 15px;
    }
    .cancel {
      color: rgb(71, 71, 71);
      background-color: rgb(244, 244, 244);
    }
    .cancel:hover {
      background-color: var(--primary-white-hover-color);
    }
    .confirm {
      background-color: var(--primary-color);
    }
    .confirm:hover {
      background-color: var(--primary-hover-color);
    }
  }
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
}

.message-enter-active,
.message-leave-active {
  transition: opacity 0.3s ease;
}
</style>
