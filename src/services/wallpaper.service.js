import Http from "@/http";

const prefix = "/wallpaper/";

export class WallpaperService {
  static async list(page = 1, limit = 24, keyword) {
    return await Http.get(`${prefix}list`, { page, limit, keyword });
  }
  static async validate(params) {
    return await Http.post(`${prefix}validate`, params);
  }
  static async create({ name, type, mime, size, hash, uri }) {
    return await Http.post(`${prefix}`, {
      name,
      type,
      mime,
      size,
      hash,
      uri,
    });
  }
  static async remove(_id) {
    return await Http.post(`${prefix}remove`, { _id });
  }
}
