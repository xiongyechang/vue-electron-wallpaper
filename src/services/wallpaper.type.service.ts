import Http from "@/http";

const prefix = "/wallpapertype/";

export class WallpaperTypeService {
  static async list(pageNo = 1, limit = 24, keyword = '') {
    return await Http.get(`${prefix}`, {
      pageNo,
      limit,
      keyword
    });
  }
}
