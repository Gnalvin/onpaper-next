<template>
  <el-skeleton :loading="loading" class="skeleton">
    <template #template>
      <div class="title">
        <el-skeleton style="width: 300px" animated :rows="2">
          <template #template></template>
        </el-skeleton>
      </div>
      <div class="content-wrap">
        <el-skeleton class="row" animated :count="3">
          <template #template>
            <div class="container">
              <div class="rank">
                <el-skeleton-item variant="p" style="width: 50%" />
              </div>
              <div class="avatar-item">
                <el-skeleton-item
                  variant="circle"
                  style="width: 70px; height: 70px"
                />
              </div>
              <div class="info">
                <el-skeleton :rows="4" />
              </div>
              <div
                class="artwork-info"
                style="display: flex; margin-bottom: 10px"
              >
                <el-skeleton-item variant="image" class="img" />
                <el-skeleton-item variant="image" class="img" />
                <el-skeleton-item variant="image" class="img" />
              </div>
            </div>
          </template>
        </el-skeleton>
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
  width: 1100px;
  margin: 0 auto;
}
.row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
.container {
  display: flex;
  border-bottom: 1px solid var(--border-color1);
  margin-bottom: 40px;
}
.rank {
  width: 80px;
  padding-top: 24px;
  padding-bottom: 24px;
}
.info {
  margin: 0 20px 0 25px;
  width: 265px;
}
.img {
  width: 180px;
  height: 180px;
  margin-right: 20px;
  border-radius: 10px;
}
</style>
