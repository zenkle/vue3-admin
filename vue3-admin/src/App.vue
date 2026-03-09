<script setup lang="ts">
// import { usrCounterStore } from "@/stores/counter";
// const counterStore = usrCounterStore()
// import Screen from "@/views/Screen/index.vue"
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
</script>

<template>
  <div class="app">
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
    <!-- <Screen /> -->
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100%;
}
</style>
