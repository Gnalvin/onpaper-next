<template>
  <div class="user-plan" v-if="plan">
    <div class="title">
      <AvatarItem
        :user-id="plan.userId"
        :img-url="plan.avatar"
        :width="25"
        :height="25"
        :go-to-commission="true"
      ></AvatarItem>
      <span class="user-name">{{ plan.userName }} 的接稿计划</span>
    </div>
    <div class="name">{{ plan.name }}</div>
    <div class="describe">
      {{ plan.intro }}
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
    <div class="footer">
      <ElButton class="btn" @click="$emit('showForm')">下一步</ElButton>
    </div>
  </div>
  <template v-else-if="!cStore.userNoPlan && !cStore.useStopPlan">
    <el-skeleton :rows="18" animated />
  </template>
  <template v-else>
    <div class="no-see">
      <span>用户没有接稿计划 或 暂时不接稿</span>
      <span class="tip">{{ time }} 秒后将跳转至首页</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AvatarItem } from '@/components/avatar'
import Tooltip from '@/components/tooltip/tool-tip.vue'
import ElButton from '@/components/button/el-button.vue'
import useCommissionStore from '@/stores/module/commission'
import { createStep } from '../../subpage/config'

const router = useRouter()
defineEmits(['showForm'])
const cStore = useCommissionStore()

const plan = computed(() => cStore.userPlan)
// 没有找到计划时 跳转到主页
let time = ref(5)
watch([() => cStore.userNoPlan, () => cStore.useStopPlan], ([no, stop]) => {
  if (no || stop) {
    const timer = setInterval(() => {
      time.value -= 1
      if (!time.value) {
        clearInterval(timer)
        router.push({ name: 'HomePage' })
      }
    }, 1000)
  }
})
</script>

<style scoped lang="less">
.title {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 20px;
  .user-name {
    margin-left: 6px;
  }
}
.name {
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
.footer {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  .btn {
    padding: 11px 80px;
    font-size: 15px;
    border-radius: 20px;
  }
}

.no-see {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 24px;
  margin-top: 30%;
  font-weight: 600;
  color: var(--color-text1);
  .tip {
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    color: var(--color-text4-hover);
  }
}
</style>
