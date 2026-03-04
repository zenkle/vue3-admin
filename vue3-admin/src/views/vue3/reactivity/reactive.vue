<template>
    <div>
        <p>姓名: {{ displayName }}</p>
        <p>年龄: {{ displayAge }}</p>
        <p>城市: {{ displayCity }}</p>
        <button @click="updateName">修改姓名 (Set)</button>
        <button @click="addAge">增加年龄 (Set)</button>
        <button @click="changeCity">修改嵌套城市 (Deep)</button>
        <button @click="deleteName">删除姓名 (Delete)</button>
    </div>
</template>
<script setup lang="ts">
import { reactive } from "./reactive";
import { effect } from "./ref";
import { ref as vueRef } from "vue";

const state = reactive({
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
    displayName.value = state.name;
    displayAge.value = state.age.toString();
    displayCity.value = state.address.city;
}
effect(render);

const updateName = () => {
    state.name = "李四";
}
const addAge = () => {
    state.age++;
}
const changeCity = () => {
    state.address.city = "上海";
}
const deleteName = () => {
    delete state.name;
}
</script>
