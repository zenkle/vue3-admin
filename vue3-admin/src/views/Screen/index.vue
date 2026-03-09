<template>
  <div :class="['screen-container']">
    <div class="screen">
      <Header />

      <div class="screen-main">
        <div class="screen-main__left">
          <left />
        </div>
        <div class="screen-main__center">
          <Center />
        </div>
        <div class="screen-main__right">
          <Right />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "@/views/Screen/components/Header.vue";
import Left from "@/views/Screen/components/Left.vue";
import Center from "@/views/Screen/components/Center.vue";
import Right from "@/views/Screen/components/Right.vue";
import { useResize } from "@/composables/useResize";

const { screenRef: SCREEN_REF } = useResize();
</script>
<style lang="scss" scoped>
.screen-container {
  --es-header-height: 72px;
  --es-block-bg: #222733;
  --es-screen-bg: rgb(22, 21, 34);
  --es-screen-text-color: #fff;
  width: 100%;
  height: 100%;
  color: var(--es-screen-text-color);
  background: var(--es-screen-bg);
  background-color: #f5f5f5;
}

.screen {
  width: 100%;
  height: 100%;
}

.screen-main {
  display: flex;
  height: calc(100% - var(--es-header-height));

  &__center {
    flex: 1;
  }

  &__left,
  &__right {
    width: 460px;
  }
}
</style>
