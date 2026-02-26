<script setup lang="ts">

const props = defineProps<{ msg: string }>()
interface User {
    id: number;
    name: string;
    role: string;
}
const users: Array<User> = [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' }
];


const slots = defineSlots<{
    item(props: { user: User }): any
}>()
</script>

<template>
    <div>
        child:{{ msg }}
        <div v-for="item in users" :key="item.id">
            <slot name="item" :user="item"></slot>
        </div>
    </div>
</template>

<style scoped></style>