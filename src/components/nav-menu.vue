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
    <ul class="list-panel">
      <li
        class="list-item"
        v-for="(item, index) of NavMenu" :key="index"
        :class="{
          RouteActive: activeRouter === index,
        }"
        @click="switchRouter(item, index)"
      >
        <i :class="item.icon"></i>
        <span class="list-item__text">{{ item.title }}</span>
        <img
          v-show="['美女', '跑车', '游戏'].includes(item.title)"
          style="margin-left: 110px;"
          :src="require('@/assets/img/hot.png')"
          width="20"
          height="auto"
        />
      </li>
    </ul>
    <div class="setting" @click="openDrawer">
      <i class="el-icon-setting"></i>
      <span>设置</span>
    </div>
    <!-- 设置窗口 -->
    <el-drawer
      v-model="drawer"
      direction="rtl"
      :append-to-body="true"
      @close="drawer=false"
    >
      <template v-slot:title>
        <h3>设置</h3>
      </template>
      <setting @setted="setted" />
    </el-drawer>
  </menu>
</template>

<script lang="ts">
import { WallpaperTypeService } from '@/services';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Setting from "./setting.vue";

const NavMenuWidth = {
  collapse: "50px",
  expand: "220px",
};

const NavMenuIcon = {
  fold: "el-icon-s-fold",
  unfold: "el-icon-s-unfold",
};

export default defineComponent({
  name: "nav-menu",
  components: { Setting },
  setup(props, { emit }) {
    const NavMenu = ref([]);
    const MenuWidth = ref(NavMenuWidth.expand);
    const NavMenuIconStatus = ref(NavMenuIcon.fold);
    const drawer = ref(false);
    const activeRouter = ref(0);
    // const router = useRouter();
    const route = useRoute();

    onMounted(() => {

      WallpaperTypeService
        .list()
          .then((response:any) => {
            const { data, success } = response;
            if (success) {
              const { rows = [] } = data;
              NavMenu.value = [{
                count: 0,
                createdAt: new Date().toString(),
                icon: "iconfont icon-all",
                name: "all",
                path: "/all",
                title: "全部",
                updatedAt: new Date().toString(),
              }].concat(rows);
            }
          });
    })

    function expand() {
      if (MenuWidth.value === NavMenuWidth.collapse) {
        MenuWidth.value = NavMenuWidth.expand;
        NavMenuIconStatus.value = NavMenuIcon.fold;
      } else {
        MenuWidth.value = NavMenuWidth.collapse;
        NavMenuIconStatus.value = NavMenuIcon.unfold;
      }
    }

    function switchRouter(ele, index) {

      if (route.path === ele.path) {
        return;
      }

      activeRouter.value = index;

      emit('menu-item-change', ele);
    }

    function openDrawer() {
      drawer.value = true;
    }

    
    function setted () {
      drawer.value = false;
    }



    return {
      NavMenu,
      MenuWidth,
      NavMenuIconStatus,
      drawer,
      activeRouter,
      expand,
      switchRouter,
      openDrawer,
      setted,
    }
  }

  // watch: {
  //   "$route.fullPath": function(newPath, oldPath){
  //     if (newPath !== oldPath) {
  //       const index = this.NavMenu.findIndex(route => route.path === newPath.split('?')[0]);
  //       if(index !== -1){
  //         this.activeRouter = index;
  //       }
  //     }
  //   }
  // },

  // mounted() {
  //   this.NavMenu = this.$router.options.routes;

  //   setTimeout(() => {
  //     const index = this.NavMenu.findIndex(el => {
  //       console.log(el.path, location.pathname);
  //       return el.path === location.pathname
  //     });

  //     console.log(index);

  //     if (index === -1) {
  //       this.activeRouter = 0;
  //     } else {
  //       this.activeRouter = index;
  //     }
  //   }, 30)
  // },
});
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
