export const HttpResponseCode = {
  OK: 200,
  NotFount: 404,
  UNAUTHORIZED: 401,
  EXCEPTION: 500,
  ERROR: 400
}

export const Update = {
  CheckForUpdate: "check-for-update", // 检查更新
  CheckingForUpdate: "checking-for-update", // 检查更新
  IsUpdate: "is-update", // 是否更新
  IsInstallNow: "is-install-now", // 是否现在安装
  DownloadProgress: "download-progress", // 下载进度
  CancelUpdate: "cancel-update", // 取消下载
  UploadProgress: "upload-progress", // 上传进度
  Error: "error", // 错误
  UpdateAvailable: "update-available",
  UpdateNotAvailable: "update-not-available",
  UpdateDownloaded: "update-downloaded",
  Message: "message",
  Download: "download",
  DownloadDone: "download-done",
}

export const Button = {
  OK: "确定",
  Cancel: "取消"
}

export const WindowSize = {
  maximize: "maximize",
  minimize: "minimize",
  normal: "normal",
};

export const WindowSizeIcon = {
  max: "el-icon-full-screen",
  normal: "el-icon-copy-document",
};

export const NETWORK = {
  WIFI_ONLINE: 'icon-wifi-on-line',
  WIFI_OFFLINE: 'icon-wifi-off-line',
  NET_ONLINE: 'icon-online',
  ONLINE: 'online',
  OFFLINE: 'offline'
}

export const BATTERY = {
  FULL: 'icon-battery-full',
  EMPTY: 'icon-battery-empty',
  CHARGING: 'icon-battery-charging'
}

export interface Response {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}

export enum Action {
  Preview ='Preview',
  Download = 'Download',
  SetWallpaper = 'SetWallpaper',
  ViewInfo = 'ViewInfo',
  Contextmenu = 'Contextmenu',
  Hide = 'Hide',
}


export enum Platform {
  Windows_NT = 'Windows_NT',
  Linux = "Linux",
  Darwin = "Darwin", // MacOS 
}