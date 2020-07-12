<template>
  <Layout
    :data="data"
    :page.sync="page"
    :limit.sync="limit"
    :total="count"
    @searchend="searchend"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  ></Layout>
</template>
<script>
import Layout from "@/components/layout.vue";
import Base from "@/components/base.vue";

export default {
  name: "index",
  extends: Base,
  components: {
    Layout
  },
};
</script>
