import { autoUpdater, CancellationToken } from "electron-updater";
import { BrowserWindow, ipcMain } from "electron";
import { baseURL } from "../config/config";
import { Update } from "@/constants/constants";

const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

const cancellationToken = new CancellationToken();

//执行自动更新检查
const feedUrl = `${baseURL}`; // 更新包位置

autoUpdater.autoDownload = false;

autoUpdater.setFeedURL(feedUrl);

const message:any = {
  error: "检查更新出错",
  checking: "正在检查更新……",
  updateAva: "检测到新版本，正在下载...",
  updateNotAva: "现在使用的就是最新版本，不用更新",
};

autoUpdater.on(Update.Error, function(error: Error) {
  sendUpdateMessage({
    code: 0,
    msg: message.error,
  });
});
autoUpdater.on(Update.CheckingForUpdate, function() {
  sendUpdateMessage({
    code: 1,
    msg: message.checking,
  });
});
autoUpdater.on(Update.UpdateAvailable, function(info?:any) {
  mainWindow.webContents.send(Update.IsUpdate);
});

ipcMain.on(Update.IsUpdate, (event, data) => {
  console.log(data);
  if (data) {
    autoUpdater.downloadUpdate(cancellationToken); // 手动下载
  }
});
// 取消下载
ipcMain.on(Update.CancelUpdate, (event, data) => {
  if (data) {
    cancellationToken.cancel();
  }
});

// autoUpdater.autoDownload = false;
autoUpdater.on(Update.UpdateNotAvailable, function(info:any) {
  sendUpdateMessage({
    code: 2,
    msg: message.updateNotAva,
  });
});

// 更新下载进度事件
autoUpdater.on(Update.DownloadProgress, function(progressObj:any) {
  //与渲染进程通信
  mainWindow.webContents.send(Update.DownloadProgress, progressObj);
  // mainWindow.setProgressBar(progressObj.percent / 100);
});

autoUpdater.on(Update.UpdateDownloaded, function(
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

ipcMain.on(Update.CheckForUpdate, () => {
  //放外面的话启动客户端执行自动更新检查
  autoUpdater.checkForUpdates();
});

function sendUpdateMessage(param:any) {
  mainWindow.webContents.send(Update.Message, param);
}
