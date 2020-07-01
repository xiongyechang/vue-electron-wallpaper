const Action = {
  OpenFile: "OpenFile", // 导入视频
  OpenDirectory: "OpenDirectory", //

  OpenFileReply: "OpenFileReply",
  OpenDirectoryReply: "OpenDirectoryReply",

  Play: "Play", // 播放视频
  Refresh: "Refresh", // 刷新视频列表
  Clear: "Clear", // 清空视频列表
  ImportReply: "ImportReply", // 导入视频回复
};

module.exports = Action;
