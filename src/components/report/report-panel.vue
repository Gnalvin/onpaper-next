<template>
  <Transition appear>
    <div class="report top-mask-layer" v-if="!isClose" @click.self="closeView">
      <div class="container">
        <div class="wrap">
          <div class="title">
            举报{{ title }}
            <div class="close" @click="closeView">
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 14L34 34"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 34L34 14"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="content">
            <div class="tip">
              请选择你要举报的类型：
              <Transition appear>
                <span class="warn" v-if="showMust">必填</span>
              </Transition>
            </div>
            <div class="chose">
              <el-radio-group v-model="reportVal">
                <template v-for="item in chose" :key="item">
                  <el-radio class="type" :label="item">{{ item }}</el-radio>
                </template>
              </el-radio-group>
            </div>
            <div class="tip">补充描述:</div>
            <ElInput
              v-model="describe"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 6 }"
              type="textarea"
              placeholder="添加文字描述工作人员可以更快核实噢～"
            />
            <div class="post">
              <ElButton class="btn" @click="handlePost">提交</ElButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'
import ElButton from '@/components/button/el-button.vue'
import { notification } from '@/components/notification'
import { postReportRequest } from '@/service/common'
import {
  artChose,
  trendChose,
  commentChose,
  userChose,
  acceptChose,
  inviteChose,
  evaluateChose
} from './config'

const props = defineProps({
  msgId: {
    type: String,
    required: true
  },
  msgType: {
    type: String as PropType<'tr' | 'aw' | 'cm' | 'usr' | 'ac' | 'in' | 'ev'>,
    required: true
  },
  // 被举报人
  defendant: {
    type: String,
    required: true
  }
})

const reportVal = ref('') // 举报类型
const describe = ref('') // 补充描述
const title = computed(() => {
  switch (props.msgType) {
    case 'aw':
      return '作品'
    case 'tr':
      return '动态'
    case 'usr':
      return '用户'
    case 'ac':
      return '接稿方案'
    case 'in':
      return '约稿方案'
    case 'ev':
      return '评价'
    default:
      return '评论'
  }
})

const chose = computed(() => {
  switch (props.msgType) {
    case 'aw':
      return artChose
    case 'tr':
      return trendChose
    case 'usr':
      return userChose
    case 'ac':
      return acceptChose
    case 'in':
      return inviteChose
    case 'ev':
      return evaluateChose
    default:
      return commentChose
  }
})
// 发送提交
const showMust = ref(false)
const handlePost = async () => {
  if (!reportVal.value) return (showMust.value = true)
  const report = {
    msgId: props.msgId,
    msgType: props.msgType,
    reportType: reportVal.value,
    describe: describe.value,
    defendant: props.defendant
  }
  const res = await postReportRequest(report)
  isClose.value = true
  if (res.status === 200) {
    notification({
      type: 'success',
      title: '举报成功',
      message: '感谢你的举报，我们会尽快核实。',
      zIndex: 9999
    })
  }
}
watch(reportVal, () => (showMust.value = false))

const isClose = ref(false)
const closeView = () => {
  isClose.value = true
}
</script>

<style scoped lang="less">
.report {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}
.container {
  border-radius: 12px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  user-select: none;
  width: 500px;
  padding: 20px;
}
.wrap {
  .title {
    position: relative;
    color: var(--color-text1);
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color2);
    .close {
      position: absolute;
      right: 0px;
      bottom: 7px;
      cursor: pointer;
      svg {
        stroke: var(--color-regular);
      }
    }
  }
  .content {
    .tip {
      margin-top: 25px;
      .warn {
        border-radius: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding: 0px 4px;
        background-color: tomato;
      }
    }
  }
}
.chose {
  margin-top: 10px;
  .type {
    width: 165px;
    margin-top: 10px;
    margin-right: 0px;
  }
}
.el-textarea {
  width: 480px;
  margin-top: 20px;
}
.post {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .btn {
    padding: 8px 25px;
  }
}
</style>
