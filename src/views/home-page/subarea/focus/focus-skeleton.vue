<template>
  <el-skeleton :loading="loading" class="skeleton">
    <template #template>
      <div class="user-list">
        <template v-for="index of 10" :key="index">
          <el-skeleton style="--el-skeleton-circle-size: 90px" animated>
            <template #template>
              <el-skeleton-item variant="circle" />
            </template>
          </el-skeleton>
        </template>
      </div>
      <div class="text">
        <el-skeleton animated style="width: 300px" :rows="2">
          <template #template> </template>
        </el-skeleton>
      </div>
      <div class="container">
        <ElSkeleton class="wrap" animated :count="3">
          <template #template>
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
          </template>
        </ElSkeleton>
      </div>
    </template>
    <template #default>
      <slot> </slot>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.skeleton {
  width: 1200px;
  margin: 25px auto 0;
}
.user-list {
  display: flex;
  margin-bottom: 30px;
  :deep(.el-skeleton) {
    width: auto;
    margin-right: 20px;
    .el-skeleton__circle {
      border-radius: 0px !important;
    }
  }
}
.container {
  .wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 45px;
  }
}
.img {
  width: 200px;
  height: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
