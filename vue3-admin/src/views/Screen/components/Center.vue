
<template>
  <div class="screen-center">
    <div class="screen-center__top">
      <Map />
    </div>
    <Bottom />
  </div>
</template>
<script setup lang="ts">
import Bottom from './center/Bottom.vue'
import Map from './center/Map.vue'
</script>
<style lang="scss" scoped>
.screen-center {
  position: relative;
  width: 100%;
  height: 100%;
  &__top{
    height: calc(100% - 150px);
  }

}
</style>