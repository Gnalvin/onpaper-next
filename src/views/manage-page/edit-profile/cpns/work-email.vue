<template>
  <div class="field">
    <div class="label">工作邮箱</div>
    <div class="item">
      <WLInput class="input" v-model="workEmail" />
      <span class="default-email" @click="useDefaultEmail"> 使用登录邮箱 </span>
      <Transition appear>
        <SuccessError
          v-if="!isFastShow"
          :message="tipMessage"
          :tipType="tipType"
          :showBtn="true"
          @save="handleSave"
        ></SuccessError>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, type PropType } from 'vue'
import WLInput from '@/components/input/wl-input.vue'
import useEditProfileStore from '@/stores/module/setting/edit-profile'
import SuccessError from './success-error.vue'
import { notification } from '@/components/notification'
import type { messageType, propMesType } from '../type'
// eslint-disable-next-line no-useless-escape
const rule = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const editProfileStore = useEditProfileStore()
const props = defineProps({
  email: {
    type: String,
    default: ''
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
const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

const workEmail = ref(props.email)

// 一次展示 不显示 保存按钮
const isFastShow = ref(true)
// 变动时 重置状态
watch(workEmail, () => {
  isFastShow.value = false
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
})

// 上传的数据
const updateData = computed(() => {
  return { profileType: 'workEmail', profile: workEmail.value }
})

//展示提示信息
watchEffect(() => {
  if (props.tipMes.profileType === 'workEmail') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})

//发送数据
const handleSave = () => {
  const verify = rule.test(workEmail.value) || workEmail.value === ''
  if (verify) {
    emits('update', updateData.value)
  } else {
    tipType.value = 'fail'
    tipMessage.value = '邮箱格式不正确'
  }
}
const useDefaultEmail = () => {
  if (!editProfileStore.email) {
    notification({
      type: 'error',
      title: '修改邮箱',
      message: '没有绑定登陆邮箱'
    })
  }
  if (workEmail.value === editProfileStore.email) return
  workEmail.value = editProfileStore.email
  emits('update', updateData.value)
}
</script>

<style scoped lang="less">
@import '../css/common.less';
.default-email {
  height: 17px;
  font-size: 13px;
  font-weight: 500;
  margin-left: 15px;
  color: var(--color-regular);
  cursor: pointer;
}
</style>
