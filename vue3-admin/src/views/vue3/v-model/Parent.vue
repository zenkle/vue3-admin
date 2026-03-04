<template>
    <div>
        <h1>Parent:{{ parentValue }}</h1>
        <Child v-model:modelValue="parentValue"></Child>
    </div>
</template>

<script setup lang="ts">
import Child from "./Child.vue";

import { ref } from "vue";

const parentValue = ref("parent value");
</script>