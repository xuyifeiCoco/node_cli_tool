const { promisify } = require("util");
const ora = require("ora");

/**
 * 从git仓库上下载项目到本地
 * @param {String} repo git仓库地址
 * @param {String} desc 本地的路径
 */
const clone = async function (repo, desc) {
  // 包装成一个promise方法.
  const download = promisify(require("download-git-repo"));
  // 显示下载进度.
  const process = ora(`${desc} 创建中...`);
  process.start();

  try {
    await download(repo, desc);
    process.succeed();
  } catch (error) {
    process.fail(error.message);
  }
};

module.exports = {
  clone,
};

// clone('github:xuyifeiCoco/wepackReact#master','fasd')
