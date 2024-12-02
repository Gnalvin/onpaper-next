<template>
  <Teleport to="body">
    <div class="edit-wrap top-mask-layer" @click.self="handleCancel">
      <div class="container" :class="{ 'no-show': isNoShow }">
        <div class="warp">
          <div class="nav">
            <span
              v-for="(text, i) in navText"
              :key="text"
              :class="{ chose: chose == i }"
              @click="chose = i"
            >
              {{ text }}
            </span>
          </div>
          <div class="content">
            <div class="profile" v-show="chose == 0">
              <div class="item">
                <div class="title">
                  作品标题 : <span v-if="titleWarn" class="warn">必填</span>
                </div>
                <WlInput
                  class="input"
                  :max-len="15"
                  v-model.trim="editStore.title"
                ></WlInput>
              </div>

              <div class="item">
                <div class="title">
                  分区 :<span v-if="zoneWarn" class="warn">必填</span>
                </div>
                <ElSelect
                  class="el-select"
                  v-model="editStore.zone"
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
                  v-model="editStore.tags"
                  :max-tags="10"
                  :max-text="20"
                ></TagInput>
              </div>
              <div class="item">
                <div class="title">作品描述 :</div>
                <ElInput
                  class="el-intro"
                  maxlength="350"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  type="textarea"
                  placeholder=""
                  @input="handleIntro"
                  v-model="editStore.intro"
                />
              </div>
            </div>
            <PermissionSetting
              @permission="handlePermission"
              :setting="{ comment, copyright: copyRight, adult, whoSee }"
              v-show="chose == 1"
            ></PermissionSetting>
            <div class="delete-art" v-show="chose == 2">
              <div class="del-tip">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 25C14 19.4772 18.4772 15 24 15C29.5228 15 34 19.4772 34 25V41H14V25Z"
                    fill="none"
                    stroke-width="4"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24 5V8"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M35.8918 9.32823L33.9634 11.6264"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M42.2187 20.2873L39.2642 20.8083"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.78116 20.2874L8.73558 20.8083"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.1086 9.32802L14.037 11.6262"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 41H43"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                你正在尝试删除名为 &nbsp;{{ artworkStore.artInfo.title }}&nbsp;
                的作品
              </div>
              <WlInput
                class="input"
                placeholder="输入作品名确认删除"
                v-model.trim="deleName"
              ></WlInput>
              <div class="notice">*作品删除不可恢复, 请做好备份</div>
              <div class="notice">*删除不会减少你收到的点赞收藏累计数</div>
              <div class="notice">
                *删除后某些情况还能看到作品封面, 请放心它们无法点击进入详情页
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <ElButton class="delete" @click="handleDelete" v-if="chose == 2">
            删除
          </ElButton>
          <ElButton class="save" @click="handleSave" v-else>保存</ElButton>
          <div class="cancel" @click="handleCancel">返回</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useEditStore from '@/stores/module/artwork-detail/edit'
import useMainStore from '@/stores/module/main'
import useArtworkStore from '@/stores/module/artwork-detail'
import { notification } from '@/components/notification'

import { zoneOptions } from '@/const/zone-config'
import WlInput from '@/components/input/wl-input.vue'
import TagInput from '@/components/tag-input/tag-input.vue'
import ElButton from '@/components/button/el-button.vue'
import PermissionSetting from '@/views/upload-artwork/cpns/handle/permission-setting.vue'
import { debounce } from '@/utils/debounce'

type settingType = {
  whoSee: string
  comment: 'public' | 'onlyFans' | 'close'
  adult: boolean
  copyright: string
}

const emits = defineEmits(['close', 'delete'])
const mainStore = useMainStore()
const editStore = useEditStore()
const artworkStore = useArtworkStore()
editStore.initStore()

const { comment, copyRight, adult, whoSee } = editStore

const navText = ['编辑详情', '权限设置', '删除作品']
const chose = ref(0)
const handlePermission = (setting: settingType) => {
  const { whoSee, comment, copyright, adult } = setting
  editStore.whoSee = whoSee
  editStore.comment = comment
  editStore.copyRight = copyright
  editStore.adult = adult
}

const handleIntro = () => {
  editStore.intro = editStore.intro.replace(/\n{3,}/g, '\n\n')
}

//是否展示 必填
const isVerify = ref(true)
const titleWarn = computed(() => {
  // 点击一次后出现 必填项目 输入则取消必填显示
  if (!isVerify.value && editStore.title.length === 0) return true
  return false
})
const zoneWarn = computed(() => {
  if (!isVerify.value && editStore.zone.length === 0) return true
  return false
})
const tagWarn = computed(() => {
  if (!isVerify.value && editStore.tags.length === 0) return true
  return false
})

const verifyData = () => {
  isVerify.value = true
  const titleLen = editStore.title.length
  if (titleLen > 15) {
    isVerify.value = false
    notification({
      type: 'error',
      title: '编辑作品',
      message: '作品标题过长'
    })
    return
  }
  // 验证是否填写了标题
  if (titleLen === 0) {
    isVerify.value = false
  }
  //是否选择了分区
  if (editStore.zone.length === 0) {
    isVerify.value = false
  }
  //是否填写了标签
  if (editStore.tags.length === 0) {
    isVerify.value = false
  }

  // 如果文字 没填写完成 提示
  if (!isVerify.value) {
    chose.value = 0
    notification({
      type: 'error',
      title: '编辑作品',
      message: '请补充必填项目'
    })
    return
  }
}

const handleSave = debounce(async () => {
  verifyData()
  if (!isVerify.value) return
  isNoShow.value = true
  const handle = notification({
    type: 'warning',
    title: '修改作品',
    message: '正在修改数据...请不要关闭或刷新网站',
    duration: 0
  })
  const res = await editStore.updateArtInfoAction()
  if (res.status == 200) {
    setTimeout(() => {
      handle.close()
    }, 1500)
    notification({
      type: 'success',
      title: '修改作品',
      message: '修改成功，3 秒后将刷新页面'
    })
    setTimeout(() => {
      handleCancel()
      mainStore.refreshPageAction()
    }, 2500)
  }
}, 200)

const handleCancel = () => {
  emits('close')
  editStore.$reset()
}

const deleName = ref('')
const isNoShow = ref(false)
const handleDelete = async () => {
  // 验证输入的作品名
  if (deleName.value !== artworkStore.artInfo.title) {
    notification({
      type: 'error',
      title: '删除作品',
      message: '输入的作品名称不一致'
    })
    deleName.value = ''
    return
  }
  isNoShow.value = true
  const handle = notification({
    type: 'warning',
    title: '删除作品',
    message: '正在删除中...请不要关闭或刷新网站',
    duration: 0
  })
  const res = await artworkStore.deleteArtworkAction()
  if (res.status === 200) {
    setTimeout(() => {
      handle.close()
    }, 2000)
    notification({
      type: 'success',
      title: '删除作品',
      message: '删除成功, 即将跳转到主页'
    })
    emits('delete')
    return
  } else {
    notification({
      type: 'error',
      title: '删除作品',
      message: '服务器出错了,稍后再试'
    })
  }
}
</script>

<style scoped lang="less">
.edit-wrap {
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

  .content {
    display: flex;
    margin: 10px 35px 0px 15px;
    width: 550px;
    height: 470px;
    border-radius: 5px;
    overflow: hidden;
    background-color: var(--bgc);
    border: 1px solid #d9e4fd;
  }
  .warp {
    margin-top: 25px;
    display: flex;
  }
}
.nav {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-top: 5px;
  span {
    font-size: 15px;
    font-weight: 500;
    margin: 5px 10px;
    padding: 8px 15px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0s;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .chose {
    color: var(--color-text4-hover);
    background-color: var(--bgc-chose-color);
    border-color: #0057ff;
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
  .delete {
    padding: 8px 23px;
    background-color: orangered;
    color: #fff;
    letter-spacing: 1px;
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
.profile {
  padding: 20px;
  flex-grow: 1;
  height: 431px;
  overflow: auto;
  .item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color2);
    .title {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--color-text1);
    }
    &:last-child {
      border: none;
      margin: 0;
    }
  }
  .el-select {
    max-width: 330px;
  }
  .el-intro {
    max-width: 400px;
  }
}
.input {
  max-width: 330px;
  :deep(.content) {
    border-radius: 5px;
    --input--height: 40px;
    background-color: transparent;
    border: 1.3px solid var(--border-color1);
    input {
      color: var(--color-regular);
    }
    &:focus-within {
      box-shadow: none;
      border-color: var(--primary-middle-color) !important;
    }
    &:hover {
      border-color: var(--border-color1-hover);
    }
  }
}
.delete-art {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .del-tip {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 15px;
    user-select: text;
    color: var(--color-text1);
    svg {
      margin-right: 6px;
      stroke: tomato;
    }
  }
  .input {
    margin-bottom: 15px;
  }
  .notice {
    font-size: 13px;
    margin-top: 5px;
    color: var(--color-text3);
  }
}
.no-show {
  display: none;
}
</style>
