<template>
  <Layout
    :data="data"
    :page.sync="page"
    :limit.sync="limit"
    :total="count"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  ></Layout>
</template>
<script>
import { WallpaperService } from "@/services";
import Layout from "@/components/layout.vue";

import Base from "@/components/base.vue";
export default {
  name: "index",
  extends: Base,
  components: {
    Layout,
  },
  props: {
    keyword: String,
  },
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.fetchData(this.page, this.limit, this.keyword);
  },
};
</script>
