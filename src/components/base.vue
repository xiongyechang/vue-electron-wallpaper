<script>
import { WallpaperService } from '@/services';
export default {
  name: "base-component",
  props: {
    type: String // 分类
  },
  data() {
    return {
      data: [],
      total: 0,
      pageNo: 1,
      limit: 24,
      keyword: "" // 搜索关键字
    };
  },
  created() {
    this.fetchData(this.pageNo, this.limit, this.type);
  },
  methods: {
    async fetchData(pageNo, limit, type) {
      this.scrollToTop();
      const { success, data, message } = await WallpaperService.list(pageNo, limit, type);
      if (success) {
          const { rows, total } = data;
          this.data = (rows || []).map(item => ({
            ...item,
            checked: false
          }));
          this.total = total;
      } else {
        console.log(message);
      }
    },
    switchRequest(keyword) {
      if (keyword) {
        this.searchRequest(keyword, this.pageNo, this.limit);
      } else {
        this.fetchData(this.pageNo, this.limit, this.type);
      }
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.switchRequest(this.keyword, this.pageNo, this.limit);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.switchRequest(this.keyword);
    },
    async searchRequest(keyword, pageNo, limit) {
      this.scrollToTop();
      const { data, success } = await WallpaperService.search({
        keyword: encodeURIComponent(keyword),
        type: this.type,
        pageNo,
        limit
      });
      if (success) {
        const { rows, total } = data;
        this.data = (rows || []).map(item => ({
          ...item,
          checked: false
        }));
        this.total = total;
      }
    },
    // 输入框用keyword
    searchend(keyword) {
      this.pageNo = 1;
      if (keyword) {
        this.keyword = keyword;
        this.searchRequest(this.keyword, this.pageNo, this.limit);
      } else {
        this.keyword = "";
        this.fetchData(this.pageNo, this.limit, this.type);
      }
    },
    // 回到顶部
    scrollToTop() {
      const body = document.querySelector(".layout>.body");
      if (body) {
        body.scrollTo(0, 0);
      }
      // if(body.scrollTop){}
    }
  }
};
</script>
