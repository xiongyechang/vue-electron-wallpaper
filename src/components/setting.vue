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
    </el-form>
  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import Mixin from "@/mixins";
export default {
  name: "setting",
  data() {
    return {
      theme: "",
      path: "",
    };
  },

  mounted() {
    this.path = remote.app.getPath("downloads");
  },
  mixins: [Mixin],
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
  },
};
</script>

<style lang="scss">
.form-setting {
  padding-right: 10px;
}
</style>
