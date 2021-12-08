<template>
  <div class="control-bar">
    <el-row :gutter="10">
      <el-col :span="16">
        <marquee
          onmouseleave="this.start()"
          onmouseover="this.stop()"
          direction="left"
          behavior="scroll"
        >
          1.右键点击图片可以 [下载] [预览] [设置为壁纸] 等操作. 2.预览图片点击
          [ESC] 按钮可以退出预览. 3.
          右键点击图片,点击图片详情,如果有内容说明存在高清图片 4. [高清图片]
          尚未完全爬取成功, 正在努力解决中...
        </marquee>
      </el-col>
      <el-col :span="8" style="padding-right: 16px">
        <el-input
          placeholder="请输入搜索内容..."
          v-model="keyword"
          @input="input"
          clearable
          size="small"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { debounce } from "lodash"
export default defineComponent({
  name: "controlbar",
  setup(props, { emit }) {
    const keyword = ref(``);

    const input = debounce(function() {
      emit('searchend', keyword.value);
    }, 100)

    const clear = () => {
      keyword.value = ``;
    }

    return {
      keyword,
      input,
      clear,
    }
  }
});
</script>

<style scoped>
.control-bar {
  height: 36px;
  line-height: 36px;
  margin: 0 5px 0 5px;
}

marquee {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: red;
}
</style>
