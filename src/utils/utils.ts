import os from "os";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

export function getLocalIPAddress() {
  let ip = "";
  const ifaces = os.networkInterfaces();
  for (const dev in ifaces) {
    if (dev === "WLAN") {
      for (const item of (ifaces[dev]||[])) {
        if (item.family === "IPv4") {
          ip = item.address;
        }
      }
    }
  }
  return ip;
}

export function isURL(url:string) {
  return (
    /^[a-zA-Z];[\\/]((?! )(?![^\\/]*\s+[\\/])[\w -]+[\\/])*(?! )(?![^.]+\s+\.)[\w -]+$/.test(
      url
    ) ||
    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])?/.test(
      url
    )
  );
}

export function getBinary(uri) {
  return new Promise((resolve, reject) => {
    let request = null; // 请求
    if (/^https/.test(uri)) {
      request = https;
    } else {
      request = http;
    }

    request.get(
      uri, {
        headers: {
          Accept: "*/*",
          Referer: new URL(uri).origin,
          "Accept-Encoding": "binary", //这里设置返回的编码方式 设置其他的会是乱码
          Connection: "keep-alive",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        },
      },
      function (req, res) {
        let data = "";

        req.setEncoding("binary");

        req.on("data", function (chunk) {
          data += chunk;
        });

        req.on("end", function () {
          resolve(data);
        });

        req.on("error", function (e) {
          reject(e);
        });
      }
    );
  });
}

// export function notify(title: string, options: Notification) {
//    // 先检查浏览器是否支持
//    if (!window.Notification) {
//     console.log('浏览器不支持通知');
//   } else {
//     // 检查用户曾经是否同意接受通知
//     if (Notification.permission === 'granted') {
//       const notification = new Notification(title, options); // 显示通知
//       return Promise.resolve(notification);
//     } else if (Notification.permission === 'default') {
//       // 用户还未选择，可以询问用户是否同意发送通知
//       Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//           console.log('用户同意授权');
//           const notification = new Notification(title, options); // 显示通知
//           return notification;
//         } else if (permission === 'default') {
//           console.warn('用户关闭授权 未刷新页面之前 可以再次请求授权');
//         } else {
//           // denied
//           console.log('用户拒绝授权 不能显示通知');
//         }
//       });
//     } else {
//       // denied 用户拒绝
//       console.log('用户曾经拒绝显示通知');
//     }
//   }
// }