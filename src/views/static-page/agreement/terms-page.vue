<template>
  <div class="term-page">
    <div class="container">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
document.body.style.minWidth = '0px'
</script>

<style scoped lang="less">
.term-page {
  background-color: #fff;
  color: #333;
}
.container {
  box-sizing: border-box;
  min-width: 0;
  margin: auto;
  padding: 40px 16px 80px;
  max-width: 640px;
  color: #000;
}
</style>
