<template>
  <div class="field">
    <div class="label">倾向工作</div>
    <div class="item">
      <el-radio-group v-model="exceptWork" @change="handleChange">
        <el-radio label="全职工作">全职工作</el-radio>
        <el-radio label="约稿创作">约稿创作</el-radio>
        <el-radio label="项目外包">项目外包</el-radio>
        <el-radio label="暂不考虑">暂不考虑</el-radio>
      </el-radio-group>
      <SuccessError :message="tipMessage" :tipType="tipType"></SuccessError>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, ref, type PropType } from 'vue'
import type { exceptWorkType, messageType, propMesType } from '../type'
import SuccessError from './success-error.vue'
const props = defineProps({
  workType: {
    type: String as PropType<exceptWorkType>,
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
const exceptWork = ref<exceptWorkType>(props.workType)

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

const handleChange = (val: string | number | boolean) => {
  // 每次修改重置状态
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
  const data = { profileType: 'exceptWork', profile: val }
  emits('update', data)
}

watchEffect(() => {
  if (props.tipMes.profileType === 'exceptWork') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
