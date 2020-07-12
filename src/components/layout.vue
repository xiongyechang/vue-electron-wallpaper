<template>
  <div class="layout">
    <control-bar
      :selectedImageList="selectedImageList"
      v-on="$listeners"
    ></control-bar>

    <template v-if="total">
      <div ref="body" class="body">
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

          <Preview
            :data="item"
            :index="index"
            @view-info="viewImageInfo"
          ></Preview>

          <div class="card-bottom card-text">
            {{ item.name }}
          </div>
        </div>
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

    <el-drawer
      :visible.sync="drawer"
      v-if="drawer"
      direction="rtl"
      @close="
        () => {
          this.drawer = false;
        }
      "
    >
      <template v-slot:title>
        <h3>图片信息</h3>
      </template>
      <image-info :ImageInfo="imageInfo"></image-info>
    </el-drawer>
  </div>
</template>

<script>
import ControlBar from "@/components/controlbar.vue";
import Preview from "@/components/preview.vue";
import Empty from "@/components/empty.vue";
import ImageInfo from "@/components/image-info.vue";
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
    Preview,
    Empty,
    ImageInfo,
  },
  computed: {
    selectedImageList: {
      get: function(v, o) {
        return this.data.filter((item) => item.checked).map((item) => item.uri);
      },
    },
  },
  data() {
    return {
      drawer: false,
      imageInfo: null,
    };
  },
  methods: {
    formatPath(uri) {
      return path.basename(uri).replace(/\.\w+/, "");
    },
    switchTab(label) {
      this.$emit("tab-change", label);
    },
    viewImageInfo(item) {
      this.drawer = true;
      this.imageInfo = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .body {
    width: 100%;
    height: calc(100% - 76px);
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }
  .card {
    position: relative;
    width: 32%;
    min-width: 312px;
    margin: 0 5px 10px 5px;
    min-height: 200px;
    max-height: 240px;
    background-color: #ffffff;
    overflow: hidden;
    &:hover {
      .card-top {
        top: 0 !important;
      }
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
      z-index: 2000;
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
    padding: 5px 0;
    text-align: center;
    height: 30px;
    background-color: #edeeef;
  }
}
</style>
