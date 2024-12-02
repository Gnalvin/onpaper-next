<template>
  <div class="setting">
    <div class="item">
      <div class="title">
        作品标题 : <span v-if="titleWarn" class="warn">必填</span>
      </div>
      <WlInput
        class="input"
        :max-len="15"
        v-model="artworkInfo.title"
      ></WlInput>
    </div>
    <div class="item">
      <div class="title">作品描述 :</div>
      <ElInput
        maxlength="350"
        show-word-limit
        :autosize="{ minRows: 4, maxRows: 4 }"
        type="textarea"
        placeholder=""
        v-model="artworkInfo.description"
      />
    </div>
    <div class="item">
      <div class="title">
        分区 :<span v-if="zoneWarn" class="warn">必填</span>
      </div>
      <ElSelect
        v-model="artworkInfo.zone"
        clearable
        placeholder="将在选择的分区中展示作品"
      >
        <el-option
          v-for="item in zoneOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </ElSelect>
    </div>
    <div class="item">
      <div class="title">
        标签 : <span v-if="tagWarn" class="warn">必填</span>
      </div>
      <TagInput
        class="tag"
        v-model="artworkInfo.tags"
        :max-tags="10"
        :max-text="20"
      ></TagInput>
    </div>
    <div class="btn">
      <ElButton class="upload" @click="handleSave">发布</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { zoneOptions } from '@/const/zone-config'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import WlInput from '@/components/input/wl-input.vue'
import TagInput from '@/components/tag-input/tag-input.vue'
import ElButton from '../../../../components/button/el-button.vue'
import { notification } from '@/components/notification'

const uploadStore = useUploadArtworkStore()
const emits = defineEmits(['fileWarn', 'goToImg', 'showCover'])

// 作品信息formData
const artworkInfo = reactive({
  title: '',
  description: '',
  zone: '',
  tags: []
})

watch(artworkInfo, (info) => {
  artworkInfo.description = info.description.replace(/\n{3,}/g, '\n\n')
  uploadStore.uploadFormData = { ...uploadStore.uploadFormData, ...artworkInfo }
})

//是否展示 必填
const isVerify = ref(true)
const titleWarn = computed(() => {
  // 点击一次后出现 必填项目 输入则取消必填显示
  if (!isVerify.value && artworkInfo.title.length === 0) return true
  return false
})
const zoneWarn = computed(() => {
  if (!isVerify.value && artworkInfo.zone.length === 0) return true
  return false
})
const tagWarn = computed(() => {
  if (!isVerify.value && artworkInfo.tags.length === 0) return true
  return false
})

const verifyData = () => {
  isVerify.value = true
  const { title, zone, tags } = artworkInfo

  // 验证是否填写了标题
  if (title.length === 0) {
    isVerify.value = false
  }
  //是否选择了分区
  if (zone.length === 0) {
    isVerify.value = false
  }
  //是否填写了标签
  if (tags.length === 0) {
    isVerify.value = false
  }

  // 是否上传了图片
  if (uploadStore.urlList.length === 0) {
    emits('fileWarn', true)
    notification({
      type: 'error',
      title: '上传作品',
      message: '请点击添加作品'
    })
    isVerify.value = false
    return
  }

  // 如果文字 没填写完成 提示
  if (!isVerify.value) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '请补充必填项目'
    })
    return
  }
  // 如果有作品 上传失败
  if (uploadStore.getUploadFailItem !== undefined) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '有图片上传失败, 请删除后重试',
      duration: 0,
      showClose: true
    })
    emits('goToImg', uploadStore.getUploadFailItem)
    isVerify.value = false
    return
  }

  // 如果还有图片等等上传
  if (uploadStore.uploadingCount) {
    notification({
      type: 'error',
      title: '作品上传',
      message: '请耐心等待所有图片上传完成'
    })
    // --------- 以下代码为滚动 到 正在上传的元素
    const index = uploadStore.getUploadingItem
    if (index !== undefined) emits('goToImg', index)
    isVerify.value = false
    return
  }
}

const handleSave = () => {
  verifyData()
  if (!isVerify.value) return

  emits('showCover')
}
</script>

<style scoped lang="less">
.setting {
  position: sticky;
  top: 90px;
  flex: 1;
  margin-left: 20px;
  max-width: 330px;
  height: 100%;
  color: #5f5f5f;
}

.item {
  box-shadow: 0px 0px 6px#c7c7c7;
  margin-bottom: 15px;
  background-color: var(--bgc);
  transition: box-shadow 0.3s ease;
  color: var(--color-regular);
  transition: all 0.3s ease;
  .title {
    font-size: 14px;
    font-weight: bold;
    height: 30px;
    padding-left: 10px;
    padding-top: 3px;
    line-height: 30px;
    background-color: var(--surface-color2);
  }
  &:focus-within {
    box-shadow: 0px 0px 6px #9086ff;
  }
}

.input {
  font-size: 21px;
  font-weight: 400;
  padding: 5px 0px;

  :deep(.content) {
    border-radius: 0px;
    border: none;
    background-color: var(--bgc);
    input {
      color: var(--color-regular);
    }
    &:hover {
      border: none;
    }
    &:focus-within {
      box-shadow: none;
    }
  }
}
.tag {
  min-height: 50px;
  border-radius: 0px;
  border-color: transparent !important;
  &:focus-within {
    border: 1px solid transparent !important;
  }
  :deep(.max-count) {
    right: 20px;
    top: -25px;
  }
}
:deep(.el-textarea__inner) {
  border-radius: 0px;
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }
}

.el-select {
  width: 100%;
  :deep(.el-input) {
    --el-input-height: 50px;
    .el-input__wrapper {
      --el-select-input-focus-border-color: transparent;
      box-shadow: none;
      border-radius: 0px;
    }
    .el-input__inner {
      font-size: 13px;
      font-weight: 500;
      &::-webkit-input-placeholder {
        color: var(--color-regular);
      }
    }
  }
}

.btn {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  .upload {
    border-radius: 5px;
    padding: 6px 30px;
  }
}
.warn {
  margin-left: 10px;
  border-radius: 4px;
  font-weight: 400;
  font-size: 10px;
  color: #fff;
  padding: 1px 4px;
  background-color: tomato;
}
</style>
