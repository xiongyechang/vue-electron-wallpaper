import Http from "@/http";

const prefix = "/wallpaper";

export class WallpaperService {
  // 已经实现
  static async list(pageNo = 1, limit = 24, type, keyword = ''): Promise<any> {
    return await Http.get(`${prefix}`, {
      pageNo,
      limit,
      type,
      keyword
    });
  }
  static async search({
                        keyword,
                        type,
                        pageNo = 1,
                        limit = 24
                      }): Promise<any> {
    return await Http.get(`${prefix}/search`, {
      keyword,
      type,
      pageNo,
      limit
    });
  }
  static async findOne(name, quality): Promise<any> {
    return await Http.get(`${prefix}/findone`, {
      name,
      quality
    });
  }
  static async validate(params) {
    return await Http.post(`${prefix}/validate`, params);
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
    return await Http.post(`${prefix}/remove`, {
      _id
    });
  }
}