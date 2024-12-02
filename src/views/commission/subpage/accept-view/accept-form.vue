<template>
  <div class="form">
    <div class="title">创建接稿方案</div>
    <div class="body">
      <div class="item">
        <div class="title">
          方案名称 <span v-if="!verifyName" class="warn">必填</span>
        </div>
        <ElInput
          v-model.trim="plan.name"
          maxlength="20"
          size="large"
          show-word-limit
          placeholder="例如：接日系插画啦 / xxx的接稿计划"
        ></ElInput>
      </div>
      <div class="item">
        <div class="title">
          方案简介<span v-if="!verifyIntro" class="warn">必填</span>
        </div>
        <ElInput
          class="textarea"
          v-model="plan.intro"
          maxlength="650"
          show-word-limit
          :autosize="{ minRows: 5, maxRows: 15 }"
          type="textarea"
          placeholder="请把你在接稿前的想说的都写出来吧 (不少于50字！！不少于50字！！)&#10;比如写出自己喜欢的主题、想尝试创作的东西或希望收到的约稿内容。&#10;比如创作不同类型的作品价格、加急价格或者退稿说明&#10;有了这些提示，也能更方便各位粉丝发送约稿申请。"
        ></ElInput>
        <div class="use-temp" @click="useTemp">不知道怎么写？</div>
      </div>
      <div class="item">
        <div class="title">
          偏好类型<span v-if="!verifyLike" class="warn">必填</span>
        </div>
        <ElInput
          class="textarea"
          v-model="plan.preference"
          maxlength="80"
          :autosize="{ minRows: 3, maxRows: 6 }"
          type="textarea"
          show-word-limit
          placeholder="例如：写出自己喜欢的主题或擅长的风格"
        ></ElInput>
      </div>
      <div class="item">
        <div class="title">
          不接类型<span v-if="!verifyRefuse" class="warn">必填</span>
        </div>
        <ElInput
          class="textarea"
          v-model="plan.refuse"
          maxlength="80"
          :autosize="{ minRows: 3, maxRows: 6 }"
          type="textarea"
          show-word-limit
          placeholder="例如：不接急稿 / 不接男性角色 / 不接暖色调，将你无法处理的情况列举出来"
        ></ElInput>
      </div>
      <div class="item">
        <div class="title">
          单张稿酬金额<span v-if="!verifyMoney" class="warn">必填</span>
        </div>
        <ElSelect class="el-select" size="large" v-model="plan.money">
          <el-option
            v-for="item in config.moneyScope"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </ElSelect>
      </div>
      <div class="item">
        <div class="title">允许中途修改次数</div>
        <el-radio-group v-model="plan.change">
          <template v-for="i in 5" :key="i">
            <el-radio class="type" :label="i">{{ i }} 次</el-radio>
          </template>
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">预计出稿时间</div>
        <el-radio-group v-model="plan.finish">
          <template v-for="i in [3, 7, 15, 30, 90]" :key="i">
            <el-radio class="type" :label="i">{{ i }}天内</el-radio>
          </template>
        </el-radio-group>
      </div>
      <div class="item">
        <div class="title">
          提供的文件格式<span v-if="!verifyFileType" class="warn">必填</span>
        </div>
        <el-checkbox-group v-model="plan.fileType">
          <el-checkbox v-for="i in config.fileType" :key="i" :label="i" />
        </el-checkbox-group>
      </div>
      <div class="item">
        <div class="title">
          创作阶段验收方式
          <Tooltip
            :text-list="[
              '采取分段式付款，不同创作阶段要求客户预付部分稿酬，可以最大限度保护你的权益。',
              '例如常规验收模式，总共100元稿费，当完成草稿时你应该先收取 20% 稿费即20元再进行下一步创作'
            ]"
          ></Tooltip>
        </div>
        <el-radio-group v-model="plan.payment">
          <template v-for="item in config.payment" :key="item">
            <el-radio class="type" :label="item.value">
              {{ item.label }}
            </el-radio>
          </template>
        </el-radio-group>
        <div class="sketch">
          <div class="step">
            <span class="percent">0 %</span>
            <span class="text">创作开始</span>
          </div>
          <div class="line"></div>
          <template v-for="i in step" :key="i.step">
            <div class="step">
              <span class="percent"> {{ i.percent }} %</span>
              <span class="text">{{ i.step }}</span>
            </div>
            <div class="line"></div>
          </template>
        </div>
      </div>
      <div class="item">
        <div class="title">
          联系方式
          <Tooltip
            :text-list="[
              '你的联系方式不会被公开，直到你同意了某个约稿邀请，你的联系方式将会提供给约稿方。'
            ]"
          ></Tooltip>
          <span class="warn" v-if="!verifyContact">必填</span>
        </div>
        <div class="relation">
          <ElSelect
            class="select"
            size="large"
            v-model="plan.contactType"
            style="width: 150px"
          >
            <el-option
              v-for="item in config.contactType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </ElSelect>
          <ElInput
            size="large"
            maxlength="20"
            v-model.trim="plan.contact"
            style="width: 300px"
          ></ElInput>
        </div>
      </div>
      <div class="agreement">
        <label class="agree">
          <label class="agree-check" :class="{ checkBgc: agree }">
            <input type="checkbox" id="keep" v-model="agree" />
          </label>
          <span class="check-text" for="keep">
            我已满18周岁且同意
            <RouterLink
              target="”_blank”"
              :to="{ name: 'commissionTerms' }"
              style="color: #409eff"
              >《社区约稿规范》
            </RouterLink>
          </span>
        </label>
      </div>
    </div>
    <div class="footer">
      <ELButton class="btn" @click="handlePostPlan" :disable="waiting">
        <span v-if="!waiting">
          {{ $route.name === 'CommissionAcceptEdit' ? '更新' : '创建' }}接稿方案
        </span>
        <span v-else>创建中 ...</span>
      </ELButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useMainStore from '@/stores/module/main'
import useCommissionStore from '@/stores/module/commission'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import ELButton from '@/components/button/el-button.vue'
import { notification } from '@/components/notification'
import { TipBox, MessageBox } from '@/components/message-box'
import { copyText } from '@/utils/system'
import { config, createStep } from '../config'

const router = useRouter()

const mainStore = useMainStore()
const cStore = useCommissionStore()

const { acceptPlan: plan } = storeToRefs(cStore)
const useTemp = () => {
  copyText(config.introTemp)
  TipBox({ text: '简介模版已复制' })
}

const step = computed(() => createStep(plan.value.payment))
const verifyName = ref(false)
const verifyIntro = ref(false)
const verifyLike = ref(false)
const verifyRefuse = ref(false)
const verifyContact = ref(false)
const verifyMoney = ref(false)
const verifyFileType = ref(false)
watch(
  plan,
  (val) => {
    verifyName.value = !!val.name
    verifyIntro.value = !!val.intro && val.intro.length > 50
    verifyLike.value = !!val.preference
    verifyRefuse.value = !!val.refuse
    verifyContact.value = !!val.contact
    verifyMoney.value = !!val.money
    verifyFileType.value = !!val.fileType.length
  },
  { deep: true, immediate: true }
)

// 是否同意协议
const agree = ref(false)
const waiting = ref(false)

const handlePostPlan = async () => {
  let tipMsg = ''
  if (!plan.value.name) tipMsg = '方案名称'
  if (!plan.value.preference) tipMsg = '偏好类型'
  if (!plan.value.money) tipMsg = '稿酬金额'
  if (!plan.value.refuse) tipMsg = '不接类型'
  if (!plan.value.contact) tipMsg = '联系方式'
  if (!plan.value.fileType.length) tipMsg = '文件类型'
  if (tipMsg) {
    notification({
      title: '信息不完整',
      message: `请填写${tipMsg}`,
      type: 'error'
    })
    return
  }
  if (!plan.value.intro || plan.value.intro.length < 50) {
    notification({
      title: '信息不完整',
      message: `方案介绍不得少于50字`,
      type: 'error'
    })
    return
  }
  //同意协议
  if (!agree.value) {
    MessageBox({
      text: '我已满18周岁且同意<a href="/terms/commission" style="color:#409eff;" target="_blank">《社区约稿规范》</a>',
      confirmButtonText: '同意'
    })
      .then(() => {
        agree.value = true
        postData()
      })
      .catch(() => {})
    return
  }
  postData()
}

const postData = async () => {
  waiting.value = true
  const res = await cStore.postAcceptPlanAction()
  if (res.status === 200) {
    router.replace({
      name: 'CommissionHomePlan',
      params: { userId: mainStore.userId }
    })
  } else {
    notification({
      title: '创建方案',
      message: `服务器出错了...请稍后再试`,
      type: 'error'
    })
    waiting.value = false
  }
}
</script>

<style scoped lang="less">
.form {
  flex: 3;
  margin-right: 25px;
  background-color: var(--surface-color4);
  border-radius: 16px;
  padding: 32px 45px;
  .title {
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
  }
  .body {
    padding: 28px 0px 24px;
    border-radius: 16px;
    margin: 0 auto;
    max-width: 650px;
    .item {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--border-color3);
      .title {
        display: flex;
        align-items: center;
        font-size: 15px;
        line-height: 22px;
        color: var(--color-text1);
        margin-bottom: 10px;
      }
      .use-temp {
        cursor: pointer;
        width: 100px;
        margin-top: 10px;
        font-weight: 600;
        color: var(--primary-middle-color);
      }
      .warn {
        margin-left: 10px;
        border-radius: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        line-height: 1.3;
        padding: 0px 4px;
        background-color: tomato;
      }
      .sketch {
        display: flex;
        margin-top: 30px;
        padding-bottom: 15px;
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          .percent {
            display: flex;
            justify-content: center;
            font-weight: 500;
            padding: 5px 18px;
            min-width: 37px;
            border-radius: 20px;
            border: 2px solid var(--primary-middle-color);
          }
          .text {
            margin-top: 10px;
            font-size: 13px;
          }
        }
        .line {
          position: relative;
          top: 14px;
          width: 30px;
          height: 2px;
          background-color: var(--primary-middle-color);
          &:last-child {
            display: none;
          }
        }
      }
      .relation {
        display: flex;
        align-items: center;
        .select {
          margin-right: 15px;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    .btn {
      font-size: 14px;
      border-radius: 20px;
      padding: 12px 60px;
    }
  }
}
.textarea {
  :deep(.el-textarea__inner) {
    line-height: 2;
  }
}
.agreement {
  display: inline-flex;
  margin-top: 10px;
  .agree {
    display: flex;
    align-items: center;
    cursor: pointer;
    input {
      display: none;
    }
    .agree-check {
      display: inline-block;
      border-radius: 3px;
      width: 14px;
      height: 14px;
      background-image: url(@/assets/img/login/no-choice.svg);
      background-color: #fff;
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
}
</style>
