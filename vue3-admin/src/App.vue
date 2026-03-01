<script setup lang="ts">
import { usrCounterStore } from "@/stores/counter";
const counterStore = usrCounterStore()
import Screen from "@/views/Screen/index.vue"
</script>

<template>
  <div class="app">
    <Screen />
  </div>
</template>

<style scoped>
.app{
    width: 100%;
    height: 100%;
}
</style>
