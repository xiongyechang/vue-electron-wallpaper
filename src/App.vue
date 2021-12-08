<template>
  <top-bar></top-bar>
  <main>
    <transition 
      tag="div"
      enter-active-class="animate__animated animate__fadeInRightBig"
      leave-active-class="animate__animated animate__fadeOutLeftBig"
    >
      <router-view :key="route.fullPath" />
    </transition>
  </main>
	<bottom-bar></bottom-bar>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from "@/components/topbar.vue";
import BottomBar from "@/components/bottombar.vue";

const route = useRoute();

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.style.setProperty("--primary-color", savedTheme);
  }
});
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
  display: grid;
  grid-auto-rows: 33px calc(100% - 66px) 33px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  font-size: 16px;
  overflow: hidden;
}

.main {
  display: flex;
  width: 100%;
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


#username,#password{
  &.swal2-input{
    height: 2rem;
    padding: 0;
    margin: 10px 0;
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
.fixed-fullscreen{
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
