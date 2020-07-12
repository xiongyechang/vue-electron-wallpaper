<template>
  <div v-if="Info" class="image-info">
    <el-row>
      <el-col :span="6">名称</el-col>
      <el-col :span="18">{{ Info.name }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">可用性</el-col>
      <el-col :span="18">{{ Info.available ? "可用" : "不可用" }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">图片质量</el-col>
      <el-col :span="18">{{ map[Info.quality] }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="6">图片</el-col>
      <el-col :span="18">
        <img :src="Info.uri" width="100%" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">类型</el-col>
      <el-col :span="18">
        {{ Info.mime }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">大小</el-col>
      <el-col :span="18"> {{ (Info.size / 1000000).toFixed(2) }} MB </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">宽度</el-col>
      <el-col :span="18"> {{ Info.width }} px </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">高度</el-col>
      <el-col :span="18"> {{ Info.height }} px </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">更新时间</el-col>
      <el-col :span="18">
        {{ new Date(Info.updatedAt).toLocaleDateString() }}
      </el-col>
    </el-row>
  </div>
  <div v-else>
    <empty></empty>
  </div>
</template>

<script>
import { WallpaperService } from "@/services/wallpaper.service";
import Empty from "@/components/empty.vue";
export default {
  name: "image-info",
  props: {
    ImageInfo: {
      type: Object,
      required: true,
      default: null,
    },
  },
  components: {
    Empty,
  },
  data() {
    return {
      Info: null,
      map: {
        low: "低",
        middle: "中",
        high: "高",
      },
    };
  },
  created() {
    this.getHighDefinition();
  },
  methods: {
    async getHighDefinition() {
      const { data, status, msg } = await WallpaperService.findOne(
        this.ImageInfo.name,
        "high"
      );

      if (status === 0) {
        this.Info = data;
      }
    },
  },
};
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
