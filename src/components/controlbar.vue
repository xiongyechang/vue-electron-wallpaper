<template>
  <div class="control-bar">
    <el-button type="primary" @click="openUploadDialog" icon="el-icon-share"
      >我要分享</el-button
    >
    <el-button type="primary" @click="batchDownload" icon="el-icon-download"
      >批量下载{{ computedSelectedImageList }}</el-button
    >
    <el-dialog
      ref="dialog"
      title="上传图片"
      :visible.sync="visible"
      @close="closeDialog"
      :destroy-on-close="true"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="图片类型: " label-width="100px" prop="type">
          <el-select v-model="ruleForm.type">
            <el-option
              v-for="item of options"
              :key="item._id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片名称: " label-width="100px" prop="name">
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上传方式: " label-width="100px">
          <el-radio-group v-model="uploadWay">
            <el-radio :label="1">URL链接</el-radio>
            <el-radio :label="0">本地上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片上传: " label-width="100px" prop="uri">
          <el-input
            v-if="uploadWay"
            placeholder="https://www.iamge.com/test.png"
            type="url"
            @change="uriChange"
            v-model="ruleForm.uri"
          ></el-input>
          <el-upload
            v-else
            ref="upload"
            action
            drag
            accept="image/*"
            :http-request="upload"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
          <el-progress v-show="progress" :percentage="progress"></el-progress>
          <div
            v-if="uploadWay === 0 && ruleForm.uri"
            style="font-size: 12px;color: lightgray;"
          >
            图片链接:{{ ruleForm.uri }}
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import SparkMD5 from "spark-md5";
import Mixins from "@/mixins";
import mime from "mime";
import path from "path";
import { WallpaperService, WallpaperTypeService } from "@/services";
import { isURL } from "@/utils/utils";
import fs from "fs";
import fse from "fs-extra";
import { uploadProgress } from "@/models/update";
export default {
  name: "controlbar",
  props: {
    selectedImageList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    computedSelectedImageList() {
      return this.selectedImageList.length
        ? `  (${this.selectedImageList.length}张)`
        : "";
    },
  },
  data() {
    const checkURL = function(rule, value, callback) {
      if (isURL(value)) {
        callback();
      } else {
        return callback(new TypeError("图片链接不合法"));
      }
    };

    return {
      visible: false,
      options: [],
      progress: 0,
      fileInfo: null,
      uploadWay: 1,
      ruleForm: {
        type: "",
        name: "",
        uri: "",
      },
      rules: {
        type: [{ required: true, message: "请选择图片类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入图片名称", trigger: "blur" }],
        uri: [
          {
            // type: "url",
            // required: true,
            message: "请输入图片链接或上传图片",
            validate: checkURL,
            trigger: "change",
          },
        ],
      },
    };
  },
  mixins: [Mixins],
  created() {
    WallpaperTypeService.list().then((r) => {
      if (r.status === 0) {
        this.options = r.data.rows;
      }
    });

    this.ruleForm.type = this.$route.query.keyword;
  },
  mounted() {
    const theme = localStorage.getItem("theme");

    if (theme) {
      document.documentElement.style.setProperty("--primary-color", theme);
      this.theme = theme;
    }

    this.$watch("theme", function(n) {
      localStorage.setItem("theme", n);
      document.documentElement.style.setProperty("--primary-color", n);
    });

    ipcRenderer.on(uploadProgress, (event, data) => {
      let { total } = data;
      this.progress = +total.percent;
    });
  },
  methods: {
    batchDownload() {
      if (!this.selectedImageList.length) {
        this.$notify({
          title: "提示",
          message: "请选择图片",
          duration: 300000,
          type: "warning",
        });
        return;
      }
      const mainWindow = remote.BrowserWindow.getFocusedWindow();
      for (let uri of this.selectedImageList) {
        let e = mainWindow.webContents.downloadURL(uri);
      }
    },
    uriChange(uri) {
      if (isURL(uri)) {
        this.requestImage(uri).then((r) => {
          const fileName = path.basename(this.ruleForm.name || uri);
          fse.ensureDirSync(path.join(process.cwd(), "tempImages"));
          let filePath = path.join(process.cwd(), "tempImages", fileName);
          fs.writeFileSync(filePath, r, "binary");
          let f = fs.readFileSync(filePath);
          this.upload({
            file: new File([f], encodeURIComponent(fileName), {
              type: mime.getType(uri),
            }),
          });
        });
      }
    },
    confirmAction() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          WallpaperService.create({
            name: this.ruleForm.name || this.fileInfo.name,
            type: this.ruleForm.type,
            mime: this.fileInfo.mime,
            size: this.fileInfo.size,
            hash: this.fileInfo.hash,
            uri: this.ruleForm.uri,
          }).then((r) => {
            if (r.status === 0) {
              new Notification("图片上传成功", {
                icon: this.ruleForm.uri,
              });
              this.clear();
            } else {
              new Notification("图片上传失败!", {
                icon: path.join(
                  process.cwd(),
                  "src",
                  "assets",
                  "img",
                  "fail.png"
                ),
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    clear() {
      this.$refs.upload && this.$refs.upload.clearFiles();
      this.ruleForm.name = "";
      this.ruleForm.uri = "";
      this.progress = 0;
      this.fileInfo = null;
    },
    closeDialog() {
      this.clear();
    },
    upload(request) {
      let { file } = request,
        that = this;

      if (file.size < 1024 * 300) {
        alert("图片大小必须大于300kb");
        this.$refs.upload && this.$refs.upload.clearFiles();
        return;
      }

      if (!this.ruleForm.name) {
        this.ruleForm.name = file.name;
      }

      let fileReader = new FileReader();

      fileReader.onloadend = function() {
        const hexHash = SparkMD5.hash(this.result);
        WallpaperService.validate({ hash: hexHash }).then((r) => {
          if (r.status === 0) {
            that.fileInfo = {
              file,
              name: that.ruleForm.name,
              type: that.ruleForm.type,
              mime: file.type,
              size: file.size,
              hash: hexHash,
            };

            that
              .uploadToQiniu(file)
              .then((uri) => {
                if (uri) {
                  that.ruleForm.uri = uri;
                }
                console.log(that.ruleForm);
              })
              .catch((e) => {
                new Notification("图片上传到七牛云失败", {
                  icon: path.join(
                    process.cwd(),
                    "src",
                    "assets",
                    "img",
                    "fail.png"
                  ),
                });
                that.ruleForm.name = "";
                that.$refs.upload.clearFiles();
              });
          } else {
            that.ruleForm.name = "";
            that.$refs.upload && that.$refs.upload.clearFiles();
            alert(r.msg);
          }
        });
      };
      fileReader.readAsDataURL(file);
    },
    openUploadDialog() {
      this.visible = true;
    },
  },
};
</script>
