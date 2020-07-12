<template>
  <div class="layout">
    <control-bar :selectedImageList="selectedImageList" v-on="$listeners"></control-bar>

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
          
          <Preview :data="item" :index="index"></Preview>
          
          <div class="card-bottom card-text">
            {{item.name}}
          </div>

          <div style="clear:both;"></div>           
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

  </div>
</template>

<script>
import ControlBar from "@/components/controlbar.vue";
import Preview from "@/components/preview.vue";
import Empty from "@/components/empty.vue";
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
  },
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
    switchTab(label) {
      this.$emit("tab-change", label);
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;

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
    &:hover  {
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
    &-bottom{
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
    .card-text{
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
