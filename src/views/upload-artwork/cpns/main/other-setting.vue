<template>
  <div class="design-warp top-mask-layer">
    <div class="container">
      <div class="title">
        {{ isShowDesignCover ? '设计封面 :' : '封面和其他设置 : ' }}
      </div>
      <div class="content" v-show="!isShowDesignCover">
        <div class="preview">
          <div class="cover">
            <img :src="uploadStore.coverUrl" draggable="false" />
            <div class="mask">
              <div class="info">
                <div class="username">
                  {{ mainStore.userName }}
                </div>
                <div class="like-view">
                  <span>
                    <svg
                      t="1648041518654"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3414"
                      width="14"
                      height="14"
                    >
                      <path
                        d="M533.504 268.288q33.792-41.984 71.68-75.776 32.768-27.648 74.24-50.176t86.528-19.456q63.488 5.12 105.984 30.208t67.584 63.488 34.304 87.04 6.144 99.84-17.92 97.792-36.864 87.04-48.64 74.752-53.248 61.952q-40.96 41.984-85.504 78.336t-84.992 62.464-73.728 41.472-51.712 15.36q-20.48 1.024-52.224-14.336t-69.632-41.472-79.872-61.952-82.944-75.776q-26.624-25.6-57.344-59.392t-57.856-74.24-46.592-87.552-21.504-100.352 11.264-99.84 39.936-83.456 65.536-61.952 88.064-35.328q24.576-5.12 49.152-1.536t48.128 12.288 45.056 22.016 40.96 27.648q45.056 33.792 86.016 80.896z"
                        p-id="3415"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  </span>
                  0
                  <span>
                    <svg
                      t="1648040968902"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4778"
                      width="14"
                      height="14"
                    >
                      <path
                        d="M720.398507 959.573333c73.045333 31.317333 136.96-15.317333 129.706666-94.293333l-20.650666-226.218667 174.634666-199.722666c38.144-43.648 19.2-102.229333-37.418666-115.114667l-258.474667-58.794667-135.68-228.010666c-29.738667-49.877333-91.306667-49.92-121.045333 0L315.74784 265.429333 57.273173 324.224C0.953173 337.066667-18.33216 395.648 19.854507 439.338667l174.634666 199.722666-24.021333 264.405334c-5.248 57.770667 44.544 94.037333 97.877333 71.125333l243.626667-104.533333 208.426667 89.472z"
                        fill="#ffffff"
                        p-id="4779"
                      ></path>
                    </svg>
                  </span>
                  0
                </div>
              </div>
            </div>
          </div>
          <div class="edit-cover" @click="showCoverOrPermission">
            <svg
              width="14"
              height="14"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#icon-f9cb32352696ccc)">
                <path
                  d="M30.9995 8.99902L38.9995 16.999"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.99953 31.999L35.9994 4L43.9995 11.999L15.9995 39.999L5.99951 41.999L7.99953 31.999Z"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M30.9995 8.99902L38.9995 16.999"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.99951 31.999L15.9995 38.999"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.9995 34.999L34.9995 12.999"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="icon-f9cb32352696ccc">
                  <rect width="48" height="48" fill="#FFF" />
                </clipPath>
              </defs>
            </svg>
            编辑封面
          </div>
        </div>
        <PermissionSetting @permission="handlePermission"></PermissionSetting>
      </div>
      <DesignCover
        v-show="isShowDesignCover"
        ref="designCoverCpn"
      ></DesignCover>
      <div class="foot">
        <ElButton class="save" @click="handleSave">
          {{ isShowDesignCover ? '剪裁' : '保存' }}
        </ElButton>
        <div class="cancel" @click="handleCancel">
          {{ isShowDesignCover ? '返回' : '取消' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useMainStore from '@/stores/module/main'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import ElButton from '@/components/button/el-button.vue'
import DesignCover from '../handle/design-cover.vue'
import PermissionSetting from '../handle/permission-setting.vue'
import { notification } from '@/components/notification'

type settingType = {
  whoSee: string
  comment: string
  adult: boolean
  copyright: string
}

const emits = defineEmits(['close', 'save', 'upload'])
const uploadStore = useUploadArtworkStore()
const mainStore = useMainStore()

const isShowDesignCover = ref(false)
const showCoverOrPermission = () => {
  isShowDesignCover.value = !isShowDesignCover.value
}

const designCoverCpn = ref<InstanceType<typeof DesignCover>>()
const handleSave = () => {
  // 如果是在编辑封面时点击 则关闭 编辑页面
  if (isShowDesignCover.value) {
    isShowDesignCover.value = false
    designCoverCpn.value!.saveImg()
    return
  }
  if (uploadStore.uploadFormData.adult == null) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '请填写是否包含未成年敏感内容'
    })
    return
  }
  emits('upload')
  emits('close')
}

// 修改权限配置
const handlePermission = (setting: settingType) => {
  uploadStore.uploadFormData = {
    ...uploadStore.uploadFormData,
    ...setting
  }
}

//关闭组件
const handleCancel = () => {
  // 如果是在编辑封面时点击 则关闭 编辑页面
  if (isShowDesignCover.value) {
    isShowDesignCover.value = false
    return
  }
  emits('close')
}
</script>

<style scoped lang="less">
@import '../css/common.less';

.design-warp {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  border-radius: 12px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  user-select: none;
  .title {
    border-radius: 12px 12px 0 0;
    font-size: 18px;
    font-weight: 500;
    line-height: 35px;
    padding: 5px 0 0 30px;
    color: var(--color-text1);
  }
  .content {
    display: flex;
    margin: 10px 35px 0px 35px;
    width: 800px;
    border: 1px solid #d7e4ff;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .edit-cover {
    display: flex;
    font-size: 13px;
    margin: 20px auto;
    font-weight: 500;
    cursor: pointer;
    color: #409eff;
    svg {
      stroke: #409eff;
      margin-right: 5px;
    }
    &:hover {
      color: var(--color-text4-hover);
    }
  }
  .foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
    width: 100%;
    font-size: 12px;
    .save {
      padding: 8px 23px;
    }
    .cancel {
      font-weight: 500;
      cursor: pointer;
      margin-left: 20px;
      margin-right: 60px;
    }
  }
}
</style>
