<template>
  <Teleport to="body">
    <div class="permission-setting top-mask-layer">
      <div class="container">
        <div class="wrap">
          <div class="item">
            <span class="title">公开范围</span>
            <el-radio-group v-model="choseWhoSee">
              <el-radio label="public">所有人</el-radio>
              <el-radio label="onlyFans" v-if="whoSee === 'onlyFans'">
                仅粉丝
              </el-radio>
              <el-radio label="privacy">私密</el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <span class="title">作品评论</span>
            <el-radio-group v-model="choseComment">
              <el-radio label="public">所有人</el-radio>
              <el-radio label="onlyFans">仅粉丝</el-radio>
              <el-radio label="close">关闭评论</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="foot">
          <ElButton
            class="save"
            @click="handlePermissionSave"
            :disable="!isChange"
          >
            保存
          </ElButton>
          <div class="cancel" @click="$emit('close')">返回</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import ElButton from '@/components/button/el-button.vue'

const props = defineProps({
  whoSee: {
    type: String as PropType<'public' | 'privacy' | 'onlyFans'>,
    required: true
  },
  comment: {
    type: String as PropType<'public' | 'close' | 'onlyFans'>,
    required: true
  },
  trendId: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['close', 'update'])

const choseWhoSee = ref(props.whoSee)
const choseComment = ref(props.comment)

//是否有改变权限选择
const isChange = ref(false)
watch(choseWhoSee, (val) => {
  if (val !== props.whoSee) {
    isChange.value = true
  } else {
    isChange.value = false
  }
})
watch(choseComment, (val) => {
  if (val !== props.comment) {
    isChange.value = true
  } else {
    isChange.value = false
  }
})

const handlePermissionSave = () => {
  const payload = {
    trendId: props.trendId,
    comment: choseComment.value,
    whoSee: choseWhoSee.value
  }
  // 有改变权限不同才发送
  if (isChange.value) {
    emits('update', payload)
  }
}
</script>

<style scoped lang="less">
.permission-setting {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  .container {
    border-radius: 12px;
    background-color: var(--surface-color1);
    border: 1px solid var(--border-color1);
    box-shadow: var(--surface-color1-shadow) 0px 4px 16px;
    user-select: none;
    padding: 15px;
    .wrap {
      padding: 20px 25px;
      border: 1px solid #d9e4fd;
      border-radius: 5px;
    }
    .foot {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 15px;
      .save {
        padding: 6px 18px;
        margin: 0;
      }
      .cancel {
        font-weight: 500;
        cursor: pointer;
        margin: 0 20px;
      }
    }
  }
  .item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;

    .title {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 5px;
      color: var(--color-text1);
    }
    &:last-child {
      border: none;
      margin: 0;
      padding-bottom: 0;
    }
  }
}

.el-radio {
  font-weight: 400;
  font-size: 12px;
  :deep(.el-radio__label) {
    display: flex;
    align-items: center;
  }
}
</style>
