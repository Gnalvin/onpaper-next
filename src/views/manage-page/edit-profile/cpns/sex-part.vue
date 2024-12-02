<template>
  <div class="field">
    <div class="label">性别</div>
    <div class="item">
      <el-radio-group v-model="sexVal" @change="handleChange">
        <el-radio label="man">男生</el-radio>
        <el-radio label="woman">女生</el-radio>
        <el-radio label="privacy">保密</el-radio>
      </el-radio-group>
      <SuccessError :message="tipMessage" :tipType="tipType"></SuccessError>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, type PropType } from 'vue'
import SuccessError from './success-error.vue'
import type { sex, messageType, propMesType } from '../type'

const props = defineProps({
  birthday: {
    type: String as PropType<sex>,
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
const sexVal = ref<sex>(props.birthday)

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

const handleChange = () => {
  // 每次修改重置状态
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
  const data = { profileType: 'sex', profile: sexVal.value }
  emits('update', data)
}

watchEffect(() => {
  if (props.tipMes.profileType === 'sex') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
