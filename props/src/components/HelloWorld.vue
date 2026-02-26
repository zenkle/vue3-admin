<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Child from './Child.vue'
const emit = defineEmits<{
  (e: 'changeName', content: string): void
}>()

const count = ref(0)


const logMsg = () => {
  console.log('11')
}
defineExpose({
  logMsg
})
</script>

<template>
  <!-- <h1 @click="emit('changeName', 'new name')">11</h1> -->
  <child>
    <template #item="{ user: { id, name, role } }">
      {{ id }} {{ name }} {{ role }}
    </template>
  </child>


</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
