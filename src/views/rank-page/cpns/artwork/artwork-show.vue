<template>
  <div class="show-wrap">
    <SquareShow :artworks="artworks" class="square-show">
      <template v-slot:default="slotProps">
        <SquareArtItem
          :rank="slotProps.index + 1"
          :padding-top="'100%'"
          :artwork-item="slotProps.item"
          :is-show-time="false"
          :big-title="true"
        ></SquareArtItem>
      </template>
    </SquareShow>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { IArtwork } from '@/service/rank-page/type'
import { SquareArtItem } from '@/components/artwork-item'
import SquareShow from '@/components/artwork-show/square-show.vue'

defineProps({
  artworks: {
    type: Array as PropType<IArtwork[]>,
    required: true
  }
})
</script>

<style scoped lang="less">
.show-wrap {
  flex-grow: 1;
  margin-top: 20px;
  --column-count: 6;
  max-width: 1450px;
}

@media (max-width: 1290px) {
  .show-wrap {
    --column-count: 5;
  }
}

@media (max-width: 1050px) {
  .show-wrap {
    --column-count: 4;
  }
}
</style>
