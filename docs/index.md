# vue+electron 搭建 pc 端跨平台软件

1. vue create demo

2. npm install --save chromedriver
3. vue add electron-builder

# 最大化

- 这里面，最有争议的就应该是 maximize()函数，在标题栏里面的系统最大化按钮，是随时都可以最大化的。但是代码里面编写的 maximize()函数，却要受到一系列参数的限制：比如：maximizable/resizable/maxWidth/maxHeight 这些参数的联合作用。所以，当您试图最大化 maximize()却意外失败的时候，请检查上述参数。

# electron 最大化 bug

```txt
isMaximizable() 和 isFullscreen() 函数始终返回 false, 原因 new BroswerWindow() 时,创建 transparent: true
```

# node.js 的 fs.readdir 函数的问题

```txt
windows 10 平台 node.js 的 readdir 读取一个目录里面的文件默认会根据名称排序,
在电脑上文件排序比如是:  1-1.mp4,  2-2.mp4,  10-4.mp4,
通过node.js读取后顺序是: 1-1.mp4, 10-4.mp4, 2-2.mp4
```
