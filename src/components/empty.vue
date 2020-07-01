<template>
  <div class="empty">
    <div class="box">
      <img :src="require(`@/assets/img/empty.png`)" width="256" height="256" />
      <div class="text">空空如也</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  height: calc(100% - 36px);
  position: relative;
  .box {
    position: absolute;
    top: calc(50% - 36px);
    left: 50%;
    transform: translate(-50%, -50%);
    .text {
      text-align: center;
      color: lightgray;
    }
  }
}
</style>
