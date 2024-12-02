<template>
  <div class="field">
    <div class="label">社交链接</div>
    <div class="sns-wrap">
      <template v-for="(sns, index) in snsLinkRef" :key="sns.label">
        <div class="item">
          <WLInput
            v-model="sns.value"
            class="input"
            :placeholder="urlHeader[sns.label].tip"
          >
            <template #left>
              <span class="url-header"> {{ urlHeader[sns.label].url }}</span>
            </template>
          </WLInput>
          <el-select
            v-model="sns.label"
            class="select"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in snsOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="icon" @click="handleDelete(index)">
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 11L40 11"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 5L30 5"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 17H36V40C36 41.6569 34.6569 43 33 43H15C13.3431 43 12 41.6569 12 40V17Z"
                fill="none"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M20 25L28 33"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M28 25L20 33"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </template>
      <div class="add-link" @click="handleAddRow" v-show="snsOption.length">
        继续添加+
      </div>
    </div>
    <div class="tip">
      <Transition appear>
        <SuccessError
          v-if="!isFastShow"
          class="message"
          :message="tipMessage"
          :tipType="tipType"
          :showBtn="true"
          :showCancel="true"
          @cancel="handleReSet"
          @save="handleSave"
        ></SuccessError>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, type PropType, ref, watch } from 'vue'
import type { snsName } from '@/stores/module/setting/edit-profile/type'
import type { messageType, propMesType } from '../type'
import { deepClone } from '@/utils/deep-clone'
import WLInput from '@/components/input/wl-input.vue'
import SuccessError from './success-error.vue'

type snsListType = { value: string; label: snsName }
const emits = defineEmits(['update', 'reSet'])
const props = defineProps({
  snsLink: {
    type: Array as PropType<snsListType[]>,
    require: true
  },
  tipMes: {
    type: Object as PropType<propMesType>,
    default: () => ({
      tipType: 'unknown',
      mes: ''
    })
  }
})
// 初始化 snsLink
const snsLinkRef = ref<snsListType[]>(deepClone(props.snsLink!))
// sns下拉选项
const snsOption = ref<snsListType[]>([])

//所有的 labels
const labels: snsName[] = [
  'Weibo',
  'Bilibili',
  'QQ',
  'WeChat',
  'Pixiv',
  'Twitter'
]

//重置 option 选项
const resetSnsOption = () => {
  for (const label of labels) {
    const isSnsHave = snsLinkRef.value.findIndex((item) => item.label === label)
    const isOptHave = snsOption.value.findIndex((item) => item.label === label)
    // 如果 标签 不在 sns 也不在 opt 则添加到opt
    if (isSnsHave === -1 && isOptHave === -1) {
      snsOption.value.push({ value: label, label: label })
    }
    // 如果标签 在 sns 也在 opt 则删除 opt的
    if (isSnsHave > -1 && isOptHave > -1) {
      snsOption.value.splice(isOptHave, 1)
    }
  }
}
//首次加载重置选项
resetSnsOption()

// 用户选择了选项
const handleSelectChange = () => {
  resetSnsOption()
}
//添加一行
const handleAddRow = () => {
  for (const label of labels) {
    const isSnsHave = snsLinkRef.value.findIndex((item) => item.label === label)
    if (isSnsHave === -1) {
      snsLinkRef.value.push({ value: '', label: label })
      resetSnsOption()
      break
    }
  }
}

const urlHeader = {
  Pixiv: { url: 'pixiv.net/users/', tip: '补充主页地址' },
  QQ: { url: '', tip: '填写QQ号' },
  Twitter: { url: 'twitter.com/', tip: '补充主页地址' },
  Weibo: { url: 'weibo.com/u/', tip: '补充主页地址' },
  Bilibili: { url: 'space.bilibili.com/', tip: '补充主页地址' },
  WeChat: { url: '', tip: '填写微信号' }
}

const tipType = ref<messageType>('unknown')
const tipMessage = ref('')

watchEffect(() => {
  if (props.tipMes.profileType === 'snsLink') {
    tipType.value = props.tipMes.tipType
    tipMessage.value = props.tipMes.mes
  }
})

// 把sns 数据转成上传需要的格式
const formatUploadData = () => {
  const temp: Record<string, string> = {}
  snsLinkRef.value.forEach((item) => {
    temp[item.label] = item.value
  })
  return temp
}
//验证数据是否符合格式
const verifySnsData = () => {
  for (const sns of snsLinkRef.value) {
    if (sns.label === 'WeChat' && sns.value.length > 20) {
      tipType.value = 'fail'
      tipMessage.value = '微信号长度在6-20之间'
      return false
    }
    if (sns.label === 'Twitter' && sns.value.length > 30) {
      tipType.value = 'fail'
      tipMessage.value = 'Twitter ID 长度不能大于30个字符'
      return false
    }
    if (sns.value.length > 15) {
      tipType.value = 'fail'
      tipMessage.value = `${sns.label} 长度不能大于15个字符`
      return false
    }
  }
  return true
}

const handleSave = () => {
  if (!verifySnsData()) return
  const data = { profileType: 'snsLink', snsData: formatUploadData() }
  emits('update', data)
}

const handleReSet = () => {
  snsLinkRef.value = deepClone(props.snsLink)
  resetSnsOption()
}

const handleDelete = (index: number) => {
  snsLinkRef.value.splice(index, 1)
  resetSnsOption()
}

//第一次显示不展示 按钮
const isFastShow = ref(true)
watch(
  [snsLinkRef, snsOption],
  () => {
    isFastShow.value = false
    // 每次修改重置状态
    tipType.value = 'unknown'
    tipMessage.value = ''
    emits('reSet')
  },
  {
    deep: true
  }
)
</script>

<style scoped lang="less">
@import '../css/common.less';

.sns-wrap {
  margin-bottom: 20px;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .input {
      width: 330px;
    }
    .url-header {
      color: var(--color-regular);
      margin-left: 10px;
      font-weight: 500;
    }
    .select {
      margin-left: 30px;
      width: 110px;
    }
  }
  .add-link {
    position: relative;
    top: 4px;
    font-size: xx-small;
    text-align: left;
    width: 60px;
    line-height: 10px;
    margin-top: 15px;
    color: #409eff;
    cursor: pointer;
  }
}
.message {
  margin-left: 160px;
}
.icon {
  margin-left: 25px;
  cursor: pointer;
  svg {
    stroke: #cf2640;
  }
}
:deep(.input) {
  .content {
    input {
      padding-left: 5px;
    }
    input::-webkit-input-placeholder {
      color: var(--color-text3-hover);
      font-size: 12px;
    }
  }
}
</style>
