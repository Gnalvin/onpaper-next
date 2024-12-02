<template>
  <div class="field">
    <div class="label">其他介绍</div>
    <div class="item">
      <el-input
        v-model="introduce"
        maxlength="800"
        show-word-limit
        :autosize="{ minRows: 9, maxRows: 10 }"
        type="textarea"
        placeholder=""
      />
    </div>
    <div class="tip">
      <Transition appear>
        <SuccessError
          v-if="!isFastShow"
          class="message"
          :message="tipMessage"
          :tipType="tipType"
          :show-btn="true"
          @save="handleSave"
        ></SuccessError>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, type PropType } from 'vue'
import type { messageType, propMesType } from '../type'
import SuccessError from './success-error.vue'
const props = defineProps({
  text: {
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
const introduce = ref(props.text)

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

const handleSave = () => {
  const data = { profileType: 'introduce', profile: introduce.value }
  emits('update', data)
}

const isFastShow = ref(true)
watch(introduce, (text) => {
  // 最多两个回车
  introduce.value = text.replace(/\n{3,}/g, '\n\n')
  isFastShow.value = false
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
})

watchEffect(() => {
  if (props.tipMes.profileType === 'introduce') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';

.el-textarea {
  width: 500px;
  font-size: 13px;
  margin-bottom: 20px;
}
.message {
  margin-left: 170px;
}
.tip {
  height: 20px;
}
</style>
