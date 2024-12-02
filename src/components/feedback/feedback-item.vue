<template>
  <Teleport to="body">
    <Transition appear>
      <div class="feedback top-mask-layer" v-if="isShowPanel">
        <div class="container">
          <div class="close" @click="handleClose">
            <span>
              <svg
                t="1639580049786"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4204"
                width="15"
                height="15"
              >
                <path
                  d="M886.784 746.496q29.696 30.72 43.52 56.32t-4.608 58.368q-4.096 6.144-11.264 14.848t-14.848 16.896-15.36 14.848-12.8 9.728q-25.6 15.36-60.416 8.192t-62.464-34.816l-43.008-43.008-57.344-57.344-67.584-67.584-73.728-73.728-131.072 131.072q-60.416 60.416-98.304 99.328-38.912 38.912-77.312 48.128t-68.096-17.408l-7.168-7.168-11.264-11.264-11.264-11.264q-6.144-6.144-7.168-8.192-11.264-14.336-13.312-29.184t2.56-29.184 13.824-27.648 20.48-24.576q9.216-8.192 32.768-30.72l55.296-57.344q33.792-32.768 75.264-73.728t86.528-86.016q-49.152-49.152-93.696-93.184t-79.872-78.848-57.856-56.832-27.648-27.136q-26.624-26.624-27.136-52.736t17.92-52.736q8.192-10.24 23.552-24.064t21.504-17.92q30.72-20.48 55.296-17.92t49.152 28.16l31.744 31.744q23.552 23.552 58.368 57.344t78.336 76.288 90.624 88.576q38.912-38.912 76.288-75.776t69.632-69.12 58.368-57.856 43.52-43.008q24.576-23.552 53.248-31.232t55.296 12.8q1.024 1.024 6.656 5.12t11.264 9.216 10.752 9.728 7.168 5.632q27.648 26.624 27.136 57.856t-27.136 57.856q-18.432 18.432-45.568 46.08t-60.416 60.416-70.144 69.632l-77.824 77.824q37.888 36.864 74.24 72.192t67.584 66.048 56.32 56.32 41.472 41.984z"
                  p-id="4205"
                  fill="#8a8a8a"
                ></path>
              </svg>
            </span>
          </div>
          <div class="head">意见反馈</div>
          <div class="text">
            我们非常重视每一位用户的声音，反馈将帮助我们改进产品和服务，请把您的感想或问题告诉我们吧。
          </div>
          <div class="form">
            <div class="item">
              <div class="title">反馈类型</div>
              <ElSelect class="el-select" v-model="feedbackType">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </ElSelect>
            </div>
            <div class="item">
              <div class="title">
                请详细描述
                <Transition appear>
                  <span class="warn" v-if="isShowMust">必填</span>
                </Transition>
              </div>
              <ElInput
                v-model="describe"
                maxlength="300"
                show-word-limit
                :autosize="{ minRows: 5, maxRows: 6 }"
                type="textarea"
                placeholder="我们知道你很忙，如果你能抽出几分钟时间给我们一些反馈，我们会非常感激！"
              />
            </div>
            <div class="item">
              <label class="contact">
                <label class="contact-check" :class="{ checkBgc: isContact }">
                  <input type="checkbox" id="keep" v-model="isContact" />
                </label>
                <span class="check-text" for="keep"> 请务必联系我 </span>
              </label>
              <ElInput
                v-show="isContact"
                placeholder="请输入联系方式"
                maxlength="50"
                v-model="contactText"
              ></ElInput>
            </div>
          </div>
          <div class="foot">
            <ElButton class="btn" @click="handlePost">提交</ElButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ElButton from '@/components/button/el-button.vue'
import { MessageBox } from '@/components/message-box'
import { postFeedbackRequest } from '@/service/common'
import { notification } from '@/components/notification'
const emits = defineEmits(['close'])

const feedbackType = ref('suggest')
const option = [
  { label: '关于社区意见或建议', value: 'suggest' },
  { label: '报告BUG', value: 'bug' },
  { label: '使用过程遇到困难', value: 'use' },
  { label: '希望添加新功能', value: 'feature' }
]
const describe = ref('')
const isContact = ref(false)
const contactText = ref('')

const isShowMust = ref(false)

const handlePost = async () => {
  if (!describe.value) {
    isShowMust.value = true
    return
  }
  if (describe.value.length <= 5) {
    notification({
      title: '意见反馈',
      message: '请再多写一点吧'
    })
    return
  }
  if (isContact.value && !contactText.value) {
    MessageBox({
      text: '请补充联系方式噢',
      confirmButtonText: '补充',
      cancelButtonText: '算了'
    }).catch(() => (isContact.value = false))
    return
  }
  const postData = {
    describe: describe.value,
    type: feedbackType.value,
    contact: contactText.value
  }
  const res = await postFeedbackRequest(postData)
  if (res.status == 200) {
    notification({
      title: '意见反馈',
      type: 'success',
      message: '感谢您的来信，我们会尽快处理'
    })
    handleClose()
  }
}
watch(describe, (val) => {
  if (!val) return (isShowMust.value = true)
  isShowMust.value = false
})

// 关闭组件事件
const isShowPanel = ref(true)
const handleClose = () => {
  isShowPanel.value = false
  // 300毫秒渐变 完成后关闭
  setTimeout(() => {
    emits('close')
  }, 300)
}
</script>

<style scoped lang="less">
.feedback {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  position: relative;
  padding: 30px;
  width: 480px;
  max-height: 500px;
  background-color: var(--surface-color4);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  border: 1px solid var(--border-color1);
  border-radius: 24px;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .head {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .text {
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text3);
    margin: 10px 0;
  }
  .form {
    .item {
      margin-top: 20px;
      .title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 15px;
        .warn {
          margin-left: 10px;
          border-radius: 4px;
          font-weight: 400;
          font-size: 10px;
          color: #fff;
          padding: 1px 4px;
          background-color: tomato;
        }
      }
    }
  }
}
.el-select {
  width: 100%;
}
:deep(.el-input__wrapper) {
  height: 40px;
}
.contact {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 13px;
  input {
    display: none;
  }
  .contact-check {
    display: inline-block;
    border-radius: 3px;
    width: 14px;
    height: 14px;
    background-image: url(@/assets/img/login/no-choice.svg);
    background-color: var(--bgc);
    background-repeat: no-repeat;
    background-size: 14px 14px;
    background-position: 50%;
    cursor: pointer;
  }
  .checkBgc {
    background-image: url(@/assets/img/login/choice.svg);
  }
  .check-text {
    margin-left: 6px;
  }
}
.foot {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  .btn {
    padding: 10px 100px;
  }
}
</style>
