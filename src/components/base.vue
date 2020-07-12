<script>
import { WallpaperService } from "@/services";
export default {
  name: "base-component",
  props: {
    category: String, // 分类
  },
  data() {
    return {
      data: [],
      count: 0,
      page: 1,
      limit: 24,
      keyword: "", // 搜索关键字
    };
  },
  created() {
    this.fetchData(this.page, this.limit, this.category);
  },
  methods: {
    async fetchData(page, limit, category) {
      const { data, status, msg } = await WallpaperService.list(page, limit, category);
      if(status === 0){
        const { rows, count } = data;
        this.data = (rows || []).map((item) => ({
          ...item,
          checked: false,
        }));

        this.count = count;
      }
    },
    switchRequest(keyword){
      if(keyword){
        this.searchRequest(keyword, this.page, this.limit);
      }else{
        this.fetchData(this.page, this.limit, this.category);
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.switchRequest(this.keyword, this.page, this.limit);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.switchRequest(this.keyword, );
    },
    async searchRequest(keyword, page , limit){
      const { data, msg, status } = await WallpaperService.search({
        keyword: encodeURIComponent(keyword),
        category: this.category,
        page,
        limit
       });

       if(status === 0){
        const { rows, count } = data;
         this.data = (rows || []).map((item) => ({
          ...item,
          checked: false,
        }));

        this.count = count;
      }  
    },
    // 输入框用keyword
    searchend(keyword) {
      this.page = 1;
      if(keyword){
        this.keyword = keyword;
        this.searchRequest(this.keyword, this.page, this.limit);
      }else{
        this.keyword = "";
        this.fetchData(this.page, this.limit, this.category);
      }
    }
  },
};
</script>
