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
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  .box {
    .text {
      text-align: center;
      color: lightgray;
    }
  }
}
</style>
