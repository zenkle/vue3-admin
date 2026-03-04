<template>
    <div>
        <p>姓名: {{ displayName }}</p>
        <p>年龄: {{ displayAge }}</p>
        <p>城市: {{ displayCity }}</p>
        <button @click="updateName">修改姓名 (Set)</button>
        <button @click="addAge">增加年龄 (Set)</button>
        <button @click="changeCity">修改嵌套城市 (Deep)</button>
    </div>
</template>
<script setup lang="ts">
import { ref, effect } from "./ref";
import { ref as vueRef } from "vue";
const state = ref({
    name: "张三",
    age: 25,
    address: {
        city: "北京",
    },
});

let displayName = vueRef("");
let displayAge = vueRef("");
let displayCity = vueRef("");

const render = () => {
    displayName.value = state.value.name;
    displayAge.value = state.value.age.toString();
    displayCity.value = state.value.address.city;
}
effect(render);

const updateName = () => {
    state.value.name = "李四";
}
const addAge = () => {
    state.value.age++;
}
const changeCity = () => {
    state.value.address.city = "上海";
}
const deleteName = () => {
    delete state.value.name;
}
</script>