<template>
  <div class="control-bar">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-button
          type="primary"
          @click="batchDownload"
          icon="el-icon-download"
          :disabled="!disabledButton"
          >批量下载{{ computedSelectedImageList }}</el-button
        >
      </el-col>
      <el-col :span="12">
        <marquee
          onmouseleave="this.start()"
          onmouseover="this.stop()"
          direction="left"
          behavior="scroll"
        >
          1.右键点击图片可以 [下载] [预览] [设置为壁纸] 等操作. 2.预览图片点击
          [ESC] 按钮可以退出预览. 3. [高清图片] 尚未爬取成功(仅[美女图片]前 9
          页存在高清图片), 正在努力解决中...
        </marquee>
      </el-col>
      <el-col :span="8" style="padding-right: 16px">
        <el-input
          placeholder="请输入搜索内容..."
          v-model="keyword"
          @input="input"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { remote } from "electron";
import { WallpaperService, WallpaperTypeService } from "@/services";
import { debounce } from "lodash";
import Mixin from "@/mixins";
export default {
  name: "controlbar",
  props: {
    selectedImageList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      keyword: "",
    };
  },
  computed: {
    computedSelectedImageList() {
      return this.selectedImageList.length
        ? `  (${this.selectedImageList.length}张)`
        : "";
    },
    disabledButton() {
      return !!this.selectedImageList.length;
    },
  },
  mixins: [Mixin],
  methods: {
    input: debounce(function() {
      this.$emit("searchend", this.keyword);
    }, 1000),

    batchDownload() {
      if (!this.selectedImageList.length) {
        this.$notify({
          title: "提示",
          message: "请选择图片",
          duration: 3000,
          type: "warning",
        });
        return;
      }
      const mainWindow = remote.BrowserWindow.getFocusedWindow();
      for (let uri of this.selectedImageList) {
        let e = mainWindow.webContents.downloadURL(uri);
      }
    },
  },
};
</script>

<style scoped>
.control-bar {
  height: 36px;
  line-height: 36px;
  margin: 0 5px 0 5px;
}

marquee {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: red;
}
</style>
