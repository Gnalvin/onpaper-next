<template>
  <div class="field">
    <div class="label">生日</div>
    <div class="item">
      <DateSelect v-model="birthdayRef"></DateSelect>
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
import { ref, watch, watchEffect, computed, type PropType } from 'vue'
import DateSelect from '@/components/date-select/src/date-select.vue'
import type { birthdayType, propMesType, messageType } from '../type'
import SuccessError from './success-error.vue'

const props = defineProps({
  birthday: {
    type: Object as PropType<birthdayType>,
    default: () => ({ year: '', month: '', day: '' })
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

const birthdayRef = ref(props.birthday)

// 一次展示 不显示 保存按钮
const isFastShow = ref(true)
watch(
  birthdayRef,
  () => {
    isFastShow.value = false
    emits('reSet')
    tipType.value = 'unknown'
    tipMessage.value = ''
  },
  { deep: true }
)

watchEffect(() => {
  if (props.tipMes.profileType === 'birthday') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
const formatData = computed(() => {
  const { year, month, day } = birthdayRef.value
  const str = `${year}-${month}-${day}`
  const data = { profileType: 'birthday', profile: str }
  return data
})

const handleSave = () => {
  const { year, month, day } = birthdayRef.value
  if (year && month && day) {
    emits('update', formatData.value)
    return
  }
  tipType.value = 'fail'
  tipMessage.value = '请填写完整生日'
}
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
