<template>
  <div class="other-login">
    <div class="line">
      <span class="text-muted"> 使用其他方式开始 </span>
    </div>
    <div class="items">
      <!-- <span class="apple loginIcon"></span>
      <span class="weibo loginIcon"></span>
      <span class="wechat loginIcon"></span>
      <span class="google loginIcon"></span> -->
      <span class="loginIcon" @click="$emit('email')">
        <svg
          v-if="isShowPhone"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 96 960 960"
          width="24"
        >
          <path
            d="M280 1016q-33 0-56.5-23.5T200 936V216q0-33 23.5-56.5T280 136h400q33 0 56.5 23.5T760 216v720q0 33-23.5 56.5T680 1016H280Zm200-100q17 0 28.5-11.5T520 876q0-17-11.5-28.5T480 836q-17 0-28.5 11.5T440 876q0 17 11.5 28.5T480 916ZM280 736h400V336H280v400Z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          height="22"
          viewBox="0 96 960 960"
          width="22"
        >
          <path
            d="M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Zm320-280 320-200v-80L480 536 160 336v80l320 200Z"
            fill="#000"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isShowPhone: {
    type: Boolean,
    default: false
  }
})
defineEmits(['email'])
</script>

<style scoped lang="less">
.other-login {
  padding: 7px 0 10px;
}
.text-muted {
  font-size: 12px;
  margin: 0 15px;
  color: #606266;
}

.line::before {
  display: inline-block;
  content: '';
  height: 6px;
  width: 78px;
  background: no-repeat url('@/assets/img/login/line.png');
}
.line::after {
  display: inline-block;
  content: '';
  height: 6px;
  width: 78px;
  background: no-repeat url('@/assets/img/login/line.png');
}

.items {
  width: 280px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 10px 0;

  .apple {
    margin-left: 0;
    background: no-repeat center url('@/assets/img/login/icon-apple-black.svg');
    background-color: rgba(0, 0, 0, 0.04);
  }
  .weibo {
    background: no-repeat center url('@/assets/img/login/icon-weibo.svg');
    background-color: rgba(0, 0, 0, 0.04);
  }
  .google {
    background: no-repeat center url('@/assets/img/login/icon-google.svg');
    background-color: rgba(0, 0, 0, 0.04);
  }
  .wechat {
    background: no-repeat center url('@/assets/img/login/icon-wechat.svg');
    background-color: rgba(0, 0, 0, 0.04);
  }
}
.loginIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.04);
}
.loginIcon:hover {
  background-color: rgba(0, 0, 0, 0.07843);
}
</style>
