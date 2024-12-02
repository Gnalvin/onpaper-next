<template>
  <div class="contract-area">
    <div class="contract">
      <template v-if="!plan && !cStore.userNoPlan && !cStore.useStopPlan">
        <el-skeleton :rows="5" style="margin-top: 30px" animated />
        <el-skeleton
          style="width: 300px; margin-top: 50px"
          :rows="3"
          animated
        />
        <el-skeleton style="margin-top: 30px" animated>
          <template #template>
            <el-skeleton-item variant="button" />
          </template>
        </el-skeleton>
      </template>
      <template v-else-if="plan">
        <div class="name">{{ plan.name }}</div>
        <div class="describe">
          {{ intro }}
          <span
            class="intro-btn"
            v-show="!isShowAll && isShowBtn"
            @click="isShowAllFn"
          >
            展开
          </span>
          <span
            class="intro-btn"
            v-show="isShowAll && isShowBtn"
            @click="isShowAllFn"
          >
            收起
          </span>
        </div>
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
          <div class="item">
            <span class="sub-title"
              ><svg
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
        </div>
        <div class="footer">
          <RouterLink
            :to="{ name: 'CommissionHome', params: { userId } }"
            v-if="!userHomeStore.owner"
          >
            <ElButton class="btn">我要约稿</ElButton>
          </RouterLink>
          <ElButton v-else class="btn edit">编辑方案</ElButton>
          <div class="money"><span>单张稿酬 : </span> {{ plan.money }}元</div>
        </div>
      </template>
      <template v-else-if="cStore.userNoPlan">
        <div class="no-content-tip" v-if="!userHomeStore.owner">
          Ta 还没有开启接稿功能&nbsp; ₍ᐢ..ᐢ₎
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import useCommissionStore from '@/stores/module/commission'
import useUserHomeStore from '@/stores/module/user-home'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import { createStep } from '@/views/commission/subpage/config'
import ElButton from '@/components/button/el-button.vue'
import { reBytesStr } from '@/utils/data-format'

const route = useRoute()
const userId = route.params.userId as string

const cStore = useCommissionStore()
const userHomeStore = useUserHomeStore()

// 页面激活时请求一次 用户的方案
cStore.getUserPlanAction(userId)

const plan = computed(() => cStore.userPlan)
const intro = ref('')
// 是否展示全部文字
const isShowAll = ref(false)
const isShowBtn = ref(false)
const isShowAllFn = () => {
  isShowAll.value = !isShowAll.value
  intro.value = introFn(plan.value!.intro)
}
// 处理 描述文字函数
const introFn = (introStr: string) => {
  // eslint-disable-next-line no-control-regex
  const bLen = introStr.replace(/[^\x00-\xff]/g, '01').length
  //如果大于 500字节 则隐藏一部分
  if (bLen > 350 && isShowAll.value === false) {
    isShowBtn.value = true
    return reBytesStr(introStr, 350) + '  ...'
  }
  return introStr
}
watch(plan, (val) => {
  if (val) intro.value = introFn(val.intro)
})
</script>

<style scoped lang="less">
.contract-area {
  background-color: var(--bgc2);
}
.contract {
  width: 700px;
  margin: 0 auto;
  padding: 25px 40px 40px;
  background-color: var(--surface-color4);
}

.name {
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  margin: 0px 0px 8px;
  color: var(--color-text1);
  margin-bottom: 20px;
}
.describe {
  line-height: 1.8;
  white-space: pre-line;
  padding-bottom: 10px;
  .intro-btn {
    margin-left: 5px;
    display: inline-block;
    color: #eb7350;
    cursor: pointer;
  }
}
.require {
  margin-top: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--transparent-hover);
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
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .btn {
    margin: 0;
    padding: 12px 50px;
    font-size: 14px;
    border-radius: 20px;
  }
  .money {
    margin-right: 20px;
    font-weight: 600;
  }
}
.no-content-tip {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  text-align: center;
  padding-top: 200px;
  min-height: 385px;
  .open-plan {
    display: block;
    font-size: 16px;
    font-weight: 700;
    margin-top: 20px;
    color: var(--primary-middle-color);
    cursor: pointer;
  }
}
.sketch {
  display: flex;
  margin-top: 20px;
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
.edit {
  border-radius: 20px;
  letter-spacing: 1.5px;
  color: var(--color-text1);
  background-color: var(--btn-color3);
}
</style>
