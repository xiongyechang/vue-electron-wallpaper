<template>
  <el-dialog :visible="visible" :title="getTitle" @close="close">
    <div>
      <div style="text-align:center;padding: 20px 0;height: 100px;">
        <el-progress
          type="circle"
          color="var(--primary-color)"
          :percentage="percentage"
        ></el-progress>
      </div>
      <br />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAction">取消下载</el-button>
        <el-button type="primary" @click="confirmAction">下载更新</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  checkForUpdate,
  isUpdate,
  downloadProgress,
  cancelUpdate,
} from "@/models/update";
import { ipcRenderer } from "electron";
export default {
  name: "update-dialog",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      percentage: 0,
      total: 0,
    };
  },
  computed: {
    getTitle: function() {
      return "检测到新的版本" + (this.total ? `[${this.total}M]` : "");
    },
  },
  mounted() {
    // 下载进度
    ipcRenderer.on(downloadProgress, (event, progressObj) => {
      this.total = (progressObj.total / (1024 * 1024)).toFixed(2);
      this.percentage = parseFloat(progressObj.percent.toFixed(2));
    });
  },
  methods: {
    confirmAction() {
      // 下载
      ipcRenderer.send(isUpdate, true);
    },
    cancelAction() {
      this.percentage = 0;
      this.$emit("update:visible", false);
      ipcRenderer.send(cancelUpdate, true);
    },
    close() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 40px;
  text-align: right;
}
</style>
