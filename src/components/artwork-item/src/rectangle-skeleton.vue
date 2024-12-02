<template>
  <ElSkeleton class="skeleton" animated>
    <template #template>
      <ElSkeletonItem class="wrap"></ElSkeletonItem>
    </template>
    <template #default>
      <slot> </slot>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.skeleton {
  width: 100%;
  height: 100%;
}
.wrap {
  height: 100%;
}
</style>
