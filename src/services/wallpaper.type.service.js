import Http from "@/http";

const prefix = "/wallpapertype/";

export class WallpaperTypeService {
  static async list() {
    return await Http.get(`${prefix}list`);
  }
}
