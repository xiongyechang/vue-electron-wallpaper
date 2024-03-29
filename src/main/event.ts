import { Update } from "@/constants/constants";
import { ipcMain, BrowserWindow, app } from "electron";
import path from "path";
// import { Action } from '@/constants/constants';

const mainWindow = BrowserWindow.getFocusedWindow();

mainWindow.webContents.session.on(
  "will-download",
  (event, item, webContents) => {
    const filePath = path.join(app.getPath("downloads"), item.getFilename());

    console.log(event);

    console.log(item);

    console.log(filePath);

    item.setSavePath(filePath);

    item.on("updated", function(event, state) {
      switch (state) {
        case "progressing":
          if (!item.isPaused()) {
            if (mainWindow.isDestroyed()) {
              return;
            }

            mainWindow.setProgressBar(item.getReceivedBytes() / item.getTotalBytes());

            mainWindow.webContents.send("downloading", {
              name: item.getFilename(),
              receive: item.getReceivedBytes(),
              total: item.getTotalBytes(),
            });
          }

          break;
        case "interrupted":
          console.log("下载已经取消");
      }
    });

    item.once("done", function(error, state) {
      if (state === "completed") {

        mainWindow.setProgressBar(0); 

        if (process.platform === "darwin") {
          app.dock.downloadFinished(item.getSavePath());
        }

        if (mainWindow.isDestroyed()) {
          return;
        }

        mainWindow.webContents.send(Update.DownloadDone, {
          name: path.join(app.getPath(`downloads`), item.getFilename()),
          receive: item.getReceivedBytes(),
          total: item.getTotalBytes(),
        });
      } else if (state === "cancelled") {
        console.log("取消下载");
      }
    });
  }
);

ipcMain.on(Update.Download, function(event, uri) {
  mainWindow.webContents.downloadURL(uri);
});

// ipcMain.on(Action.SetWallpaper, function(event, imagePath) {
//   wallpaper.set(imagePath);
// })
