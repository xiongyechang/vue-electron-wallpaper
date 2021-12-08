<template>
  <div class="layout">
<!--  搜索栏  -->
    <control-bar
      :ref="(el) => controlBarRef = el"
      @searchend="searchend"
    ></control-bar>

<!--  contextmenu 右键菜单  -->
    <v-contextmenu ref="contextmenu" @hide="hide">
      <v-contextmenu-item
          v-for="contextmenu of contextmenus"
          @click="contextmenuHandler(contextmenu.action)"
          :key="contextmenu.title">
        <i :class="contextmenu.icon"></i>
        <span style="margin-left: 10px;">{{ contextmenu.title }}</span>
      </v-contextmenu-item>
    </v-contextmenu>

<!--  图片列表  -->
    <template v-if="total">
      <div ref="body" class="body" v-contextmenu:contextmenu>
        <div
            class="card"
            v-for="(item, index) of data"
            :key="index"
            @contextmenu="cardContextmenu(item)"
          >

          <img class="card-image" :src="item.uri" loading="lazy" />

          <div class="card-bottom card-text">
            {{ item.name }}
          </div>
        </div>
      </div>
<!-- 分页 -->
      <div class="footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[24, 48, 72, 96]"
          v-model:currentPage="pageNo"
          :page-size="limit"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </template>

    <template v-else>
      <empty></empty>
    </template>

    <el-drawer
      v-model="drawer"
      direction="rtl"
      :append-to-body="true"
      @close="drawer=false"
    >
      <template v-slot:title>
        <h3>图片信息</h3>
      </template>
      <image-info :ImageInfo="imageInfo"></image-info>
    </el-drawer>

    <!--  预览图片的dom  -->
    <el-image-viewer v-show="showPreview" @close="onImageViewerClose" :url-list="previewImageInfoList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { ElMessage, ElImageViewer } from 'element-plus';
import { directive, Contextmenu, ContextmenuItem } from "v-contextmenu";
import ControlBar from "@/components/controlbar.vue";
import Empty from '@/components/empty.vue';
import ImageInfo from "@/components/image-info.vue";
import { WallpaperService } from '@/services';
import { Response, Action } from '@/constants/constants';
import "v-contextmenu/dist/themes/default.css";
import { ipcRenderer, shell } from "electron";
import path from "path";
import fse from "fs-extra";
import { getBinary } from '@/utils/utils';
import fs from "fs";
import wallpaper from "wallpaper";
import { Update } from '@/constants/constants';

const TEMP_IMAGES_DIR = "tempImages";

export default defineComponent({
  props: {
    type: {
      type: String,
      default: ``,
    }
  },
  components: {
    ControlBar,
    Empty,
    ElImageViewer,
    ImageInfo,
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
  },
  directives: {
    contextmenu: directive,
  },
  setup(props) {

    const data = ref([]);

    const total = ref(0);

    const pageNo = ref(1);

    const limit = ref(24);

    const keyword = ref(``);

    const currentCard = ref(null);

    const controlBarRef = ref(null);

    const contextmenus = ref([{
      title: "下载",
      icon: "el-icon-download",
      action: Action.Download
    }, {
      title: "预览",
      icon: "el-icon-picture-outline",
      action: Action.Preview
    }, {
      title: "设置为壁纸",
      icon: "el-icon-picture",
      action: Action.SetWallpaper
    }, {
      title: "图片详情",
      icon: "el-icon-info",
      action: Action.ViewInfo
    }]);

    const showPreview = ref(false);

    const previewImageInfoList = ref([]);

    const imageInfo = ref(null);

    const drawer = ref(false);

    // 下载完成
    function downloadDone(event, data) {
      console.log(event, data);

      const notification = new Notification(`通知`, {
        dir: 'auto', // 文字方向,
        body: `图片下载成功[点击查看]`,
      })

      notification.onclick = function() {
        shell.openPath(data.name)
      }
    }

    onMounted(() => {
      fetchData()
      ipcRenderer.on(Update.DownloadDone, downloadDone)
    })

    onBeforeUnmount(() => {
      ipcRenderer.on(Update.DownloadDone, downloadDone);
    })

    watch(() => props.type, (curValue, prevValue) => {
      if (curValue!==prevValue) {
        document.querySelector(".body")?.scrollTo(0, 0);
        pageNo.value = 1;
        keyword.value = ``;
        controlBarRef.value?.clear();
        setTimeout(fetchData, 500);
      }
    })

    async function fetchData() {
      const { success, data: d, message }: Response = await WallpaperService.list(pageNo.value, limit.value, props.type, encodeURIComponent(keyword.value));
      if (success) {
          const { rows, total: t } = d;
          data.value = rows;
          total.value = t;
      } else {
        console.log(message);
      }
    }


    async function searchend(keyWord) {
      keyword.value = keyWord;
      fetchData();
    }

    function handleSizeChange(pageSize) {
      limit.value = pageSize;
      fetchData()
    }

    function handleCurrentChange(page) {
      pageNo.value = page;
      fetchData()
    }

    function hide() {}

    async function download(wallpaper) {
      const { data, success, message }: Response = await WallpaperService.findOne(wallpaper.value.name, `high`);
      if (success) {
        ipcRenderer.send(Update.Download, data.uri); // 下载
      } else {
        ElMessage(message)
      }
    }

    async function preview(wallpaper) {
      const { data, success, message }: Response = await WallpaperService.findOne(wallpaper.value.name, `middle`);
      if (success) {
        previewImageInfoList.value = [data].map(({uri}) => uri);
        showPreview.value = true;
      } else {
        ElMessage(message)
      }
    }

    async function setupWallpaper(wallpaperInfo) {
      const tempImagePath = path.join(TEMP_IMAGES_DIR, path.basename(wallpaperInfo.value.uri)); // 保存的地址
      console.log(tempImagePath);
      console.log(wallpaperInfo);
      await fse.ensureDirSync(TEMP_IMAGES_DIR);
      const { data, message, success } = await WallpaperService.findOne(wallpaperInfo.value.name, `high`);
      if (success) {
        const binary: any = await getBinary(data.uri);
        fs.writeFile(tempImagePath, binary, "binary", async function(err) {
          if (err) {
            new Notification("通知", {
              body: "壁纸设置异常",
            });
          } else {
            await wallpaper?.set(tempImagePath);
            new Notification("通知", {
              body: "壁纸设置成功",
            });
            await fs.unlinkSync(tempImagePath);
          }
        })
      } else {
        ElMessage(message)
      }
    }

    async function lookWallpaperInfo(wallpaperInfo) {
      const { data, message, success } = await WallpaperService.findOne(wallpaperInfo.value.name, `low`);
      if (success) {
        imageInfo.value = data;
        drawer.value = true;
      } else {
        ElMessage(message)
      }
    }

    function contextmenuHandler(action: Action) {
      switch (action) {
        case Action.Download: {
          download(currentCard);
        }break;
        case Action.Preview: {
          preview(currentCard);
        }break;
        case Action.SetWallpaper: {
          setupWallpaper(currentCard);
        }break;
        case Action.ViewInfo: {
          lookWallpaperInfo(currentCard);
        }break;
      }
    }

    function cardContextmenu(card) {
      currentCard.value = card;
    }

    function onImageViewerClose() {
      showPreview.value = false;
    }

    return {
      data,
      total,
      pageNo,
      limit,
      controlBarRef,
      contextmenus,
      showPreview,
      previewImageInfoList,
      drawer,
      imageInfo,
      fetchData,
      searchend,
      handleSizeChange,
      handleCurrentChange,
      hide,
      contextmenuHandler,
      cardContextmenu,
      onImageViewerClose,
    }
  }
});
</script>

<style lang="scss" scoped>
.layout {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .body {
    width: 100%;
    height: calc(100% - 76px);
    overflow-y: auto;
    display: grid;
    grid-template-rows: repeat(8, 260px);
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1px;
    scroll-behavior: smooth;
  }
  .card {
    position: relative;
    background-color: #ffffff;
    overflow: hidden;
    &-image {
      width: 100%;
      height: 100%;
    }
    &-bottom {
      transition: all 0.3s ease-in-out;
      position: absolute;
      bottom: 0 !important;
      right: 0;
      left: 0;
      height: 32px;
      line-height: 32px;
      padding: 0 16px;
      background: rgba(0, 0, 0, 0.5);
    }
    .card-text {
      font-size: 14px;
      color: #ffffff;
    }
  }
  .text {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ffffff;
  }
  .footer {
    padding: 5px 8px;
    text-align: right;
    height: 30px;
    background-color: #edeeef;
  }
}
</style>
