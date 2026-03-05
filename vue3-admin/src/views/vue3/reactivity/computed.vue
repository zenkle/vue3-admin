<template>
    <div>
        <p>{{ doubleDisplay }}</p>
        <div><button @click="addCount">增加</button></div>
    </div>
</template>
<script setup lang="ts">
import { ref, effect } from "./ref";
import { computed  as computedRef } from "./computed";
import { ref as vueRef } from "vue";
const state = ref({
    count: 1,
});
let doubleDisplay = vueRef("");

const doubleCount = computedRef(() => {
    return state.value.count * 2;
})
const render = () => {
    doubleDisplay.value = doubleCount.value;
}
effect(render);

const addCount = () => {
    state.value.count++;
}
</script>
