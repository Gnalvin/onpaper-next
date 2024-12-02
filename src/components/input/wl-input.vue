<template>
  <div class="input-wrap" :class="{ 'light-dark': theme, disable: disable }">
    <div
      class="content"
      @click="handleFocus"
      :class="{
        'err-input-bgc': isShowErr,
        'have-default-slot': slotDefault && isShowErr
      }"
    >
      <span class="slot">
        <slot name="left"></slot>
      </span>
      <input
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        v-model.trim="contentText"
        @input="handleChange"
        @blur="handleBlur"
      />
      <span class="err-message" v-if="isShowErr">
        <span>{{ tipMessage }}</span>
      </span>
      <span
        class="show-password"
        v-if="type === 'password'"
        @click.stop="handleShowPassword"
      >
        <span class="icon hide" v-if="!isShowPassword"></span>
        <span class="icon show" v-else></span>
      </span>
      <span class="slot">
        <slot></slot>
      </span>
    </div>
    <div class="slot">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch, type PropType } from 'vue'
import { verify } from './utils'
import { definePropType } from '../utils/props'
import type { configType } from './type'

const props = defineProps({
  type: {
    type: String as PropType<'password' | 'num' | 'text'>,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: definePropType<string | number>([String, Number]),
    default: ''
  },
  verifyRules: {
    type: Object as PropType<configType>
  },
  maxLen: {
    type: Number,
    default: -1
  },
  theme: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue', 'showTip', 'blur', 'input'])

//判断<slot/>是否有传值
const slotDefault = !!useSlots().default

//双向绑定
const contentText = ref('')
const handleChange = () => {
  contentText.value = String(contentText.value)
  if (props.maxLen >= 0) {
    if (contentText.value.length > props.maxLen) {
      contentText.value = contentText.value.slice(0, props.maxLen)
    }
  }
  if (props.type == 'num') {
    const num = contentText.value.match(/\d+/g)?.join('')
    contentText.value = num ? num : contentText.value
  }
  emit('update:modelValue', contentText.value)
  emit('input', contentText.value)
}

//第一次有值则直接绑定
watch(
  () => props.modelValue,
  (newValue) => {
    contentText.value = String(newValue)
  },
  { immediate: true }
)

// 错误提示信息
const tipMessage = ref<string | undefined>('')

//失去焦点时处理逻辑
const isFocus = ref(false)
const handleBlur = () => {
  isFocus.value = false
  const rule = props.verifyRules?.blur
  const require = props.verifyRules?.require
  tipMessage.value = verify(String(contentText.value), rule, require)
  // 告诉外界 是否展示错误
  const isShowTip = Boolean(tipMessage.value)
  if (isShowTip) emit('showTip', isShowTip)
  emit('blur')
}

//获得焦点时处理逻辑
const handleFocus = () => {
  tipMessage.value = ''
  isFocus.value = true
  emit('showTip', false)
}

const isShowErr = computed(() => {
  return Boolean(tipMessage.value) && !isFocus.value
})

//是否显示密码处理逻辑
const inputType = ref('')
watch(
  () => props.type,
  (value) => {
    inputType.value = value
  },
  { immediate: true }
)
const isShowPassword = ref(false)
const handleShowPassword = () => {
  isShowPassword.value = !isShowPassword.value
  inputType.value = isShowPassword.value ? 'text' : 'password'
}

//对外暴露验证函数
const VerifyCallFn = () => {
  const rule = props.verifyRules?.call
    ? props.verifyRules?.call
    : props.verifyRules?.blur
  let verifyRes = false
  let message = ''

  message = verify(String(contentText.value), rule)
  verifyRes = Boolean(message)

  return {
    verify: !verifyRes,
    message
  }
}

//暴露修改错误信息函数
const ChangeTipMessage = (text: string) => {
  tipMessage.value = text
  isFocus.value = false
}

defineExpose({
  VerifyCallFn,
  ChangeTipMessage
})
</script>

<style scoped lang="less">
.input-wrap {
  --input--height: 42px;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  font-size: 14px;

  .content {
    position: relative;
    display: flex;
    height: var(--input--height);
    box-sizing: border-box;
    border: 1.3px solid #dedede;
    border-radius: 24px;
    background-color: #fff;
    transition: all 0.3s;
    overflow: hidden;
    user-select: none;
    color: #333;
    &:hover {
      border: 1.3px solid var(--primary-hover-color);
    } // 当任意子元素 focus状态时激活
    &:focus-within {
      border-color: var(--primary-hover-color);
      box-shadow: inset 0 0 0 2px var(--primary-transparent-color);
    }

    input {
      // 让input 的宽度 由插槽决定
      min-width: 0;
      flex: 1;
      padding-left: 20px;
      background: transparent;
      line-height: 30px;
      color: #000;
    }
  }
}
.err-message {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  pointer-events: none;
  span {
    padding-right: 15px;
    line-height: 1.286;
    color: var(--primary-err-color);
  }
}
//错误时 背景框颜色
.err-input-bgc {
  border-color: var(--primary-err-color) !important;
  box-shadow: inset 0 0 0 2px var(--primary-transparent-err-color) !important;
}

.show-password {
  display: flex;
  align-items: center;
  padding-right: 15px;
  cursor: pointer;
  .icon {
    width: 14px;
    height: 14px;
  }
  .hide {
    background: no-repeat center url(./assets/preview-close.svg);
  }
  .show {
    background: no-repeat center url(./assets/preview-open.svg);
  }
}
.slot {
  display: flex;
  align-items: center;
}
// 传入了默认插槽时 错误显示的位置
.have-default-slot {
  input {
    color: transparent !important;
  }
  // 让placeholder 也变透明
  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: transparent !important;
  }
  .err-message {
    flex: 1 0 auto;
    position: absolute;
    top: 0;
    bottom: 0;
    padding-left: 20px;
  }
}
.light-dark {
  --primary-hover-color: var(--border-color2-hover);
  --primary-transparent-color: var(--transparent-hover);
  .content {
    background-color: transparent;
    input {
      color: var(--color-regular);
    }
  }
}
.disable {
  cursor: not-allowed;
  .content {
    background-color: #d9d9d9;
    &:hover {
      border: 1.3px solid transparent;
    } // 当任意子元素 focus状态时激活
    &:focus-within {
      border-color: transparent;
      box-shadow: none;
    }
    &::after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
    }
  }
}
</style>
