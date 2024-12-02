<template>
  <button
    class="wl-btn"
    :class="{ disable, cancel }"
    @click="handleClick($event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import useMainStore from '@/stores/module/main'

const props = defineProps({
  disable: {
    type: Boolean,
    default: false
  },
  cancel: {
    type: Boolean,
    default: false
  },
  verifyLogin: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['click'])
const mainStore = useMainStore()

const handleClick = (event: Event) => {
  if (props.disable) return
  if (props.verifyLogin && !mainStore.verifyIsLogin()) return
  emits('click', event)
}
</script>

<style scoped lang="less">
.wl-btn {
  font-size: 12px;
  line-height: 1;
  transition: background-color 0.3s, color 0.3s;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  padding: 12px 30px;
  margin: 10px 10px;
  background-color: var(--btn-color1);
  user-select: none;
  &:hover {
    background-color: var(--btn-color1-hover);
  }
}
.disable {
  color: rgba(255, 255, 255, 0.9);
  background-color: var(--primary-disable-color) !important;
  cursor: not-allowed;
}
.cancel {
  background-color: var(--btn-cancel-color);
  color: var(--text-color);
  &:hover {
    background-color: var(--btn-cancel-hover-color);
  }
}
</style>
