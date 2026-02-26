<script setup lang="ts">
import { provide, ref, onMounted, useTemplateRef } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import VModel from './components/VModel.vue'
const changeName = (name: string) => {
  console.log(name)
}
const input = ref('')
// provide('msg', 'hello world')

const helloWorldRef = useTemplateRef<InstanceType<typeof HelloWorld> | null>('helloWorldRef') //ref<InstanceType<typeof HelloWorld>>()
const onClick = () => {
  helloWorldRef.value?.logMsg()

}


</script>

<template>
  <!-- <div @click="onClick">11</div> -->
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" @changeName="changeName" ref="helloWorldRef" />
  <VModel v-model="input"></VModel>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
