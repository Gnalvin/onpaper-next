<template>
  <div class="local-select">
    <el-cascader
      v-model="address"
      :options="city_option"
      :props="{ expandTrigger: 'hover' }"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { city_option } from './config'
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue', 'change'])

// 第一次显示的值为服务器传回
const address = ref<string[]>([])
watch(
  () => props.modelValue,
  () => {
    address.value = props.modelValue.split(',')
  },
  {
    immediate: true
  }
)
const handleChange = () => {
  emits('change', address.value.join(','))
  emits('update:modelValue', address.value.join(','))
}
</script>

<style scoped lang="less">
:deep(.el-input__inner) {
  width: 280px;
  --el-input-inner-height: 40px;
}
</style>
