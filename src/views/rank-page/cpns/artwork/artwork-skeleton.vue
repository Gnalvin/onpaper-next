<template>
  <el-skeleton :loading="loading" class="skeleton">
    <template #template>
      <div class="title">
        <el-skeleton style="width: 300px" animated :rows="2">
          <template #template></template>
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
  width: 87vw;
  min-width: 950px;
  margin-top: 25px;
}
.title {
  width: 1000px;
  margin: 0 auto;
}
.container {
  margin: 0 auto;
  max-width: 1000px;
  .wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 45px;
  }
}
.img {
  width: 170px;
  height: 170px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
