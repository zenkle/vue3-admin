<template>
  <div>
    <h3>组件 B (计数器: {{ count }})</h3>
    <button @click="count++">增加</button>
    <p>状态：{{ isActivated ? '活跃' : '非活跃' }}</p>
  </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated, getCurrentInstance } from 'vue';

const count = ref(0);
const isActivated = ref(true);
const instance = getCurrentInstance();

// 标记自己可以被 keep-alive 识别 (可选，取决于实现细节)
if(instance) {
  instance.type.name = 'ComponentB'; 
}

onActivated(() => {
  console.log('B activated');
  isActivated.value = true;
});

onDeactivated(() => {
  console.log('B deactivated');
  isActivated.value = false;
});
</script>