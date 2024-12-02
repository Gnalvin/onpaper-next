<template>
  <div class="waiting-wrap top-mask-layer">
    <div class="tip">
      <div>
        <div class="text">
          <span>正在保存数据...</span>
          <span>请<span class="red">不要</span>关闭或者刷新页面</span>
          <span v-if="!uploadStore.isRetry">
            还需要
            <span class="red"> {{ second }} </span>
            秒
          </span>
          <ElButton v-else class="retry" @click="handleRetryUpload"
            >重新上传</ElButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useUploadArtworkStore from '@/stores/module/upload/artwork'
import ElButton from '@/components/button/el-button.vue'

const uploadStore = useUploadArtworkStore()

const second = ref(16)
// 倒计时10秒
let timer: any
const showTime = function () {
  if (second.value === 0) {
    clearTimeout(timer)
    return
  }
  second.value -= 1
  timer = setTimeout(showTime, 1000)
}

const handleRetryUpload = async () => {
  uploadStore.isRetry = false
  second.value = 16
  await uploadStore.uploadCoverAction()
  await uploadStore.uploadArtworkAction(true)
}

onMounted(() => {
  showTime()
})
</script>

<style scoped lang="less">
.waiting-wrap {
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
}
.tip {
  font-size: 17px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  margin-top: 25vh;
  border-radius: 10px;
  width: 350px;
  height: 200px;
  background-color: var(--surface-color1);
  border: 1px solid var(--border-color1);
  box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
  .red {
    color: red;
    font-size: 20px;
    margin: 0 5px;
  }
}

.text {
  height: 100%;
  line-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.retry {
  margin-left: 50px;
  margin-top: 15px;
  padding: 8px 25px;
}
</style>
