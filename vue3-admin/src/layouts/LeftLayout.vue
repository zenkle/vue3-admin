<template>
    <BaseLayout>
        <div class="layout__sidebar">222</div>

        <div class="layout__main">
            <router-view></router-view>
        </div>
    </BaseLayout>
</template>
<style lang="scss" scoped>
.layout__sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: $sidebar-width;
    background-color: $menu-background;
    transition: width 0.28s;
}

.layout__main {
    position: relative;
    height: 100%;
    margin-left: $sidebar-width;
    overflow-y: auto;
    transition: margin-left 0.28s;
}
</style>
