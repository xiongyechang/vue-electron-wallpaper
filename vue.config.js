const path = require('path');
const os = require('os');
const { name, version } = require('./package.json');

let downloadURL = ``;

const Platform = {
  Windows_NT: 'Windows_NT',
  Linux: "Linux",
  Darwin: "Darwin", // MacOS 
}

if (os.type() === Platform.Windows_NT) {
    downloadURL = `https://cdn.xiongyechang.com/${name}@${version}.exe`;
} else if (os.type() === Platform.Linux) {
    downloadURL = `https://cdn.xiongyechang.com/${name}-${version}.AppImage`;
} else if (os.type() === Platform.Darwin) {
    downloadURL = `https://cdn.xiongyechang.com/${name}@${version}.dmg`;
}

module.exports = {
  chainWebpack: (config) => {
    config.target('electron-renderer')
  },
  configureWebpack: {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src")
        }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['clipboard'], // Cannot find module 'clipboard'
      builderOptions: {
        appId: "wallpaper.xiongyechang.com",
        productName: name, // 项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2020", // 版权信息
        win: {
          icon: "./public/favicon.ico",
          artifactName: "${productName}@${version}.exe",
          target: [
            {
              target: "nsis", //利用nsis制作安装程序
              arch: [
                "x64", //64位
                "ia32", //32位
              ],
            },
          ],
        },
        mac: {
          icon: "./public/favicon.icns", // 这里是设置的 dock 里面的图标
          category: 'public.app-category.utilities', // 应用类型
          target: ['dmg', 'zip'] // 打包的目标类型(默认是dmg和zip),支持很多类型，具体看文档
          // artifactName: "${productName}@${version}.dmg",
        },
        linux: {
            icon: "./public/favicon.png", // 包含各种尺寸图标的文件夹
            target: [
                "AppImage",
                "deb",
                "rpm"
            ],
            category: "Utility",
        },
        nsis: {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          "allowToChangeInstallationDirectory": true, // 允许修改安装目录
          "installerIcon": "./public/favicon.ico",// 安装图标
          "uninstallerIcon": "./public/favicon.ico",//卸载图标
          "installerHeaderIcon": "./public/favicon.ico", // 安装时头部图标
          "createDesktopShortcut": true, // 创建桌面图标
          "createStartMenuShortcut": true,// 创建开始菜单图标
          "shortcutName": "vue-electron-wallpaper", // 图标名称
        },
        publish: [
          {
            provider: "generic",
            url: downloadURL,
          }
        ],
      },
    },
  },
};
