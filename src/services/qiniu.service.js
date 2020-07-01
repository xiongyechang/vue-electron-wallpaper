import Http from "@/http";

const prefix = "/qiniu/";

export class QiniuService {
  static async getToken() {
    return await Http.get(`${prefix}token`);
  }
  static async getDomain() {
    return await Http.get(`${prefix}domain`);
  }
}
