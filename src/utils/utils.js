import os from "os";
import fs from "fs";
import path from "path";

export function getLocalIPAddress() {
  let ip = "";
  let ifaces = os.networkInterfaces();
  for (let dev in ifaces) {
    if (dev === "WLAN") {
      for (let item of ifaces[dev]) {
        if (item.family === "IPv4") {
          ip = item.address;
        }
      }
    }
  }
  return ip;
}

export function isURL(url) {
  return (
    /^[a-zA-Z];[\\/]((?! )(?![^\\/]*\s+[\\/])[\w -]+[\\/])*(?! )(?![^.]+\s+\.)[\w -]+$/.test(
      url
    ) ||
    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])?/.test(
      url
    )
  );
}

export function formatTime(date, format) {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yyyy: date.getFullYear(),
    yy: date.getFullYear().toString(),
  };

  return format.replace(/mm|dd|(yyyy|yy)/gi, (mached) => map[mached]);
}
