import * as qiniu from "qiniu-js";
import { mapGetters, mapActions } from "vuex";
const randomstring = require("randomstring");
import https from "https";
import http from "http";
import { remote } from "electron";
import { uploadProgress } from "@/models/update";

import fs from "fs";
import { SET_QINIU_TOKEN, SET_QINIU_DOMAIN } from "@/store/mutation_types";

export default {
  data() {
    return {};
  },
  created() {
    this.getQiniuToken();
    this.getQiniuDomain();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      qiniuToken: "qiniuToken",
      qiniuDomain: "qiniuDomain",
    }),
  },
  methods: {
    ...mapActions({
      getQiniuToken: "getQiniuToken",
      getQiniuDomain: "getQiniuDomain",
    }),

    async requestImage(uri) {
      return new Promise((resolve, reject) => {
        let request = null; // 请求
        if (/^https/.test(uri)) {
          request = https;
        } else {
          request = http;
        }

        request.get(
          uri,
          {
            headers: {
              Accept: "*/*",
              Referer: new URL(uri).origin,
              "Accept-Encoding": "binary", //这里设置返回的编码方式 设置其他的会是乱码
              Connection: "keep-alive",
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
            },
          },
          function(req, res) {
            let data = "";

            req.setEncoding("binary");

            req.on("data", function(chunk) {
              data += chunk;
            });

            req.on("end", function() {
              resolve(data);
            });

            req.on("error", function(e) {
              reject(e);
            });
          }
        );
      });
    },

    uploadToQiniu(file) {
      return new Promise((resolve, reject) => {
        let key = randomstring.generate(8) + "-" + file.name;

        console.log(qiniu);

        let config = {
          useCdnDomain: true,
          region: qiniu.region.z0,
        };

        var putExtra = {
          fname: file.name,
          params: {},
          mimeType: [] || null,
        };
        var observable = qiniu.upload(
          file,
          key,
          this.qiniuToken,
          putExtra,
          config
        );

        let mainWindow = remote.BrowserWindow.getFocusedWindow();

        // var subscription = observable.subscribe(observer) // 上传开始
        observable.subscribe(
          (res) => {
            // console.log("上传进度:", res);
            mainWindow.webContents.send(uploadProgress, res);
          },
          (e) => {
            reject(e);
          },
          (res) => {
            resolve(this.qiniuDomain + "/" + res.key);
          }
        );
      });
    },
  },
};
