<template>
  <div class="field">
    <div class="label">
      常用软件<span>(按回车创建常用的软件, 最多添加3个)</span>
    </div>
    <div class="item">
      <TagInput
        :max-tags="3"
        :max-text="10"
        :auto-complete="softwareList"
        :focus-tip-all="true"
        :model-value="tags"
        @change="handleChange"
      ></TagInput>
      <Transition appear>
        <SuccessError
          v-if="!isFastShow"
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
import { softwareList } from '../config/software-list'
import { computed, ref, watchEffect, type PropType } from 'vue'
import TagInput from '@/components/tag-input/tag-input.vue'
import SuccessError from './success-error.vue'
import { deepClone } from '@/utils/deep-clone'
import type { messageType, propMesType } from '../type'

const props = defineProps({
  software: {
    type: Array as PropType<string[]>,
    default: () => []
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

const tags = ref<string[]>(deepClone(props.software))

const isFastShow = ref(true)
const handleChange = (payload: string[]) => {
  isFastShow.value = false
  tipType.value = 'unknown'
  tipMessage.value = ''
  emits('reSet')
  tags.value = payload
}

const strTags = computed(() => ({
  profileType: 'software',
  profile: tags.value.join(',')
}))

const handleSave = () => {
  emits('update', strTags.value)
}

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

watchEffect(() => {
  if (props.tipMes.profileType === 'software') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})
</script>

<style scoped lang="less">
@import '../css/common.less';
</style>
