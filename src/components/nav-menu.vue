<template>
  <menu
    id="menu"
    :style="{
      width: MenuWidth,
    }"
  >
    <div class="list-title">
      <span @click="expand" style="padding-left: 10px;">
        <i style="font-size: 16px;" :class="NavMenuIconStatus"></i>
      </span>
    </div>
    <ul class="list-panel" v-for="(item, index) of NavMenu" :key="index">
      <li
        class="list-item"
        :class="{
          RouteActive: activeRoute === index,
        }"
        @click="swichRouter(item, index)"
      >
        <img
          :src="item.icon"
          width="16"
          height="auto"
          :title="item.description"
        />
        <span class="list-item__text">{{ item.description }}</span>
        <img
          v-show="['美女', '风景'].includes(item.description)"
          style="margin-left: 110px;"
          :src="require('@/assets/img/hot.png')"
          width="16"
          height="auto"
        />
      </li>
    </ul>
    <div class="setting" @click="openDrawer">
      <i class="el-icon-setting"></i>
      <span>设置</span>
    </div>
    <el-drawer
      :visible="drawer"
      direction="rtl"
      @close="
        () => {
          this.drawer = false;
        }
      "
    >
      <template v-slot:title>
        <h3>设置</h3>
      </template>
      <setting></setting>
    </el-drawer>
  </menu>
</template>

<script>
import Menu from "@/models/menu";
import Setting from "./setting.vue";

const NavMenuWidth = {
  collapse: "50px",
  expand: "220px",
};

const NavMenuIcon = {
  fold: "el-icon-s-fold",
  unfold: "el-icon-s-unfold",
};

export default {
  name: "nav-menu",
  data() {
    return {
      NavMenu: Menu,
      MenuWidth: NavMenuWidth.expand,
      NavMenuIconStatus: NavMenuIcon.fold,
      activeRoute: 0,
      drawer: false,
    };
  },
  components: { Setting },

  mounted() {},

  methods: {
    expand() {
      if (this.MenuWidth === NavMenuWidth.collapse) {
        this.MenuWidth = NavMenuWidth.expand;
        this.NavMenuIconStatus = NavMenuIcon.fold;
      } else {
        this.MenuWidth = NavMenuWidth.collapse;
        this.NavMenuIconStatus = NavMenuIcon.unfold;
      }
    },

    swichRouter(ele, index) {
      this.activeRoute = index;

      if (this.$route.path === ele.path) {
        return;
      }

      this.$router.push({
        path: ele.path,
        query: { keyword: ele.keyword },
      });
    },

    openDrawer() {
      this.drawer = true;
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 36px;
$line-height: 36px;

#menu {
  transition: width 0.3s linear;
  will-change: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .list-title {
    height: $height;
    line-height: $line-height;
    font-size: 12px;
    padding: 0 0 0 10px;
  }
  .list-panel {
    transition: all 1s linear;
    max-height: 100px;
  }
  .list-item {
    height: $height;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    padding: 0 0 0 20px;
    white-space: nowrap;
    overflow: hidden;
    i {
      font-size: 16px;
    }
    &__text {
      margin-left: 16px;
    }
    &:hover {
      background-color: rgb(214, 215, 216);
      cursor: default;
    }
  }
  .RouteActive {
    background-color: var(--primary-color) !important;
    color: #ffffff;
  }

  .setting {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 14px;
    padding: 10px 0 10px 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    i {
      margin-right: 16px;
    }
    &:hover {
      background-color: var(--primary-color);
      color: #ffffff;
    }
  }
}
</style>
