<template>
  <div class="invite">
    <div class="container">
      <Form></Form>
      <Suggest></Suggest>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import useCommissionStore from '@/stores/module/commission'
import Suggest from './invite-suggest.vue'
import Form from './invite-form.vue'

const route = useRoute()
const commissionStore = useCommissionStore()
commissionStore.getUserPlanAction(route.params.userId as string)
</script>

<style scoped lang="less">
.container {
  display: flex;
  max-width: 1250px;
  padding: 40px 75px;
  margin: 0px auto;
}

@media (max-width: 1250px) {
  .container {
    padding: 40px 55px;
  }
}
@media (max-width: 1150px) {
  .container {
    padding: 40px 25px;
  }
}
</style>
