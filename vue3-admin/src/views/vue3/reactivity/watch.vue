<template>
    <div>{{ displayValue }}</div>
    <button @click="addCount">增加</button>
    <div>{{ state.value }}</div>
</template>
<script setup lang="ts">
import { ref } from './ref'
import { ref as vueRef } from "vue";
import { watch } from "./watch";
const state = ref(1)
const displayValue = vueRef("");
const unwatch = watch(state, (newVal, oldVal) => {
    console.log(newVal, oldVal)
    // displayValue.value = newVal;

}, {
    immediate: true,
})
const addCount = () => {
    state.value++;
}
// unwatch()
</script>
