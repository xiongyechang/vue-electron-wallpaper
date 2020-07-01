<template>
  <div class="layout">
    <div class="top">
      <control-bar :selectedImageList="selectedImageList"></control-bar>
    </div>

    <template v-if="total">
      <div class="body">
        <div class="card" v-for="(item, index) of data" :key="index">
          <div
            class="card-top"
            :style="{
              top: item.checked ? '0px' : '-40px',
            }"
          >
            <el-checkbox v-model="item.checked">
              <span class="text">选择</span>
            </el-checkbox>
          </div>
          <el-image
            lazy
            :src="item.uri"
            :preview-src-list="[item.uri]"
            style="height: 100%;"
            @error="imageLoadError(item, index)"
            @contextmenu="contextmenu($event, item)"
          ></el-image>
        </div>
        <div style="clear:both;"></div>
      </div>

      <div class="footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[24, 48, 72, 96]"
          :current-page="page"
          :page-size="limit"
          :total="total"
          v-on="$listeners"
        ></el-pagination>
      </div>
    </template>
    <template v-else>
      <empty></empty>
    </template>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { formatTime } from "@/utils/utils";
import ControlBar from "@/components/controlbar.vue";
import Empty from "@/components/empty.vue";
import path from "path";
const wallpaper = require("wallpaper");
const fse = require("fs-extra");
const fs = require("fs");

import { WallpaperService } from "@/services";
import Mixins from "@/mixins";

const TEMP_IMAGES_DIR = "tempImages";

export default {
  name: "layout",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    page: Number,
    limit: Number,
    total: Number,
  },
  components: {
    ControlBar,
    Empty,
  },
  data() {
    return {
      visible: false,
    };
  },
  mixins: [Mixins],
  computed: {
    selectedImageList: {
      get: function(v, o) {
        return this.data.filter((item) => item.checked).map((item) => item.uri);
      },
    },
  },
  methods: {
    formatPath(uri) {
      return path.basename(uri).replace(/\.\w+/, "");
    },
    formatTime(timestamp) {
      return formatTime(new Date(timestamp), "yy-mm-dd");
    },
    switchTab(label) {
      this.$emit("tab-change", label);
    },
    imageLoadError({ _id }, index) {
      WallpaperService.remove(_id);
      this.data.splice(index, 1);
    },
    async saveTempImage(data, tempImagePath) {
      fs.writeFile(tempImagePath, data, "binary", async function(err) {
        if (err) {
          new Notification("壁纸设置异常");
        } else {
          await wallpaper.set(tempImagePath);
          new Notification("壁纸设置成功");
        }
      });
    },
    removeContextmenu() {
      const contextmenu = document.querySelector(".contextmenu");
      if (contextmenu) {
        contextmenu.remove();
      }
    },
    contextmenu(e, item) {
      this.removeContextmenu();
      const { clientX, clientY } = e;

      const div = document.createElement("div");
      const ul = document.createElement("ul");
      div.setAttribute("class", "contextmenu");

      div.addEventListener(
        "click",
        function(event) {
          this.remove();
        },
        false
      );

      div.oncontextmenu = function() {
        this.removeContextmenu();
      }.bind(this);

      // <li data-action="select"><i class="el-icon-document-checked">选择</li>

      const selected = item.checked;

      ul.innerHTML = `
        <li data-action="select" style="${
          selected ? "background: var(--primary-color);color:#ffffff;" : ""
        }"><i class="el-icon-document-checked"></i>${
        selected ? "已" : ""
      }选择</li>
        <li data-action="preview"><i class="el-icon-picture-outline"></i>预览</li>
        <li data-action="download"><i class="el-icon-download"></i>下载</li>
        <li data-action="wallpaper"><i class="el-icon-picture"></i>设置为壁纸</li>
        `;
      //  <li data-action="disabled"><i class="el-icon-close"></i>图片不可用</li>
      // <li data-action="report"><i class="el-icon-warning"></i>举报</li>
      ul.addEventListener(
        "click",
        async (event) => {
          switch (event.target.dataset.action) {
            case "select": {
              item.checked = !item.checked;
              break;
            }
            case "download":
              ipcRenderer.send("download", item.uri); // 下载
              break;
            case "wallpaper": {
              const tempImagePath = path.join(
                TEMP_IMAGES_DIR,
                path.basename(item.name)
              ); // 保存的地址

              fse
                .ensureDir(TEMP_IMAGES_DIR)
                .then(async () => {
                  let data = await this.requestImage(item.uri);
                  this.saveTempImage(data, tempImagePath);
                })
                .catch((e) => {
                  console.error(e);
                });

              break;
            }
            case "preview": {
              e.target.click();
              break;
            }
            // case ""
          }
        },
        false
      );

      ul.style.cssText = `top: ${clientY}px; left: ${clientX}px;`;

      div.appendChild(ul);
      document.body.appendChild(div);
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .top {
    height: 36px;
    line-height: 36px;
    margin: 0 5px 0 5px;
  }

  .body {
    height: calc(100% - 76px);
    overflow-y: auto;
  }
  .card {
    float: left;
    position: relative;
    width: 24%;
    min-width: 312px;
    margin: 0 0 10px 5px;
    height: 200px;
    background-color: #ffffff;
    overflow: hidden;
    &:hover .card-top {
      top: 0 !important;
    }
    &-top {
      transition: all 0.3s ease-in-out;
      position: absolute;
      top: -40px;
      right: 0;
      left: 0;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      background: rgba(255, 255, 255, 0.5);
      // box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.5);
      z-index: 2000;
    }
  }
  .text {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ffffff;
  }
  .footer {
    padding: 5px 0;
    text-align: center;
    height: 30px;
    background-color: #edeeef;
  }
}
</style>
