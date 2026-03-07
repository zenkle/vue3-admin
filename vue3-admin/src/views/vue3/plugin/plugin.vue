<template>
    <button @click="showToast">Toast</button>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const showToast = () => {
    proxy.$myToast("Hello, Vue 3!");
};
</script>