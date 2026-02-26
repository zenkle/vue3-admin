<script setup lang="ts">
import variables from "@/styles/variables.module.scss";
import { usrCounterStore } from "@/stores/counter";
const counterStore = usrCounterStore()
</script>

<template>

  <div class="card">
    <div>count is {{ counterStore.count }}</div>
    <div>doubleCount is {{ counterStore.doubleCount }}</div>
  </div>

  <el-button type="primary"><i-ep-plus />Primary Button</el-button>
  <el-button type="info">
    <svgIcon icon-class="bell" />SVG 本地图标
  </el-button>
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
