<template>
  <div class="top-mask-layer" @click.self="handleCloseShow">
    <div class="upload-panel">
      <div class="container">
        <div class="title">
          <span>背景设置</span>
        </div>
        <div class="upload-handle">
          <div class="preview" :style="styleBgcImg">
            <div v-if="!styleBgcImg.backgroundImage" class="tip">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.0654 27.8812L23.9999 20.9238L31.1318 28.0002"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 38.0001V24.4619"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="tip-text">点击上传图片</div>
            </div>
            <UploadUtil @fileData="handleFileData"></UploadUtil>
            <div class="type-warn" v-if="tipNoImg">
              上传的必须是图片..._(:з」∠)_
            </div>
            <div class="type-warn" v-if="tipTooLarge">
              上传的图片太大了... _(:з」∠)_
            </div>
            <div class="type-warn" v-if="tipNoFileData">请点击下方上传图片</div>
          </div>
        </div>
        <div class="require-handle">
          <div class="require">
            <ul>
              <li>
                <span>图片格式</span>
                <span>JPEG / PNG </span>
              </li>
              <li>
                <span>图片大小</span>
                <span>小于10MB</span>
              </li>
              <li>
                <span>最佳尺寸</span>
                <span>1920 × 1080px</span>
              </li>
            </ul>
            <div class="warn">
              <span>
                <!-- <a href="#"> 社区规则 </a
                >中 -->
                请不要上传禁止投稿的图片。如果您上传了相关图片，设置将会失效。
              </span>
            </div>
          </div>
          <div class="handle">
            <ElButton
              class="confirm btn"
              :disable="tipNoImg || tipTooLarge || tipNoFileData"
              @click="uploadBanner"
              >同意并上传</ElButton
            >
            <ElButton :cancel="true" class="cancel btn" @click="handleCloseShow"
              >取消</ElButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, type CSSProperties } from 'vue'
import useMainStore from '@/stores/module/main'
import useUserProfileStore from '@/stores/module/user-home/module/profile'
import UploadUtil from '@/components/upload/src/upload-util.vue'
import ElButton from '@/components/button/el-button.vue'
import type { IFilePayload } from '@/components/upload/type'
import { notification } from '@/components/notification'
import { verifySize } from '@/utils/handle-img'

const mainStore = useMainStore()
const userProfileStore = useUserProfileStore()
const emits = defineEmits(['close'])
const handleCloseShow = () => {
  emits('close')
}

const styleBgcImg = reactive<CSSProperties>({})
const tipTooLarge = ref(false)
const tipNoImg = ref(false)
const tipNoFileData = ref(false)
let fileData: File | null = null
const handleFileData = (payload: IFilePayload) => {
  //获取上传凭证
  mainStore.getSTSTokenAction({ type: 'banners', count: 1 })

  // 每次接受到数据 重置提示
  tipTooLarge.value = false
  tipNoImg.value = false
  tipNoFileData.value = false

  //图片太大
  if (payload.isLarge) {
    tipTooLarge.value = true
    styleBgcImg.backgroundImage = ''
    return
  }
  // 如果是图片类型 则显示预览
  if (payload.isImage) {
    const img = new Image()
    img.src = payload.url
    img.onload = () => {
      if (!verifySize(img.width, img.height, 300)) {
        notification({
          type: 'error',
          title: '上传图片',
          message: '图片尺寸太大或太小啦'
        })
        return
      } else {
        // 接收 上传来的 url 赋值给 预览图片url
        styleBgcImg.backgroundImage = `url('${payload.url}')`
        fileData = payload.fileData
        tipNoImg.value = false
        tipTooLarge.value = false
        setTimeout(() => {
          // 释放url 对象
          URL.revokeObjectURL(payload.url)
        }, 2000)
      }
    }
  } else {
    // 不是图片 显示提示
    tipNoImg.value = true
    styleBgcImg.backgroundImage = ''
  }
}

//上传图片函数
const uploadBanner = () => {
  if (!fileData) {
    tipNoFileData.value = true
    return
  }
  userProfileStore.uploadBannerAction(fileData)
  emits('close')
}
</script>

<style scoped lang="less">
.upload-panel {
  width: 440px;
  margin: 13vh auto;
}
.container {
  border-radius: 24px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  color: var(--color-text1);
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 16px;
  }
}
.upload-handle {
  color: rgb(92, 92, 92);
  .preview {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 220px;
    background-color: var(--surface-color2);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: none;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: var(--surface-color2-hover);
    }
  }
  .tip {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: var(--color-text2);
    width: 100%;
    svg {
      stroke: var(--color-text2);
    }
    .tip-text {
      margin-top: 10px;
    }
  }
}

.require-handle {
  padding: 16px 24px;
  margin: 0px 24px;
}
.require {
  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    li {
      display: flex;
      margin: 0px 0px 16px;
      color: var(--color-text2);
      span:first-child {
        font-weight: bold;
        flex-basis: 50%;
        color: var(--color-text1);
      }
    }
  }
  .warn {
    display: flex;
    background-color: var(--surface-color2);
    border-radius: 8px;
    padding: 16px;
    margin: 10px 0px 36px;
    span {
      color: var(--color-text2);
      font-size: 14px;
      a {
        text-decoration: none;
        color: var(--primary-middle-color);
      }
    }
  }
}
.handle {
  display: flex;
  flex-direction: column;
  .btn {
    margin: 10px 0;
    padding: 10px;
  }
}
.type-warn {
  position: absolute;
  top: 0;
  width: 414px;
  background-color: rgb(251, 234, 231);
  color: rgb(255, 40, 0);
  text-align: center;
  padding: 12px;
  font-weight: bold;
}
</style>
