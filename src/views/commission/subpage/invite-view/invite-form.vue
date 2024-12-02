<template>
  <div class="form">
    <userPlan v-show="!isShowForm" @showForm="handleShowForm"></userPlan>
    <div v-show="isShowForm">
      <div class="title">创建约稿方案</div>
      <div class="body">
        <div class="item">
          <div class="title">
            稿件类型<span v-if="!verifyCategory" class="warn">必填</span>
          </div>
          <div class="category">
            <template v-for="(item, index) in config.category" :key="item">
              <span
                @click="handleCategoryChose(index)"
                class="category-item"
                :class="{ 'category-chose': categoryChose == index }"
              >
                <span class="svg">
                  <svg
                    width="15"
                    height="13"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 24L20 34L40 14"
                      stroke="#fff"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>

                {{ item }}
              </span>
            </template>
          </div>
        </div>
        <div class="item">
          <div class="title">
            方案名称 <span v-if="!plan.name" class="warn">必填</span>
          </div>
          <ElInput
            v-model.trim="plan.name"
            maxlength="20"
            size="large"
            show-word-limit
            placeholder="正确例子：古风双人立绘 / 约Q版头像    错误例子：问问价格 / 测试一下"
          ></ElInput>
        </div>
        <div class="item">
          <div class="title">
            方案简介<span v-if="!plan.intro" class="warn">必填</span>
          </div>
          <ElInput
            v-model="plan.intro"
            maxlength="600"
            show-word-limit
            :autosize="{ minRows: 6, maxRows: 15 }"
            type="textarea"
            placeholder="请把你想说的都写出来吧 (不少于20字！！不少于20字！！)&#10;比如写出自己喜欢的主题、风格或希望看到的内容。&#10;比如希望根据设定角色创作，保证原设定特征等&#10;比如将稿件的用于哪些途径。&#10;&#10;错误例子：老师给点，没有要求，好看就行。 （ 随便打字乱写的直接封号 ）"
          ></ElInput>
          <div class="use-temp" @click="useTemp">还在苦恼怎么写？</div>
        </div>
        <div class="item">
          <div class="title">
            参考例图
            <Tooltip
              :text-list="[
                '参考例图是与您期望的稿件风格、类型接近的图片，可以帮助画师快速了解您的需求。',
                '如果没有找到合适的参考例图也没有关系，您也可以在对接画师后，与画师直接描述需求。'
              ]"
            ></Tooltip>
          </div>
          <span class="tip"> 5M以内，仅限 jpg/png 文件，最多5张 </span>
          <UploadUtil
            @fileData="handleFileData"
            :fileSize="6"
            :max-count="5"
            :multiple="true"
            style="display: none"
            ref="uploadUtils"
          ></UploadUtil>
          <PreviewImg
            class="preview-img"
            @add-img="addImg"
            @delete="delImg"
            @sort="changeSortUrlList"
            :max-count="5"
            :loading="uploadStore.loading"
            :url-list="uploadStore.urlList"
          ></PreviewImg>
        </div>
        <div class="item">
          <div class="title">
            稿件用途<span v-if="!purpose.length" class="warn">必填</span>
          </div>
          <el-cascader
            size="large"
            v-model="purpose"
            :options="config.useOption"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </div>
        <div class="item">
          <div class="title">尺寸规格</div>
          <el-select
            v-model="plan.fileSize"
            placeholder="Select"
            size="large"
            style="width: 400px"
          >
            <el-option
              v-for="item in config.fileSize"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span
                style="
                  float: right;
                  color: var(--color-regular);
                  font-size: 13px;
                "
                >{{ item.tip }}</span
              >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <div class="title">
            颜色模式
            <Tooltip
              :text-list="['RGB : 用于网络传播', 'CMYK : 用于印刷品']"
            ></Tooltip>
          </div>
          <el-radio-group v-model="plan.color">
            <template v-for="i in ['RGB', 'CMYK']" :key="i">
              <el-radio class="type" :label="i">{{ i }}</el-radio>
            </template>
          </el-radio-group>
        </div>
        <div class="item">
          <div class="title">
            文件格式<span v-if="!plan.fileType.length" class="warn">必填</span>
          </div>
          <el-checkbox-group v-model="plan.fileType">
            <el-checkbox v-for="i in config.fileType" :key="i" :label="i" />
          </el-checkbox-group>
        </div>
        <div class="item">
          <div class="title">
            截稿日期<span v-if="!plan.date" class="warn">必填</span>
          </div>
          <el-date-picker
            :disabled-date="disableDate"
            v-model="plan.date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择截稿日期"
            size="large"
          />
        </div>
        <div class="item">
          <div class="title">
            单张稿酬预算<span v-if="!plan.money" class="warn">必填</span>
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
          <div class="title">
            验收支付方式
            <Tooltip
              :text-list="[
                '画师按以下阶段提供阶段性稿件供约稿方审核确认。',
                '同时约定，进入下一阶段创作前，约稿方需按照已确认的阶段支付对应比例的稿酬给画师。'
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
            发布权限
            <Tooltip :text-list="['约稿完成后画师是否可以发布稿件']"></Tooltip>
          </div>
          <el-radio-group v-model="plan.openOption">
            <template v-for="i in config.openOption" :key="i.value">
              <el-radio class="type" :label="i.value">{{ i.label }}</el-radio>
            </template>
          </el-radio-group>
        </div>
        <div class="item">
          <div class="title">
            定期反馈
            <Tooltip
              :text-list="['您希望画师开始工作后将按怎样的频率向您反馈进度？']"
            ></Tooltip>
          </div>
          <ElSelect
            class="el-select"
            size="large"
            v-model="plan.feedBack"
            style="width: 230px"
          >
            <el-option
              v-for="item in config.feedBack"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </ElSelect>
        </div>
        <div class="item">
          <div class="title">
            联系方式
            <Tooltip
              :text-list="[
                '你的联系方式不会被公开，直到画师同意了你的邀请，你的联系方式才会提供给画师。'
              ]"
            ></Tooltip>
            <span class="warn" v-if="!plan.contact">必填</span>
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
        <ElButton class="btn" @click="handlePostPlan" :disable="waiting">
          <span v-if="!waiting">发送约稿请求</span>
          <span v-else>创建中 ...</span>
        </ElButton>
      </div>
    </div>
  </div>
  <TopButton ref="topButton"></TopButton>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import useMainStore from '@/stores/module/main'
import useUploadStore from '@/stores/module/upload/commission'
import useCommissionStore from '@/stores/module/commission'
import userPlan from './user-plan.vue'
import ElButton from '@/components/button/el-button.vue'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import PreviewImg from '@/components/trend/cpn/preview-img.vue'
import TopButton from '@/components/top-button/top-button.vue'
import UploadUtil from '@/components/upload/src/upload-util.vue'
import { changeSortUrlList } from '@/stores/module/upload/commission/handle'
import { notification } from '@/components/notification'
import { TipBox, MessageBox } from '@/components/message-box'
import { copyText } from '@/utils/system'
import { config, createStep } from '../config'
import type { IMoreFilePayload } from '@/components/upload/type'

const router = useRouter()

const isShowForm = ref(false)
const topButton = ref<InstanceType<typeof TopButton>>()

const mainStore = useMainStore()
const commissionStore = useCommissionStore()
const uploadStore = useUploadStore()
const { invitePlan: plan } = storeToRefs(commissionStore)

const handleShowForm = () => {
  topButton.value?.toTop('auto')
  isShowForm.value = !isShowForm.value
}
const useTemp = () => {
  copyText(config.requestTemp)
  TipBox({ text: '约稿模版已复制' })
}

// 稿件类型点选
const verifyCategory = ref(false)
const categoryChose = ref(-1)
const handleCategoryChose = (index: number) => {
  categoryChose.value = index
  verifyCategory.value = true
  plan.value.category = config.category[index]
}

// 限制时间选择范围 未来一年
const disableDate = (time: Date) => {
  const oneYear = 365 * 24 * 3600 * 1000
  return time.getTime() - oneYear > Date.now() || time.getTime() < Date.now()
}

// 稿件用途
const purpose = ref<string[]>([])

const uploadUtils = ref<InstanceType<typeof UploadUtil>>()
// 调用函数添加图片
const addImg = () => {
  uploadUtils.value?.upload(true)
}
//删除图片
const delImg = (index: number) => {
  uploadStore.urlList.splice(index, 1)
}
//预览图片
const preImgUrls = computed(() => uploadStore.urlList)
const handleFileData = (fileData: IMoreFilePayload) => {
  if (fileData.urlList?.length === 0) return
  // 显示警告
  if (fileData.isLarge) {
    notification({
      title: '上传图片',
      type: 'error',
      message: '图片不能超过5M'
    })
    return
  }
  if (
    fileData.tooMuch ||
    preImgUrls.value.length + fileData.urlList.length > 5
  ) {
    notification({
      type: 'error',
      title: '上传作品',
      message: '最多不能超过5张图片'
    })
    return
  }

  // 把图片数据传到store 中处理
  uploadStore.changeUrlListAction(fileData)
}

// 付款步骤
const step = computed(() => createStep(plan.value.payment))
// 是否同意协议
const agree = ref(false)
const waiting = ref(false)

const handlePostPlan = () => {
  if (uploadStore.getUploadFailItem !== undefined) {
    notification({
      title: '发送约稿',
      type: 'error',
      message: '请删除上传失败的图片'
    })
    return
  }
  // 如果还有图片等等上传
  if (uploadStore.isHaveImgUpload) {
    notification({
      type: 'error',
      title: '发送约稿',
      message: '请耐心等待所有图片上传完成'
    })
    return
  }
  let tipMsg = ''
  if (!verifyCategory.value) tipMsg = '稿件类型'
  if (!plan.value.money) tipMsg = '稿酬预算'
  if (!plan.value.contact) tipMsg = '联系方式'
  if (!purpose.value.length) tipMsg = '稿件用途'
  if (!plan.value.date) tipMsg = '截稿日期'
  if (!plan.value.fileType.length) tipMsg = '文件类型'
  if (!plan.value.name) tipMsg = '方案名称'
  if (tipMsg) {
    notification({
      title: '信息不完整',
      message: `请填写${tipMsg}`,
      type: 'error'
    })
    return
  }
  if (!plan.value.intro || plan.value.intro.length < 20) {
    notification({
      title: '信息不完整',
      message: `方案介绍不得少于20字`,
      type: 'error'
    })
    return
  }
  plan.value.purpose = purpose.value.join(' / ')
  plan.value.fileList = []
  uploadStore.urlList.forEach((item) => {
    plan.value.fileList.push({
      fileName: item.fileName,
      sort: item.sortIndx,
      width: item.width,
      height: item.height
    })
  })
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
  const res = await commissionStore.postInvitePlanAction()
  if (res.status === 200) {
    uploadStore.$reset()
    commissionStore.$reset()
    router.replace({
      name: 'CommissionHomeInvite',
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
      .preview-img {
        padding: 10px 0;
      }
      .title {
        display: flex;
        align-items: center;
        font-size: 15px;
        line-height: 22px;
        color: var(--color-text1);
        margin-bottom: 13px;
        .tip {
          color: var(--color-text3);
          font-size: 13px;
        }
      }
      .use-temp {
        cursor: pointer;
        width: 130px;
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
            padding: 5px 15px;
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
      .category {
        display: flex;
        flex-wrap: wrap;
        .category-item {
          position: relative;
          width: 85px;
          height: 32px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text3);
          margin: 10px 18px 4px 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border-color4);
          border-radius: 8px;
          user-select: none;
          cursor: pointer;
          .svg {
            opacity: 0;
            display: flex;
            border-bottom-left-radius: 4px;
            top: 0px;
            right: 0px;
            background-color: var(--primary-middle-color);
            position: absolute;
          }

          &:hover {
            border-color: var(--primary-middle-color);
          }
        }
        .category-chose {
          border-color: var(--primary-middle-color);
          .svg {
            opacity: 1;
          }
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
