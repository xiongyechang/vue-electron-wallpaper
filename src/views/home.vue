<template>
  <div :style="{display: 'flex', height: '100%'}">
    <nav-menu @menuItemChange="menuItemChange" />
    <card-list :type="type" />
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import NavMenu from '@/components/nav-menu.vue';
import CardList from '@/components/card-list.vue';

export default defineComponent({
  components: {
    NavMenu,
    CardList
  },
  setup() {
    
    const type = ref('');

    function menuItemChange(m) {
      type.value = m?._id;
    }

    return {
      type,
      menuItemChange
    }
  }
})
</script>
