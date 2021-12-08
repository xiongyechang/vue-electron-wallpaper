<template>
<div class="preview-wrapper">
    <img :src="data.uri" loading="lazy" class="bk-img" />
</div>
</template>

<script>
export default {
  name: "preview",
  props: {
    data: Object,
    index: Number,
  },
  data() {
    return {
      backgroundImage: null
    };
  },
};
</script>

<style lang="scss" scoped>
.preview-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .bk-img{
      width: 100%;
      height: 100%;
  }
}
</style>