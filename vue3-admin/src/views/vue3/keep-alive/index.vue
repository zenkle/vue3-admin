<!-- App.vue -->
<template>
  <div>
    <button @click="current = ComponentA">显示组件 A</button>
    <button @click="current = ComponentB">显示组件 B</button>
    
    <a-keep-alive :max="2" include="['ComponentA', 'ComponentB']">
      <component :is="current" />
    </a-keep-alive>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AKeepAlive from './AKeepAlive.vue';
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';

const current = ref(ComponentA);
import { defineAsyncComponent } from 'vue';
</script>