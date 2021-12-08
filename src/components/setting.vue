<template>
  <div class="form-setting-wrap">
    <el-form class="form-setting">
      <el-form-item label="主题颜色: " label-width="80px">
        <el-input type="color" v-model="currentTheme"></el-input>
      </el-form-item>
      <el-form-item label="下载路径: " label-width="80px">
        <el-input
          type="text"
          v-model="currentPath"
          @click="setSavePath"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="form-bottom">
      <el-button type="primary" size="small" @click="saveSetting">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { remote } from "electron";
export default defineComponent({
  name: 'setting',
  setup(props, { emit }) {

    const currentTheme = ref(``);

    const currentPath = ref(``);

    onMounted(() => {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        document.documentElement.style.setProperty("--primary-color", savedTheme);
        currentTheme.value = savedTheme;
      }

      currentPath.value = remote.app.getPath('downloads');
    })

    function setSavePath() {
      const res = remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });

      if (Array.isArray(res)&&res.length) {
        currentPath.value = res[0];
      }
    }

    function saveSetting() {
      remote.app.setPath("downloads", currentPath.value);
      localStorage.setItem("theme", currentTheme.value);
      document.documentElement.style.setProperty("--primary-color", currentTheme.value);
      emit('setted');
    }

    return {
      currentTheme,
      currentPath,
      setSavePath,
      saveSetting,
    }
  }
});
</script>

<style lang="scss">
.form-setting-wrap {
  position: relative;
  height: 100%;
}

.form-setting {
  padding-right: 10px;
}

.form-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top: 1px solid lightgrey;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
</style>
