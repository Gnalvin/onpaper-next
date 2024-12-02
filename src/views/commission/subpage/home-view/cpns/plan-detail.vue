<template>
  <div class="plan-detail" v-if="plan">
    <div class="header">
      <div class="black" @click="$emit('close')">
        <span class="icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31 36L19 24L31 12"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        返回
      </div>
      <div class="headline">
        <span>{{ plan.sender.userName }} 的约稿邀请</span>
      </div>
    </div>
    <div class="name">
      <span>{{ plan.name }}</span>
      <span class="be-invited one-line">
        <RouterLink
          :to="{
            name: 'CommissionHome',
            params: { userId: plan.artist.userId }
          }"
          target="_blank"
        >
          画师：{{ plan.artist.userName }}</RouterLink
        >
      </span>
    </div>
    <div class="time">
      发布于
      {{ $filters.formatTime(plan.createAt, 'YYYY年MM月DD日 HH:mm') }}
      <span
        class="status"
        :class="{
          talk: plan.status === 1,
          ing: plan.status === 2,
          over: plan.status === 3,
          close: plan.status < 0
        }"
        >{{ statusText }}</span
      >
      <span
        class="report"
        v-if="plan.userId !== mainStore.userId"
        @click="handleShowReport"
        ><svg
          width="14"
          height="14"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z"
            fill="none"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M8 42H40"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 13L7 14"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 3.9999L14 6.9999"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.0001 9.99989L7.00009 6.99989"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        举报
      </span>
    </div>
    <div class="other">
      <span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M42.1691 29.2451L29.2631 42.1511C28.5879 42.8271 27.6716 43.2069 26.7161 43.2069C25.7606 43.2069 24.8444 42.8271 24.1691 42.1511L8 26V8H26L42.1691 24.1691C43.5649 25.5732 43.5649 27.841 42.1691 29.2451Z"
            fill="none"
            stroke-linejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z"
            fill="#ffffff"
          />
        </svg>
        {{ plan.category }}
      </span>
      <span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 14L24 6L42 14M6 14L24 22M6 14V34L24 42M42 14L24 22M42 14V34L24 42M24 22V42"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ plan.purpose.split(' / ')[0] }}
      </span>
      <span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.9998 44.3332C34.1251 44.3332 42.3332 36.1251 42.3332 25.9999C42.3332 15.8747 34.1251 7.66656 23.9998 7.66656C13.8746 7.66656 5.6665 15.8747 5.6665 25.9999C5.6665 36.1251 13.8746 44.3332 23.9998 44.3332Z"
            fill="none"
            stroke-linejoin="round"
          />
          <path
            d="M23.7594 15.3536L23.7582 26.3624L31.5305 34.1347"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 9.00001L11 4.00001"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M44 9.00001L37 4.00001"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ plan.date }} 截稿
      </span>
    </div>
    <div class="user-info">
      <AvatarItem
        :width="65"
        :height="65"
        :user-id="plan.sender.userId"
        :file-name="plan.sender.avatar"
        :go-to-commission="true"
        :openNew="true"
      ></AvatarItem>
      <div class="user-content">
        <span class="username">{{ plan.sender.userName }}</span>
        <span class="score" v-if="plan.sender.score">
          <el-rate
            v-model="plan.sender.score"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 分"
          />
        </span>
        <span class="score" v-else>暂无评分</span>
        <span class="finish">共完成约稿 {{ plan.sender.finish }} 次</span>
      </div>
    </div>
    <div class="intro">
      <div class="item">
        <span class="sub-title"> 需求详情 </span>
      </div>
      {{ plan.intro }}
    </div>
    <div class="example title" v-if="plan.fileList.length">
      <div class="item">
        <span class="sub-title"> 参考例图 </span>
      </div>
      <div class="pic-wrap">
        <div class="pic" v-for="(item, index) in plan.fileList" :key="index">
          <img :src="item.fileName" alt="" />
        </div>
      </div>
    </div>
    <div class="require title">
      <div class="item">
        <span class="sub-title"> 其他要求 </span>
      </div>
      <div class="other-info">
        <span>尺寸规格</span>
        <span class="info"> {{ size?.label }} </span>
      </div>
      <div class="other-info">
        <span>颜色模式</span>
        <span class="info">
          {{
            plan.color == 'RGB' ? 'RGB (用于网络传播)' : 'CMYK ( 用于印刷品 )'
          }}
        </span>
      </div>
      <div class="other-info">
        <span>稿件格式</span>
        <span class="info"> {{ plan.fileType.join('、') }}</span>
      </div>
      <div class="other-info">
        <span>定期反馈</span>
        <span class="info"> {{ feedBackOpt?.label }} </span>
      </div>
      <div class="other-info">
        <span>发布权限</span>
        <span class="info"> {{ permission?.label }} </span>
      </div>
    </div>
    <div class="pay title">
      <div class="item">
        <span class="sub-title">
          付款方式
          <Tooltip
            :text-list="[
              '画师承诺按以下阶段提供阶段性稿件供约稿方审核确认。',
              '同时约定，进入下一阶段创作前，约稿方需按照已确认的阶段支付对应比例的稿酬给画师。'
            ]"
          ></Tooltip>
        </span>
        <div class="sketch">
          <div class="step">
            <span class="percent">0 %</span>
            <span class="text">创作开始</span>
          </div>
          <div class="line"></div>
          <template v-for="i in createStep(plan.payment)" :key="i.step">
            <div class="step">
              <span class="percent"> {{ i.percent }} %</span>
              <span class="text">{{ i.step }}</span>
            </div>
            <div class="line"></div>
          </template>
        </div>
      </div>
      <div class="money" v-if="!isShowFooter">
        <span>单张稿酬金额：</span> {{ plan.money }}元
      </div>
    </div>
    <div class="footer" v-if="isShowFooter">
      <div class="money">稿酬：¥ {{ plan.money }} / 张</div>
      <div>
        <span
          class="contact"
          v-if="plan.status > 0 && plan.status != 3"
          @click="handleShowContact"
        >
          查看联系方式
        </span>
        <template v-if="plan.status == 3 || plan.status == -2">
          <ElButton
            class="btn"
            v-if="isShowCheckEvaluateBtn"
            @click="isShowEvaluate = true"
          >
            查看评价
          </ElButton>
          <ElButton class="btn" v-else @click="handleCompleteEvaluation"
            >去评价</ElButton
          >
        </template>
        <ElButton
          class="btn"
          v-if="isArtist && plan.status < 3 && plan.status >= 0"
          @click="handleNextStatus"
        >
          {{ nextBtnText }}
        </ElButton>
        <ElButton
          class="btn warn"
          v-if="(isSender || isArtist) && cancelBtnText"
          @click="handleCancel"
        >
          {{ cancelBtnText }}
        </ElButton>
      </div>
    </div>
  </div>
  <UserContact
    v-if="isShowContact"
    @close="isShowContact = false"
  ></UserContact>
  <Transition>
    <EvaluateItem
      v-if="isShowSubmitEvaluate"
      @close="isShowSubmitEvaluate = false"
      @submit="handleSubmitEvaluate"
    ></EvaluateItem>
  </Transition>
  <Transition>
    <ShowEvaluate
      v-if="isShowEvaluate && plan?.evaluates"
      :info="plan.evaluates"
      @close="isShowEvaluate = false"
    ></ShowEvaluate>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import useCommissionStore from '@/stores/module/commission'
import useMainStore from '@/stores/module/main'
import useDetailStore from '@/stores/module/commission/detail'
import { AvatarItem } from '@/components/avatar'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import ElButton from '@/components/button/el-button.vue'
import UserContact from './user-contact.vue'
import TipText from './tip-text.vue'
import EvaluateItem from './evaluate-item.vue'
import ShowEvaluate from './show-evaluate.vue'
import { MessageBox } from '@/components/message-box'
import { ReportPanel } from '@/components/report'
import {
  createStep,
  openOption,
  fileSize,
  feedBack
} from '../../../subpage/config'
import type { IPlanNext } from '@/service/commission/type'

const emits = defineEmits(['close'])

const detailStore = useDetailStore()
const cStore = useCommissionStore()
const mainStore = useMainStore()
const plan = computed(() => detailStore.planDetail)

const permission = computed(() =>
  openOption.find((i) => plan.value?.openOption == i.value)
)
const size = computed(() =>
  fileSize.find((i) => plan.value?.fileSize == i.value)
)
const feedBackOpt = computed(() =>
  feedBack.find((i) => plan.value?.feedBack == i.value)
)

// 下一步的按钮文字
const nextBtnText = computed(() => {
  switch (plan.value!.status) {
    case 0:
      return '与Ta联系'
    case 1:
      return '接受方案'
    case 2:
      return '完成企划'
    default:
      return ''
  }
})
// 取消按钮的文字
const cancelBtnText = computed(() => {
  switch (plan.value!.status) {
    case 0:
    case 1:
      return '关闭邀请'
    case 2:
      return '退出合作'
    default:
      return ''
  }
})
const isOwner = computed(() => cStore.userPanel?.isOwner)
// 是否是被邀约画师
const isArtist = computed(() => mainStore.userId === plan.value?.artistId)
// 是否是约稿者
const isSender = computed(() => mainStore.userId === plan.value?.userId)

const statusText = computed(() => {
  switch (plan.value?.status) {
    case 0:
      return '待画师接受'
    case 1:
      return '双方沟通中'
    case 2:
      return '画师创作中'
    case 3:
      return '方案已完成'
    case -2:
      return '合作已终止'
    default:
      return '方案已关闭'
  }
})

// 是否显示查看评价按钮
const isShowCheckEvaluateBtn = computed(() => {
  // 画师评价了 而且当前登陆用户是画师
  if (isArtist.value && plan.value?.evaluateStatus == 1) return true
  // 约稿方评价了 而且当前登陆用户是 约稿方
  if (isSender.value && plan.value?.evaluateStatus == 2) return true
  // 如果双方都完成评价了
  if (plan.value?.evaluateStatus === 0) return true
  return false
})

// 是否显示footer 栏
const isShowFooter = computed(() => {
  const status = plan.value?.status
  const evaluateStatus = plan.value?.evaluateStatus

  // 如果是当前页面所属用户 则显示
  if (isOwner.value && status != -1) return true
  // 如果当前方案已经完成或关闭 且双方完成了评价
  if ((status === 3 || status === -2) && evaluateStatus == 0) return true
  return false
})

const isShowSubmitEvaluate = ref(false)

const handleNextStatus = () => {
  let status = plan.value!.status
  const inviteId = plan.value!.inviteId
  MessageBox({
    text: h(TipText, { status }),
    width: '450px',
    confirmButtonText: nextBtnText.value,
    cancelButtonText: '返回'
  }).then(async () => {
    if (status < 3) status += 1
    if (status === 3) {
      isShowSubmitEvaluate.value = true
      detailStore.evaluate.status = 3
    } else {
      const data = { inviteId, status } as IPlanNext
      await detailStore.updatePlanNextStatusAction(data)
      emits('close')
    }
  })
}

const handleCancel = () => {
  let status = plan.value!.status
  const inviteId = plan.value!.inviteId
  MessageBox({
    text: h(TipText, { status, isCancel: true }),
    width: '400px',
    confirmButtonText: cancelBtnText.value,
    confirmBtnColor: '#d0021b',
    cancelButtonText: '返回'
  }).then(async () => {
    status = status < 2 ? -1 : -2
    if (status === -2) {
      isShowSubmitEvaluate.value = true
      detailStore.evaluate.status = -2
    } else {
      const data = { inviteId, status } as IPlanNext
      await detailStore.updatePlanNextStatusAction(data)
      emits('close')
    }
  })
}

const isShowContact = ref(false)
const handleShowContact = () => {
  isShowContact.value = true
  // 如果已经有了 不再重复请求
  if (detailStore.contact) return
  detailStore.getUserContactAction()
}

// 补充评价(一方已完成，另一方需要补充评价)
const handleCompleteEvaluation = () => {
  isShowSubmitEvaluate.value = true
  detailStore.evaluate.status = plan.value!.status as 3 | -2
  detailStore.evaluate.only = true
}
// 提交评价
const handleSubmitEvaluate = async () => {
  detailStore.waiting = true
  await detailStore.postEvaluateAction()
  emits('close')
  detailStore.waiting = false
}
// 展示评价
const isShowEvaluate = ref(false)

//举报方案
const handleShowReport = () => {
  if (!mainStore.verifyIsLogin()) return
  ReportPanel({
    msgId: plan.value!.inviteId,
    msgType: 'in',
    defendant: plan.value!.userId
  })
}
</script>

<style scoped lang="less">
.plan-detail {
  position: relative;
  width: 800px;
  padding: 0px 30px;
  min-height: 100%;
  margin: 0 auto 0;
  background-color: var(--surface-color4);
}
.header {
  position: sticky;
  top: 0;
  display: flex;
  font-size: 18px;
  height: 50px;
  align-items: center;
  background-color: var(--surface-color4);
  z-index: 99;
  border-radius: 5px;
  margin: 0 -20px;
  .black {
    position: absolute;
    display: flex;
    align-items: center;
    font-weight: 700;
    cursor: pointer;
    .icon {
      display: flex;
    }
    svg {
      stroke: var(--color-regular);
    }
  }
  .headline {
    font-weight: 400;
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
.name {
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  font-weight: bold;
  line-height: 28px;
  margin: 25px 0;
  color: var(--color-text1);
  .be-invited {
    font-weight: 500;
    font-size: 14px;
    max-width: 190px;
  }
}

.time {
  display: flex;
  color: var(--color-text3);
  .status {
    margin-left: 20px;
  }
  .report {
    margin-left: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--color-text3);
    svg {
      margin-right: 2px;
      stroke: var(--color-text3);
    }
  }
}
.other {
  display: flex;
  margin: 20px 0 40px;
  span {
    display: flex;
    margin-right: 30px;
    color: var(--color-text1);
    svg {
      stroke: var(--color-text2);
      stroke-width: 4;
      margin-right: 8px;
    }
  }
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
  padding: 15px 0;
  .user-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 13px;
    font-size: 13px;
    .username {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text1);
    }
    .score {
      line-height: 35px;
      font-size: 13px;
      color: var(--color-text3);
    }
  }
}

.title {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--transparent-hover);
}
.intro {
  font-size: 15px;
  line-height: 2;
  white-space: pre-line;
}
.item {
  margin: 13px 0 10px;
  .sub-title {
    color: var(--color-text1);
    font-weight: 700;
    margin-bottom: 15px;
    font-size: 16px;
    display: flex;
    align-items: center;
    svg {
      margin-right: 10px;
    }
  }
}

.example {
  .pic-wrap {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 30px;
  }
  .pic {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    margin: 10px 0;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.02);
      pointer-events: none;
      z-index: 1;
    }
    img {
      max-width: 500px;
      max-height: 500px;
    }
  }
}
.require {
  .sub-title {
    margin-bottom: 0px;
  }
  .other-info {
    span {
      display: inline-block;
      font-size: 14px;
      color: var(--color-text3);
      font-weight: 500;
      margin-right: 30px;
      margin-top: 15px;
    }
    .info {
      color: var(--color-text2);
    }
  }
}
.pay {
  padding-bottom: 20px;
  .sketch {
    display: flex;
    margin-top: 35px;
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
        font-size: 12px;
        font-weight: 500;
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
  .money {
    font-size: 15px;
    margin-left: 2px;
    font-weight: 500;
    padding: 10px 0 50px;
  }
}
.footer {
  position: sticky;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface-color4);
  padding: 20px 30px;
  margin: 0 -30px;
  z-index: 1;
  box-shadow: 0 -5px 10px -10px var(--surface-color4-shadow);
  .btn {
    margin: 0;
    margin-right: 20px;
  }
  .money {
    font-weight: bold;
    color: #ff83a4;
  }
  .warn {
    background-color: #d0021b;
  }
  .contact {
    cursor: pointer;
    font-size: 14px;
    color: var(--color-text1);
    margin-right: 20px;
  }
}
.talk {
  color: #409eff;
}
.ing {
  color: #30d288;
}
.over {
  color: #f5a623;
}
.close {
  color: #d0021b;
}
</style>
