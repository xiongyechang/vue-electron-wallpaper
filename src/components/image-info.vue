<template>
  <div class="image-info">
    <el-row>
      <el-col :span="6">名称</el-col>
      <el-col :span="18">{{ ImageInfo.name }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">可用性</el-col>
      <el-col :span="18">{{ ImageInfo.available ? "可用" : "不可用" }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">图片质量</el-col>
      <el-col :span="18">{{ map[ImageInfo.quality] }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">图片</el-col>
      <el-col :span="18">
        <img :src="ImageInfo.uri" :style="{width: '100%'}" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">类型</el-col>
      <el-col :span="18">
        {{ ImageInfo.mime }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">大小</el-col>
      <el-col :span="18"> {{ (ImageInfo.size / 1000000).toFixed(2) }} MB </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">宽度</el-col>
      <el-col :span="18"> {{ ImageInfo.width }} px </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">高度</el-col>
      <el-col :span="18"> {{ ImageInfo.height }} px </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">更新时间</el-col>
      <el-col :span="18">
        {{ new Date(ImageInfo.updatedAt).toLocaleDateString() }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name: "image-info",
  props: {
    ImageInfo: {
      type: Object,
      required: true,
      default: null,
    },
  },
  setup() {
   
    const map = reactive({
      low: "低",
      middle: "中",
      high: "高",
    });

    return {
      map
    }
  }
});
</script>

<style lang="scss">
.image-info {
  padding: 0 10px;
  font-size: 12px;
  .el-row {
    margin: 5px 0;
  }
}
</style>
