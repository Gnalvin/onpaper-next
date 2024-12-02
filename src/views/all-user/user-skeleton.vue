<template>
  <div class="content-wrap">
    <el-skeleton class="row" animated :count="3">
      <template #template>
        <div class="container">
          <div class="avatar-item">
            <el-skeleton-item
              variant="circle"
              style="width: 70px; height: 70px"
            />
          </div>
          <div class="info">
            <el-skeleton :rows="4" />
          </div>
          <div class="artwork-info" style="display: flex; margin-bottom: 10px">
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img" />
            <el-skeleton-item variant="image" class="img is-show-one" />
            <el-skeleton-item variant="image" class="img is-show-two" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
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

@media (max-width: 1450px) {
  .is-show-one {
    display: none;
  }
}

@media (max-width: 1200px) {
  .is-show-one {
    display: none;
  }
  .is-show-two {
    display: none;
  }
}
</style>
