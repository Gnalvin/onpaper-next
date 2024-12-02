<template>
  <div class="view">
    <div
      class="upload-warp"
      v-show="isShowUploadTip"
      :class="{ warn: fileWarn }"
      ref="uploadWrpEL"
    >
      <div class="upload">
        <span class="big-tip">点击上传原创作品</span>
        <span class="tip">
          图片要求宽高尺寸不小于 500 像素 , 不超过 10000 像素
        </span>
        <span class="tip">{{ tip }}</span>
      </div>
      <UploadUtil
        :fileSize="32"
        :multiple="true"
        :maxCount="15"
        uploadKey="artwork"
        @fileData="handleImgData"
        ref="uploadUtils"
      ></UploadUtil>
    </div>
    <div class="img-warp" v-show="!isShowUploadTip" ref="imgWarp" id="imgWarp">
      <TransitionGroup appear>
        <template v-for="(item, index) in urlList" :key="item.url">
          <div class="content">
            <div class="uploading" v-show="!item.isPut">
              <div v-if="item.uploadIng">
                <el-progress
                  color="#06f"
                  :style="{ width: '300px' }"
                  :percentage="item.progress"
                  :show-text="false"
                  :stroke-width="5"
                />
                <div class="text">
                  <span v-if="!item.speed"> 等待上传... </span>
                  <span v-else> 上传中...速度: {{ item.speed }} </span>
                </div>
              </div>
              <div v-if="item.isFail" class="fail">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 31L21 26L28 20L19 15L20 9.19942C18.4999 8.43256 16.8004 8 15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C31.1996 8 29.5001 8.43256 28 9.19942"
                    stroke="#fc638c"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                图片上传失败, 请删除后重新上传
              </div>
            </div>
            <img
              @load="imgOverLoad($event, index)"
              :src="item.url"
              :class="{ border: imgIndex == index }"
            />
            <div
              class="edit-img"
              @click.stop="showMenu(index)"
              :class="{ 'show-edit': imgIndex == index }"
            >
              <span>
                <svg
                  t="1642161107710"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4056"
                  width="20"
                  height="20"
                >
                  <path
                    d="M580.722174 437.990403 580.722174 78.171384 436.794158 78.171384 436.794158 437.990403 76.975139 437.990403 76.975139 581.918419 436.794158 581.918419 436.794158 941.737438 580.722174 941.737438 580.722174 581.918419 940.542216 581.918419 940.542216 437.990403Z"
                    p-id="4057"
                    fill="#ffffff"
                  ></path>
                </svg>
              </span>
              <div class="edit-menu" v-show="imgIndex == index">
                <div @click.stop="deleteImg(index)">删除此图片</div>
                <div @click.stop="changeImg(index)">替换此图片</div>
                <div @click.stop="sortImg">调整图片顺序</div>
                <div @click.stop="addImg">继续添加图片</div>
              </div>
            </div>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import UploadUtil from '@/components/upload/src/upload-util.vue'
import { notification } from '@/components/notification'
import { deleteOneImg } from '@/stores/module/upload/artwork/handle'
import { debounce } from '@/utils/debounce'
import {
  getScrollContainer,
  getScrollPosition
} from '@/components/utils/scroll'
import { getOSType } from '@/utils/system'
import type { IMoreFilePayload } from '@/components/upload/type'

const emits = defineEmits(['showSort'])

const uploadStore = useUploadArtworkStore()
// 是否展示 点击上传
const isShowUploadTip = computed(() => uploadStore.urlList.length === 0)

// 图片列表
const urlList = computed(() => uploadStore.urlList)
const handleImgData = (fileData: IMoreFilePayload) => {
  if (fileData.isLarge) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '单张图片文件不能超过 32M'
    })
    return
  }
  if (fileData.tooMuch || urlList.value.length + fileData.urlList.length > 15) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '最多不能超过15张图片'
    })
    return
  }
  fileWarn.value = false
  // 把图片数据传到store 中处理
  uploadStore.changeUrlListAction(fileData)
}

// 图片加载完会调用
const imgOverLoad = (event: Event, index: number) => {
  // 如果是替换最后一张之前的 都不滚动
  if (index + 1 != urlList.value.length) return
  scroll()
}

// 图片加载完成后 滚动到底部
const uploadWrpEL = ref<HTMLDivElement>()
const scroll = debounce(() => {
  const container = getScrollContainer(uploadWrpEL.value!)

  const clientHeight = document.documentElement.clientHeight // 浏览器高度
  const { scrollHeight } = getScrollPosition(container) // 可滚动高度

  container!.scrollTo({
    top: scrollHeight - clientHeight - 65,
    behavior: 'smooth'
  })
}, 1000)

// -------------------- 菜单显示相关 --------------------
//菜单的伪元素小三角
const showStyle = ref('0')
// 是否展示 编辑菜单
const imgIndex = ref()
const showMenu = (index: number) => {
  imgIndex.value = index
  showStyle.value = '1'
}
// 像父组件暴露方法 关闭菜单
const closeMenu = () => {
  imgIndex.value = -1
  showStyle.value = '0'
}
// ------------------- 图片操作相关 ------------------------
//删除图片
const deleteImg = (index: number) => {
  closeMenu()
  deleteOneImg(index)
}

// 替换图片
const uploadUtils = ref<InstanceType<typeof UploadUtil>>()
const changeImg = (index: number) => {
  uploadStore.changeIndx = index
  // false 单张上传
  uploadUtils.value?.upload(false)
}

// 添加图片
const addImg = () => {
  uploadUtils.value?.upload(true)
}

// 发送展示排序组件
const sortImg = () => {
  closeMenu()
  // 如果图片还没有全部压缩完成 不允许排序
  if (uploadStore.loading) return
  emits('showSort')
}

// 没有图片点击上传 出现提示
const fileWarn = ref(false)
// 暴露方法
const fileWarnFn = (payload: boolean) => {
  fileWarn.value = payload
}
defineExpose({ fileWarnFn, closeMenu, addImg })

const tip = computed(() => {
  const osType = getOSType()
  const str = osType === 'Mac' ? 'Command' : 'Ctrl'
  return `按住键盘 Shift 或 ${str} 进行多选`
})
</script>

<style scoped lang="less">
.view {
  flex: 2;
  width: 100%;
  box-shadow: 0 1px 5px #c7c7c7;
  background-color: var(--bgc);
  padding: 50px 70px;
}

.upload-warp {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: dashed 2px var(--blue-border-color);
  background-color: var(--blue-mask);
  transition: background-color 0.3s ease;
  cursor: pointer;
  .upload {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-text3);
    font-size: 35px;
    .tip {
      opacity: 0;
      font-size: 18px;
      margin-bottom: 5px;
      margin-top: 10px;
      transition: opacity 0.4s ease;
    }
    .big-tip {
      margin-bottom: 20px;
    }
  }
  &:hover {
    background-color: var(--blue-mask-chose);
    .tip {
      opacity: 1;
    }
  }
}

.img-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    border: 2px solid transparent;
    margin-bottom: 60px;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    &:hover {
      border: 2px solid var(--btn-color1);
    }
    &:hover .edit-img {
      opacity: 1;
    }
    img {
      max-width: 100%;
      max-height: calc(100vh - 90px);
      height: auto !important;
      box-sizing: border-box;
      border: solid 2px transparent;
      transition: border 0.3s ease;
    }

    .uploading {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid transparent;
      width: 100%;
      height: 100%;
      font-size: 15px;
      font-weight: 500;
      .text {
        font-size: 13px;
        margin-top: 8px;
        color: #fff;
        text-align: center;
      }
      .fail {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--primary-err-color);
        svg {
          margin-bottom: 15px;
        }
      }
    }
  }
}
.edit-img {
  position: sticky;
  bottom: 75px;
  left: 100%;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.5s ease;
  span {
    border-radius: 100%;
    background-color: #06f;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    right: 8px;
    &:hover {
      background-color: #0054f5;
    }
  }
}
.edit-menu {
  position: absolute;
  bottom: 55px;
  right: -37px;
  min-width: 120px;
  padding: 11px 0;
  background: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: 0px 1px 4px var(--surface-color1-shadow);
  //三角
  &::after {
    opacity: v-bind(showStyle);
    content: '';
    box-shadow: -1px -1px 1px -1px rgba(0, 0, 0, 0.3);
    left: 53px;
    top: 145px;
    height: 10px;
    background: var(--surface-color1);
    border-top: 1px solid var(--surface-color1-shadow);
    border-left: 1px solid var(--surface-color1-shadow);
    position: absolute;
    transform: rotate(-135deg);
    width: 10px;
    z-index: 1;
  }
  div {
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    padding: 0 13px;
    color: var(--color-text1);
    text-align: left;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: var(--primary-color);
    }
  }
}
.show-edit {
  opacity: 1 !important;
}
.border {
  border: solid 2px var(--blue-border-color) !important;
}

.warn {
  border: dashed 2px #f78989;
  .upload {
    color: #f78989;
  }
}
// 视口 小于 1200px
@media (max-width: 1200px) {
  .view {
    padding: 20px 30px;
  }
}
</style>
