<template>
    <div>
        <h1> {{ counterStore.count }}</h1>
        <h1> {{ counterStore.doubleCount }}</h1>
        <button @click="counterStore.increment">increment</button>
    </div>
</template>

<script setup lang="ts">
const miniPinia = inject('miniPinia');

const useCounterStore = miniPinia.defineStore({
    id: 'counter',
    state: () => ({
        count: 0,
    }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        }
    }
});

const counterStore = useCounterStore();
</script>