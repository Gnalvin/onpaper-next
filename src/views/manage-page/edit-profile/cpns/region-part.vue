<template>
  <div class="field">
    <div class="label">所在地区</div>
    <div class="item">
      <LocalSelect
        class="local-select"
        v-model="regionRef"
        @change="handleChange"
      ></LocalSelect>
      <SuccessError :message="tipMessage" :tipType="tipType"></SuccessError>
    </div>
  </div>
</template>

<script setup lang="ts">
import LocalSelect from '@/components/local-select/src/local-select.vue'
import { ref, watchEffect, type PropType } from 'vue'
import type { messageType, propMesType } from '../type'
import SuccessError from './success-error.vue'

const props = defineProps({
  region: {
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

const regionRef = ref(props.region)

const handleChange = (region: string) => {
  // 每次修改重置状态
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
  const data = { profileType: 'region', profile: region }
  emits('update', data)
}

watchEffect(() => {
  if (props.tipMes.profileType === 'region') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
