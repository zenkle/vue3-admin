<template>
  <div class="screen-header">
    <h1><span>this is screen</span> </h1>

    <div class="screen-header__title">可视化</div>
    <div class="screen-header__right">
      <SvgIcon icon-class="github_light" />
      <img src="" alt="">
      <span>{{ currentTimeFormatted }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">

const formatter = shallowRef('dddd YYYY-MM-DD HH:mm:ss')
const currentTimeFormatted = useDateFormat(useNow(), formatter.value)
</script>
<style lang="scss" scoped>
.screen-header {
  position: relative;
  width: 100%;
  height: var(--screen-header-height);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/screen/header_border_dark.png');

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 7px;
    text-shadow: 0px 2px 20px rgba(222, 171, 155, 0.6);
  }

  &__right {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);

    img {
      width: 30px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
}
</style>