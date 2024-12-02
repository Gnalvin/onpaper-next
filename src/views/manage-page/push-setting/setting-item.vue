<template>
  <div class="item">
    <div class="title">
      <span>{{ title.head }}</span>
      <span class="tip">{{ title.tip }}</span>
    </div>
    <div class="chose">
      <el-radio-group v-model="val" @change="handleChange">
        <el-radio :label="1">所有人</el-radio>
        <el-radio :label="2">我关注的人</el-radio>
        <el-radio :label="0">{{ zeroText }}</el-radio>
      </el-radio-group>
      <SuccessError :message="tipMessage" :tipType="tipType"></SuccessError>
    </div>
  </div>
</template>

<script setup lang="ts">
import SuccessError from '../edit-profile/cpns/success-error.vue'
import { ref, type PropType } from 'vue'
type status = 'success' | 'fail' | 'unknown'
type ISetting = 'like' | 'comment' | 'collect' | 'message' | 'follow'
const emits = defineEmits(['update:modelValue', 'update'])

const props = defineProps({
  title: {
    type: Object as PropType<{ head: string; tip: string }>,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  zeroText: {
    type: String,
    default: '不接收通知'
  },
  settingType: {
    type: String as PropType<ISetting>,
    required: true
  }
})

const val = ref(props.modelValue)

const handleChange = (label: string | number | boolean) => {
  emits('update:modelValue', label)
  tipMessage.value = ''
  tipType.value = 'unknown'
  emits('update', props.settingType)
}

const tipMessage = ref('')
const tipType = ref<status>('unknown')
const changeTip = (msg: string, type: string) => {
  tipMessage.value = msg
  tipType.value = type as status
}
defineExpose({ changeTip })
</script>

<style scoped lang="less">
.item {
  padding-bottom: 10px;
  padding-top: 20px;
  border-bottom: 1px solid var(--transparent-hover);
  .title {
    display: flex;
    flex-direction: column;
    font-size: 18px;
    font-weight: 600;
    .tip {
      margin-top: 5px;
      font-size: 14px;
      font-weight: 500;
      color: var(--black-color);
    }
  }
  .chose {
    margin: 15px 0;
    display: flex;
    align-items: center;
  }
}
</style>
