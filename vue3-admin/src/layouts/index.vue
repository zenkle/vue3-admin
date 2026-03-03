<template>
    <div class="layout-wrapper">
        <component :is="currentLayoutComponent" />
        <!-- <Settings v-if="showSettings" /> -->
    </div>
</template>

<script setup lang="ts">
import LeftLayout from "./LeftLayout.vue";


const currentLayoutComponent = LeftLayout;

</script>

<style lang="scss" scoped>
.layout-wrapper {
    width: 100%;
    height: 100%;
}
</style>
