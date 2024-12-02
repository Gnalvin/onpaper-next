<template>
  <div class="skeleton-card">
    <div class="skeleton-cover loading"></div>
    <div class="skeleton-info">
      <p class="skeleton-text loading" style="width: 80%"></p>
      <p class="skeleton-text loading" style="width: 50%"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  // 100% 为正方形,75% = 16:9
  paddingTop: {
    type: String,
    default: '75%'
  }
})
</script>

<style scoped lang="less">
.skeleton-card {
  position: relative;
  padding-top: v-bind('props.paddingTop');
  .skeleton-cover {
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: v-bind('props.paddingTop');
  }
  .skeleton-info {
    margin-top: 7px;
    .skeleton-text {
      border-radius: 3px;
      margin: 0 0 6px 0;
      height: 19px;
    }
  }
}
.loading {
  background: linear-gradient(
    -45deg,
    var(--skeleton-color) 25%,
    var(--skeleton-to-color) 45%,
    var(--skeleton-color) 65%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
</style>
