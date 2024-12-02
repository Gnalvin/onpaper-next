<template>
  <el-form :rules="rules" :model="dateValue" ref="formRef">
    <div class="width">
      <el-form-item prop="year">
        <el-select
          class="year"
          v-model="dateValue.year"
          @change="handleChange"
          placeholder="年"
        >
          <el-option
            v-for="item in dateSelectRef.year"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="month">
        <el-select
          class="month"
          v-model="dateValue.month"
          @change="handleChange"
          placeholder="月"
        >
          <el-option
            v-for="item in dateSelectRef.month"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="day">
        <el-select
          class="day"
          v-model="dateValue.day"
          @change="handleChange"
          placeholder="日"
        >
          <el-option
            v-for="item in dateSelectRef.day"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, type PropType } from 'vue'
import type { ElForm } from 'element-plus'

import { rules } from '../config/rules-config'
import { ymhOptions, type TimeOptions } from '../config/time-select-config'

type birthdayType = {
  year: string
  month: string
  day: string
}

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<birthdayType>,
      default: () => ({ year: '', month: '', day: '' })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let dateSelectRef = ref<TimeOptions>(ymhOptions)
    // 定义响应式 默认值为传递过来的时间
    const dateValue = reactive({ year: '', month: '', day: '' })
    watch(
      () => props.modelValue,
      () => {
        dateValue.year = props.modelValue.year
        dateValue.month = props.modelValue.month
        dateValue.day = props.modelValue.day
      },
      { immediate: true }
    )
    //拿到form 组件对象
    const formRef = ref<InstanceType<typeof ElForm>>()

    // 判断是否是闰年函数
    const isLeapYear = (year: number, DateSelect: TimeOptions) => {
      // 如果是闰年
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        //  删除2月 的 30日，31日
        if (dateValue.day === '30' || dateValue.day === '31') {
          //清空选择的 30 31号
          dateValue.day = ''
        }
        dateSelectRef.value.day = DateSelect.day.filter((item) => {
          return item.value !== '30' && item.value !== '31'
        })
      } else {
        // 如果是正常的年份
        if (
          dateValue.day === '30' ||
          dateValue.day === '31' ||
          dateValue.day === '29'
        ) {
          //清空选择的 29 30 31号
          dateValue.day = ''
        }
        dateSelectRef.value.day = DateSelect.day.filter((item) => {
          return (
            // 删除2月 的 29日，30日，31日
            item.value !== '29' && item.value !== '30' && item.value !== '31'
          )
        })
      }
    }

    watch(
      [() => dateValue.year, () => dateValue.month],
      ([newYear, newMonth]) => {
        switch (newMonth) {
          case '02':
            // 选择2月时 修改2月的日期
            isLeapYear(parseInt(newYear), ymhOptions)
            break
          case '04':
          case '06':
          case '09':
          case '11':
            // 选择 4,6,9,11月时 删除31日
            if (dateValue.day === '31') {
              //清空选择的 31号
              dateValue.day = ''
            }
            dateSelectRef.value.day = ymhOptions.day.filter((item) => {
              return item.value !== '31'
            })
            break
          default:
            // 默认 有31 日
            dateSelectRef.value.day = ymhOptions.day
            break
        }
      },
      {
        immediate: true // ⽴即执⾏
      }
    )

    const verifyDate = () => {
      let verify = false
      //form组件对象 里面有个方法 可以验证表单 是否符合格式
      formRef.value?.validate((valid) => {
        // 符合时 valid 为TRUE
        if (valid) {
          verify = true
        }
      })
      return verify
    }

    const handleChange = () => {
      // 当值发生改变对外发出事件 change
      emit('update:modelValue', dateValue)
    }

    return {
      rules,
      formRef,
      dateValue,
      dateSelectRef,
      verifyDate,
      handleChange
    }
  }
})
</script>

<style scoped lang="less">
.title {
  color: #4d4a4d;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  margin-bottom: 3px;
  margin-left: 40px;
}
.width {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 280px;
}
.el-form-item {
  margin-bottom: 0px;
}

.el-select {
  width: 79px;
  margin-right: 6px;
  :deep(.el-input__inner) {
    text-align: right;
    --el-input-inner-height: 35px;
  }
}

.year {
  width: 109px;
}
.day {
  margin-right: 0;
}
</style>
