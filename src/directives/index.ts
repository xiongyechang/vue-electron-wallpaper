export const focus = {
  // beforeMount(el, binding, vnode, prevVnode) {
  //   console.log(el, binding, vnode, prevVnode);
  // },
  mounted() {
    console.log("mounted");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
  },
  updated() {
    console.log("updated");
  },
  beforeUnmount() {
    console.log("beforeUnmount");
  },
  unmounted() {
    console.log("unmounted");
  },
};
