<template>
  <div id="app">
    <top-bar></top-bar>
    <main class="main">
      <nav class="nav">
        <nav-menu></nav-menu>
      </nav>
      <section class="section">
        <keep-alive>
          <router-view :key="$route.fullPath" />
        </keep-alive>
      </section>
    </main>
    <update-dialog :visible.sync="visible"></update-dialog>
  </div>
</template>

<script>
import TopBar from "@/components/topbar.vue";
import NavMenu from "@/components/nav-menu.vue";
import UpdateDialog from "@/components/update-dialog";
import { ipcRenderer } from "electron";
import { debounce } from "lodash";
import { checkForUpdate, isUpdate } from "@/models/update";
import path from "path";
import { remote, shell } from "electron";
import Mixin from "@/mixins";
export default {
  name: "App",
  components: { TopBar, NavMenu, UpdateDialog },
  data() {
    return {
      visible: false,
    };
  },

  created() {
    // 检查是否有更新
    ipcRenderer.send(checkForUpdate);

    // 有更新
    ipcRenderer.on(isUpdate, (event) => {
      this.visible = true;
    });

    ipcRenderer.on(
      "download-done",
      debounce((event, { name, receive, total }) => {
        const imagePath = path.join(remote.app.getPath("downloads"), name);
        const notification = new Notification("图片下载通知", {
          body: "图片下载成功",
          icon: imagePath,
        });

        notification.addEventListener("click", function() {
          shell.openItem(imagePath);
        });
      }),
      1000
    );
  },
  mixins: [Mixin],
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
:root {
  --primary-color: #31c17c;
}
html,
body,
#app {
  height: 100vh;
  width: 100vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  font-size: 16px;
  overflow: hidden;
}

.main {
  display: flex;
  width: 100%;
  height: calc(100% - 33px);
  .nav {
    height: 100%;
    background: #edeeef;
  }
  .section {
    flex: 1;
    min-width: calc(100% - 220px);
    height: 100%;
    &_search__row {
      text-align: right;
      padding: 10px 40px 10px 10px;
    }
  }
}

button {
  background: #ffffff;
  outline: none;
  border: 1px solid #bababa;
  cursor: pointer;
}

.clearfix {
  &::after {
    display: block;
    clear: both;
  }
}

.contextmenu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0);
  ul {
    position: fixed;
    background: #ffffff;
    width: 200px;
    padding: 10px 0;
    font-size: 14px;
  }
  li {
    list-style: none;
    padding: 5px 10px;
    i {
      margin-right: 10px;
    }
    &:hover {
      background-color: var(--primary-color);
      color: #ffffff;
      cursor: pointer;
    }
  }
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--primary-color) !important;
}

.el-select .el-input__inner:focus {
  border-color: var(--primary-color) !important;
}
.el-select-dropdown__item.selected {
  color: var(--primary-color) !important;
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: var(--primary-color) !important;
}

.el-input__inner,
.el-upload-dragger,
.el-button,
.el-notification,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  border-radius: 0 !important;
}

.el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: var(--primary-color) !important;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: var(--primary-color) !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--primary-color) !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  color: #ffffff !important;
}

.el-radio__input.is-checked .el-radio__inner {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.el-radio__input.is-checked + .el-radio__label {
  color: var(--primary-color) !important;
}
.el-button-primary {
  background-color: var(--primary-color) !important;
}
.el-button {
  &:hover {
    color: #fff !important;
    border-color: 1px solid var(--primary-color) !important;
    background-color: var(--primary-color) !important;
    opacity: 0.6 !important;
  }
}

.el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;

  &:focus,
  &:hover {
    opacity: 0.8 !important;
    color: #fff !important;
  }
}

.el-upload-dragger:hover {
  border-color: var(--primary-color) !important;
}
.el-select-dropdown__item.selected {
  color: var(--primary-color) !important;
}
.el-progress-bar__inner {
  background-color: var(--primary-color) !important;
}
</style>
