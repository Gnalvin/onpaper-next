<template>
  <div class="circle_process">
    <div class="wrapper right">
      <div class="circle rightcircle" ref="rightCircle"></div>
    </div>
    <div class="show" v-show="moreThenText" :style="{ color: textColor }">
      {{ moreThenText }}
    </div>
    <div class="wrapper left">
      <div class="circle leftcircle" ref="leftCircle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxCount: {
    type: Number,
    default: 350
  },
  circleSize: {
    type: String,
    default: '20px'
  },
  border: {
    type: String,
    default: '2px'
  }
})

const rightCircle = ref<HTMLDivElement>()
const leftCircle = ref<HTMLDivElement>()
const borderSize = ref(props.border)
const moreThenText = ref('')
const size = ref(props.circleSize)
const borderColor = ref('var(--primary-middle-color)')
const textColor = ref('')

watch(
  () => props.text,
  (val) => {
    const length = val.length
    moreThenText.value = ''
    size.value = props.circleSize
    borderColor.value = 'var(--primary-middle-color)'
    textColor.value = ''
    borderSize.value = props.border
    //百分比
    let process = (val.length / props.maxCount) * 100
    //如果距离超过还有 20个字
    if (length > props.maxCount - 20) {
      borderColor.value = 'rgb(251, 206, 61)'
      moreThenText.value = String(props.maxCount - length)
      size.value = '30px'
    }
    //如果超过 限定字数
    if (length > props.maxCount) {
      borderColor.value = 'rgb(244, 33, 46)'
      textColor.value = 'rgb(244, 33, 46)'
      process = 100
      moreThenText.value = '-' + (length - props.maxCount)
    }
    if (length > props.maxCount + 10) {
      borderSize.value = '0px'
    }
    // 改变进度样式
    if (process <= 50) {
      rightCircle.value!.style.cssText =
        'transform: rotate(' + (-135 + 3.6 * process) + 'deg)'
      leftCircle.value!.style.cssText = 'transform: rotate(-135deg)'
    } else if (process > 50) {
      rightCircle.value!.style.cssText = 'transform: rotate(45deg)'
      leftCircle.value!.style.cssText =
        'transform: rotate(' + (-135 + 3.6 * (process - 50)) + 'deg)'
    }
  }
)
</script>

<style scoped lang="less">
.circle_process {
  position: relative;
  width: v-bind('size');
  height: v-bind('size');
  transition: all 0.3s ease;
}
.circle_process .wrapper {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.circle_process .right {
  right: 0;
}
.circle_process .left {
  left: 0;
}
.circle_process .circle {
  width: 200%;
  height: 100%;
  border: v-bind('borderSize') solid var(--transparent-hover);
  border-radius: 50%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  transform: rotate(-135deg);
  transition: all 0s ease;
}
.circle_process .rightcircle {
  border-top: v-bind('borderSize') solid v-bind('borderColor');
  border-right: v-bind('borderSize') solid v-bind('borderColor');
  right: 0;
}
.circle_process .leftcircle {
  border-bottom: v-bind('borderSize') solid v-bind('borderColor');
  border-left: v-bind('borderSize') solid v-bind('borderColor');
  left: 0;
}
.show {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
}
</style>
