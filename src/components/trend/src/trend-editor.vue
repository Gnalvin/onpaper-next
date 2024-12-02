<template>
  <div class="trend-editor">
    <EditorItem @close="$emit('close')"></EditorItem>
  </div>
</template>

<script setup lang="ts">
import EditorItem from '../cpn/editor-item.vue'
defineEmits(['close'])
</script>

<style scoped lang="less">
.trend-editor {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
