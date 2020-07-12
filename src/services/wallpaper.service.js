import Http from "@/http";

const prefix = "/wallpaper/";

export class WallpaperService {
  static async list(page = 1, limit = 24, category) {
    return await Http.get(`${prefix}list`, {
      page,
      limit,
      category
    });
  }
  static async validate(params) {
    return await Http.post(`${prefix}validate`, params);
  }
  static async create({
    name,
    type,
    mime,
    size,
    hash,
    uri
  }) {
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
    return await Http.post(`${prefix}remove`, {
      _id
    });
  }
  static async preview(name) {
    return await Http.get(`${prefix}preview`, {
      name
    });
  }
  static async findOne(name, quality) {
    return await Http.get(`${prefix}findone`, {
      name,
      quality
    });
  }
  static async search({
    keyword,
    category,
    page = 1,
    limit = 24
  }) {
    return await Http.get(`${prefix}search`, {
      keyword,
      category,
      page,
      limit
    });
  }
}