<script setup lang="ts">
import { withDefaults } from 'vue'
const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <input v-model="props.modelValue" @input="(e) => emit('update:modelValue', e.target.value)"></input>
    <div>{{ props.modelValue }}</div>
</template>

<style scoped></style>