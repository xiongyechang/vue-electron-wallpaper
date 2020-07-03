<script>
import { WallpaperService } from "@/services";
export default {
  name: "base-component",
  data() {
    return {
      data: [],
      count: 0,
      page: 1,
      limit: 24,
    };
  },
  methods: {
    fetchData(page, limit, keyworkd) {
      WallpaperService.list(page, limit, keyworkd).then((r) => {
        this.data = (r.data.rows || []).map((item) => ({
          ...item,
          checked: false,
        }));
        this.count = r.data.count;
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchData(page, this.limit, this.keyword);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.fetchData(this.page, limit, this.keyword);
    },
  },
};
</script>
