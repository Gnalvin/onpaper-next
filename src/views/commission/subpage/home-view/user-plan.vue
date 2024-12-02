<template>
  <div class="user-plan">
    <template v-if="!plan && !store.userNoPlan && !store.useStopPlan">
      <el-skeleton :rows="8" style="margin-top: 30px" animated />
      <el-skeleton style="width: 300px; margin-top: 50px" :rows="3" animated />
    </template>
    <template v-else-if="plan">
      <div class="title">
        <span>{{ plan.name }}</span>
        <span
          class="report"
          v-if="!store.userPanel?.isOwner"
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
      <div class="describe" v-html="$xss(plan.intro)"></div>
      <div class="require">
        <div class="item">
          <span class="sub-title">
            <svg
              width="17"
              height="17"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z"
                fill="#3aa901"
                stroke="#3aa901"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            偏好风格
          </span>
          <span class="describe">{{ plan.preference }}</span>
        </div>
        <div class="item">
          <span class="sub-title">
            <svg
              width="17"
              height="17"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z"
                fill="#ff1765"
                stroke="#ff1765"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            不接类型
          </span>
          <span class="describe">{{ plan.refuse }}</span>
        </div>
      </div>
      <div class="pay">
        <div class="item">
          <span class="sub-title">
            <svg
              width="17"
              height="17"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 7H9C6.23858 7 4 9.23858 4 12V36C4 38.7614 6.23858 41 9 41H39C41.7614 41 44 38.7614 44 36V12C44 9.23858 41.7614 7 39 7Z"
                fill="#fdac21"
                stroke="#fdac21"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M18 15L24 21L30 15"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 23H31"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 29H31"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 23V34"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
        <div class="money"><span>单张稿酬金额：</span> {{ plan.money }}元</div>
      </div>
      <div class="other">
        <div class="item">
          <span class="sub-title">
            <svg
              width="17"
              height="17"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                fill="#4a90e2"
                stroke="#4a90e2"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z"
                fill="#FFF"
              />
              <path
                d="M24.5 34V20H23.5H22.5"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 34H28"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            其他信息
          </span>
        </div>
        <div class="other-info">
          <span>中途修改次数</span>
          <span class="info"> {{ plan.change }} 次</span>
        </div>
        <div class="other-info">
          <span>提供文件类型</span>
          <span class="info"> {{ plan.fileType.join('、') }}</span>
        </div>
        <div class="other-info">
          <span>预计出稿时间</span>
          <span class="info"> 接稿后 {{ plan.finish }} 天内</span>
        </div>
      </div>
    </template>
    <template v-else-if="store.userNoPlan">
      <div class="no-content-tip" v-if="!store.userPanel?.isOwner">
        ta还没有开启接稿功能&nbsp; ₍ᐢ..ᐢ₎
      </div>
      <div v-else class="no-content-tip">
        <span>开启接稿功能，接受粉丝的约稿吧</span>
        <RouterLink :to="{ name: 'CommissionAccept' }">
          <span class="open-plan">点击创建接稿计划</span>
        </RouterLink>
      </div>
    </template>
    <template v-else>
      <div class="no-content-tip">画师暂时不接稿&nbsp; ಥ_ಥ</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import useMainStore from '@/stores/module/main'
import useCommissionStore from '@/stores/module/commission'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import { createStep } from '../../subpage/config'
import { ReportPanel } from '@/components/report'

const route = useRoute()
const mainStore = useMainStore()
const store = useCommissionStore()
watch(
  () => route.params.userId,
  (val) => {
    if (!val || route.name != 'CommissionHomePlan') return
    store.getUserPlanAction(val as string)
  },
  { immediate: true }
)

const plan = computed(() => store.userPlan)

//举报方案
const handleShowReport = () => {
  if (!mainStore.verifyIsLogin()) return
  ReportPanel({
    msgId: plan.value!.planId,
    msgType: 'ac',
    defendant: plan.value!.userId
  })
}
</script>

<style scoped lang="less">
.user-plan {
  background-color: var(--surface-color4);
  border-radius: 10px;
  padding: 30px 40px 40px;
  min-height: calc(100% - 70px);
}
.title {
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  font-weight: bold;
  line-height: 28px;
  margin: 0px 0px 8px;
  color: var(--color-text1);
  margin-bottom: 20px;
}
.describe {
  font-size: 15px;
  line-height: 2;
  white-space: pre-line;
  padding-bottom: 10px;
  :deep(a) {
    color: var(--primary-middle-color) !important;
  }
}

.require {
  margin-top: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--transparent-hover);
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
      margin-right: 5px;
    }
  }
}
.pay {
  margin-top: 10px;
  padding: 10px 0;
  border-top: 1px solid var(--transparent-hover);
  .money {
    font-size: 15px;
    margin-left: 2px;
    font-weight: 500;
  }
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
}
.other {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--transparent-hover);
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
.no-content-tip {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  text-align: center;
  padding-top: 250px;
  .open-plan {
    display: block;
    font-size: 16px;
    font-weight: 700;
    margin-top: 20px;
    color: var(--primary-middle-color);
    cursor: pointer;
  }
}
.report {
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
</style>
