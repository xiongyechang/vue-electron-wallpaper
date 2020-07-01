<template>
  <div id="topbar" ref="topbar">
    <div>
      <span>VueElectronWallpaper{{ app.getVersion() }}</span>
    </div>
    <div>
      <span @click.stop="minimize">
        <i class="el-icon-minus"></i>
      </span>
      <span @click.stop="maximize">
        <i :class="fullscreen"></i>
      </span>
      <span @click.stop="close">
        <i class="el-icon-close"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";

const WindowSize = {
  maximize: "maximize",
  minimize: "minimize",
  normal: "normal",
};

const WindowSizeIcon = {
  max: "el-icon-full-screen",
  normal: "el-icon-copy-document",
};

export default {
  name: "topbar",
  data() {
    return {
      currWindow: null,
      app: remote.app,
      windowSize: WindowSize.normal,
    };
  },
  mounted() {
    this.currWindow = remote.getCurrentWindow(); // 当前窗口

    document.addEventListener("visibilitychange", () => {
      var isHidden = document.hidden;
      if (isHidden) {
        if (this.currWindow.isMinimized()) {
          this.windowSize = WindowSize.minimize;
        } else {
          this.windowSize = WindowSize.normal;
        }
      } else {
        if (this.currWindow.isMaximized()) {
          this.windowSize = WindowSize.maximize;
        } else {
          this.windowSize = WindowSize.normal;
        }
      }
    });
  },
  computed: {
    fullscreen: function() {
      return this.windowSize === WindowSize.normal
        ? WindowSizeIcon.max
        : WindowSizeIcon.normal;
    },
  },
  methods: {
    maximize() {
      if (this.currWindow.isMaximized()) {
        this.currWindow.unmaximize();
        this.windowSize = WindowSize.normal;
      } else {
        this.currWindow.maximize();
        this.windowSize = WindowSize.maximize;
      }
    },
    // 最小化窗口
    minimize() {
      if (!this.currWindow.isMinimized()) {
        this.currWindow.minimize();
        this.windowSize = WindowSize.minimize;
      }
    },
    close() {
      remote.app.quit();
    },
  },
};
</script>

<style lang="scss" scoped>
#topbar {
  height: 33px;
  background: var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  div {
    height: 33px;
    &:first-child {
      span:last-child:hover {
        background: var(--primary-color);
      }
    }
    &:last-child {
      span:last-child:hover {
        background: red;
      }
    }
    span {
      display: inline-block;
      min-width: 40px;
      height: 33px;
      line-height: 33px;
      padding: 0 10px;
      text-align: center;
      color: #fff;
      -webkit-app-region: no-drag;
      &:hover {
        background: red;
      }
    }
  }
}
</style>
