<template>
	<el-image
    lazy
    :src="data.uri"
    :preview-src-list="previewSrcList"
    style="height: 100%;"
    @load="imageLoaded(data)"
    @error="imageError(data)"
    @contextmenu="contextmenu($event, data)"
  ></el-image>
</template>

<script>
	import { ipcRenderer } from "electron";
	import path from "path";
	const wallpaper = require("wallpaper");
	const fse = require("fs-extra");
	const fs = require("fs");
	import { WallpaperService } from "@/services";
	import Mixins from "@/mixins";
	const TEMP_IMAGES_DIR = "tempImages";
	export default {
		name: 'preview',
		props: {
			data: Object,
			index: Number,
		},
		data(){
			return {
				previewSrcList: []
			}
		},
		mixins: [Mixins],
		methods: {
			async imageLoaded({ name }){
	      let { status, data, msg } = await WallpaperService.preview(encodeURIComponent(name));
	      if(status === 0){
	        this.previewSrcList = [data.uri];
	      }else{
	        console.error(msg);
	      }
			},
			async saveTempImage(data, tempImagePath) {
	      fs.writeFile(tempImagePath, data, "binary", async function(err) {
	        if (err) {
	          new Notification("通知", {
	          	body: "壁纸设置异常",
	          });
	        } else {
	          await wallpaper.set(tempImagePath);
	          new Notification("通知", {
	          	body: "壁纸设置成功",
	          });
	          await fs.unlinkSync(tempImagePath);
	        }
	      });
	    },
			removeContextmenu() {
	      const contextmenu = document.querySelector(".contextmenu");
	      if (contextmenu) {
	        contextmenu.remove();
	      }
	    },
	    async setWallpaper(item, quality){
	    	const tempImagePath = path.join(TEMP_IMAGES_DIR, path.basename(item.uri)); // 保存的地址
	      await fse.ensureDirSync(TEMP_IMAGES_DIR);
      	const { data, status, msg } = await WallpaperService.findOne(item.name, quality);
      	if(status === 0){
      		let binary = await this.requestImage(data.uri);
      		console.log(data.uri);
      		console.log(binary);
        	await this.saveTempImage(binary, tempImagePath);
      	}else{
      		this.$notify({
	          title: "提示",
	          message: "设置壁纸失败",
	          duration: 3000,
	          type: "warning"
	        });
      	}
	    },
	    async downloadWallpaper(item, quality){
	    	const { data, status, msg } = await WallpaperService.findOne(item.name, quality);
        if(status === 0){
        	ipcRenderer.send("download", data.uri); // 下载
        }else{
        	 this.$notify({
		          title: "提示",
		          message: msg,
		          duration: 3000,
		          type: "warning"
		        });
        }
	    },
	    bindContextmenuEvent(e, ul, item){
	    	 ul.addEventListener("click", async (event) => {
	          switch (event.target.dataset.action) {
	            case "select": {
	              item.checked = !item.checked;
	              break;
	            }
	            case "download":
	              this.downloadWallpaper(item, "middle");
	              break;
	            case "download-high-definition": // 下载高清壁纸
	              this.downloadWallpaper(item, "high");
	              break;
	            case "set-wallpaper": {
	              await this.setWallpaper(item, "middle");
	              break;
	            }
	            case "set-high-definition-wallpaper": {
	            	await this.setWallpaper(item, "high");
	            	break;
	            }
	            case "preview": {
	              e.target.click();
	              break;
	            }
	            case "disabled": {
	              break;
	            }
	            case "report": {
	              break;
	            }
	            default: {
	              e.target.click();
	            }
	          }
	        },
	        false
	      );
	    },
			contextmenu(e, item) {
	      this.removeContextmenu();
	      const { clientX, clientY } = e;

	      const div = document.createElement("div");
	      const ul = document.createElement("ul");
	      div.setAttribute("class", "contextmenu");

	      div.addEventListener("click", function(event) {
	          this.remove();
	        },
	        false
	      );

	      div.oncontextmenu = function() {
	        this.removeContextmenu();
	      }.bind(this);

	      const selected = item.checked;

	      ul.innerHTML = `
	        <li data-action="select" style="${selected ? "background: var(--primary-color);color:#ffffff;" : ""}"><i class="el-icon-document-checked"></i>${ selected ? "已" : ""}选择</li>
	        <li data-action="preview"><i class="el-icon-picture-outline"></i>预览</li>
	        <li data-action="download"><i class="el-icon-download"></i>下载</li>
	        <li data-action="set-wallpaper"><i class="el-icon-picture"></i>设置为壁纸</li>
	        <li data-action="download-high-definition"><i class="el-icon-s-marketing"></i>下载高清图片</li>
	        <li data-action="set-high-definition-wallpaper"><i class="el-icon-s-platform"></i>设置高清图片为壁纸</li>
	        <li data-action="disabled" style="cursor: not-allowed;"><i class="el-icon-close"></i>图片不可用</li>
	        <li data-action="report" style="cursor: not-allowed;"><i class="el-icon-warning"></i>举报</li>
	        `;

	      this.bindContextmenuEvent(e, ul, item);

	      ul.style.cssText = `top: ${clientY}px; left: ${clientX}px;`;

	      div.appendChild(ul);
	      document.body.appendChild(div);
	    },
		}
	}
</script>