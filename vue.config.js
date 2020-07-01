const { downloadURL } = require("./src/config/config");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "wallpaper.xiongyechang.com",
        productName: "vue-electron-wallpaper", // 项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2020", // 版权信息
        win: {
          icon: "./public/favicon.ico",
          artifactName: "${productName}@${version}.exe",
          // target: [
          //   {
          //     target: "nsis", //利用nsis制作安装程序
          //     arch: [
          //       "x64", //64位
          //       "ia32", //32位
          //     ],
          //   },
          // ],
        },
        publish: [
          {
            provider: "generic",
            url: downloadURL,
          },
        ],
      },
    },
  },
};
