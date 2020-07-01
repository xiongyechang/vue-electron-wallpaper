import { ipcMain, BrowserWindow, app } from "electron";
import path from "path";

const mainWindow = BrowserWindow.getFocusedWindow();

mainWindow.webContents.session.on(
  "will-download",
  (event, item, webContents) => {
    const filePath = path.join(app.getPath("downloads"), item.getFilename());

    console.log(filePath);

    item.setSavePath(filePath);

    item.on("updated", function(event, state) {
      switch (state) {
        case "progressing":
          if (!item.isPaused()) {
            if (mainWindow.isDestroyed()) {
              return;
            }

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
      console.log(state);
      if (state === "completed") {
        if (process.platform === "darwin") {
          app.dock.downloadFinished(item.getSavePath());
        }

        if (mainWindow.isDestroyed()) {
          return;
        }

        mainWindow.webContents.send("download-done", {
          name: item.getFilename(),
          receive: item.getReceivedBytes(),
          total: item.getTotalBytes(),
        });
      } else if (state === "cancelled") {
        console.log("取消下载");
      }
    });
  }
);

ipcMain.on("download", function(event, uri) {
  console.log(uri);
  mainWindow.webContents.downloadURL(uri);
});
