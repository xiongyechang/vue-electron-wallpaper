<template>
  <div>
    <el-form class="form-setting">
      <el-form-item label="主题颜色: " label-width="80px">
        <el-input type="color" v-model="theme"></el-input>
      </el-form-item>
      <el-form-item label="下载路径: " label-width="80px">
        <el-input
          type="text"
          v-model="path"
          @click.native="setSavePath"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="检查更新: " label-width="80px">
        <el-button @click="update">更新</el-button>
      </el-form-item> -->
    </el-form>
    <!-- <update-dialog :visible.sync="visible"></update-dialog> -->
  </div>
</template>

<script>
// import UpdateDialog from "@/components/update-dialog.vue";
import { remote, ipcRenderer } from "electron";
// import {
//   checkForUpdate,
//   isUpdate,
//   downloadProgress,
//   cancelUpdate,
// } from "@/models/update";
export default {
  name: "setting",
  data() {
    return {
      theme: "",
      path: "",
      // visible: false,
    };
  },

  mounted() {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.style.setProperty("--primary-color", theme);
      this.theme = theme;
    }

    this.$watch("theme", function(n) {
      localStorage.setItem("theme", n);
      document.documentElement.style.setProperty("--primary-color", n);
    });

    this.path = remote.app.getPath("downloads");
  },

  methods: {
    setSavePath() {
      const res = remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });

      if (Array.isArray(res)) {
        remote.app.setPath("downloads", res[0]);
        this.path = res[0];
      }
    },
    // update() {
    //   ipcRenderer.send(checkForUpdate);

    //   ipcRenderer.on(isUpdate, (event) => {
    //     this.visible = true;
    //   });
    // },
  },
};
</script>

<style lang="scss">
.form-setting {
  padding-right: 10px;
}
</style>
