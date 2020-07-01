const { autoUpdater, CancellationToken } = require("electron-updater");
const { BrowserWindow, ipcMain } = require("electron");
import {
  checkForUpdate,
  isUpdate,
  downloadProgress,
  cancelUpdate,
  isInstallNow,
} from "@/models/update";
const { baseURL } = require("../config/config");

const mainWindow = BrowserWindow.getFocusedWindow();

const cancellationToken = new CancellationToken();

//执行自动更新检查
const feedUrl = `${baseURL}update/`; // 更新包位置

autoUpdater.autoDownload = false;

autoUpdater.setFeedURL(feedUrl);

let message = {
  error: "检查更新出错",
  checking: "正在检查更新……",
  updateAva: "检测到新版本，正在下载...",
  updateNotAva: "现在使用的就是最新版本，不用更新",
};

autoUpdater.on("error", function(error) {
  sendUpdateMessage({
    code: 0,
    msg: message.error,
  });
});
autoUpdater.on("checking-for-update", function() {
  sendUpdateMessage({
    code: 1,
    msg: message.checking,
  });
});
autoUpdater.on("update-available", function(info) {
  mainWindow.webContents.send(isUpdate);
});

ipcMain.on(isUpdate, (event, data) => {
  console.log(data);
  if (data) {
    autoUpdater.downloadUpdate(cancellationToken); // 手动下载
  }
});
// 取消下载
ipcMain.on(cancelUpdate, (event, data) => {
  if (data) {
    cancellationToken.cancel();
  }
});

// autoUpdater.autoDownload = false;
autoUpdater.on("update-not-available", function(info) {
  sendUpdateMessage({
    code: 2,
    msg: message.updateNotAva,
  });
});

// 更新下载进度事件
autoUpdater.on("download-progress", function(progressObj) {
  //与渲染进程通信
  mainWindow.webContents.send(downloadProgress, progressObj);
  // mainWindow.setProgressBar(progressObj.percent / 100);
});
autoUpdater.on("update-downloaded", function(
  event,
  releaseNotes,
  releaseName,
  releaseDate,
  updateUrl,
  quitAndUpdate
) {
  console.log(event);
  console.log(releaseNotes);
  console.log(releaseName);
  console.log(releaseDate);
  console.log(updateUrl);
  console.log(quitAndUpdate);

  autoUpdater.quitAndInstall();
});

ipcMain.on(checkForUpdate, () => {
  //放外面的话启动客户端执行自动更新检查
  autoUpdater.checkForUpdates();
});
function sendUpdateMessage(param) {
  mainWindow.webContents.send("message", param);
}
