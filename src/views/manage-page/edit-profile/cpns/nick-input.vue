<template>
  <div class="field">
    <div class="label">昵称<span>(不能特殊符号, 2~12位长度)</span></div>
    <div class="item">
      <WLInput
        v-model="userName"
        :maxLen="12"
        placeholder="起个好听名字吧"
        class="input"
        @blur="handleBlur"
        @input="handleInput"
      >
        <div class="text-count">{{ textCount }} / 12</div>
      </WLInput>
      <SuccessError :message="tipMessage" :tipType="tipType"></SuccessError>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, type PropType } from 'vue'
import { userNameVerifyRequest } from '@/service/setting/edit-profile/index'
import type { propMesType } from '../type'
import WLInput from '@/components/input/wl-input.vue'
import SuccessError from './success-error.vue'
const rules = /^[\u4e00-\u9fa5A-Za-z0-9-_\uAC00-\uD7A3\u0800-\u4e00]{2,12}$/
type messageType = 'success' | 'fail' | 'unknown'

const props = defineProps({
  originalUserName: {
    type: String,
    default: () => ''
  },
  tipMes: {
    type: Object as PropType<propMesType>,
    default: () => ({
      tipType: 'unknown',
      mes: ''
    })
  }
})

const emits = defineEmits(['update', 'reSet'])
const userName = ref(props.originalUserName)

// name input 的 字符统计
const textCount = ref(0)
watch(
  () => userName.value,
  (newValue) => {
    textCount.value = newValue.length
  },
  { immediate: true }
)

//失去焦点时验证
const handleBlur = () => {
  verifyText()
}

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

const verifyText = async () => {
  // 验证长度
  const lengthName = userName.value.length
  if (lengthName < 2) {
    tipType.value = 'fail'
    tipMessage.value = '字数太少了'
    return
  }
  // 验证是否有特殊字符
  if (!rules.test(userName.value) && lengthName !== 0) {
    tipType.value = 'fail'
    tipMessage.value = '混入了特殊字符'
    return
  }
  if (userName.value === props.originalUserName) return
  //发送网络请求
  const { status } = await userNameVerifyRequest(userName.value)
  if (status === 1002) {
    tipType.value = 'fail'
    tipMessage.value = '此用户名已被注册'
    return
  }
  // 用户不存在
  if (status === 1003) {
    // 前面步骤都成功 执行 改名
    const data = { profileType: 'userName', profile: userName.value }
    emits('update', data)
  }
}

// 每次修改重置状态
const handleInput = () => {
  emits('reSet')
  tipType.value = 'unknown'
  tipMessage.value = ''
}

watchEffect(() => {
  if (props.tipMes.profileType === 'userName') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';
.text-count {
  margin-right: 25px;
  color: var(--color-regular);
}
</style>
