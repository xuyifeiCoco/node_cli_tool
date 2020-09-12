const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const node_ssh = require("node-ssh");
const ora = require("ora");
const archiver = require("archiver");
const {
  successLog,
  errorLog,
  underlineLog,
  infoLog,
} = require("./utils/index");

const projectDir = process.cwd(); //执行当前程序的目录
let ssh = new node_ssh(); // 生成ssh实例

async function updateData() {
  const configPath = path.join(projectDir, "./deploy_config/deploy.config.js");
  if (!fs.existsSync(configPath)) {
    console.log(
      `请现在当前目录新建${underlineLog("./deploy_config/deploy.config.js")}`
    );
    process.exit(0);
    return;
  }
  //   const config = require(configPath);
  let {
    localFilePath,
    webDir,
    commond,
    projectName,
    prefentSh,
    afterSh,
  } = config;
  try {
    if (prefentSh) {
      var flag = await prefentSh(childProcess.execSync, projectDir, ora);
    }
    await startZip(localFilePath);
    await connectSSH(config);
    await uploadFile(webDir);
    await statrRemoteShell(webDir, commond, afterSh);
    await deleteLocalZip();
    successLog(`\n 恭喜您，${underlineLog(projectName)}项目部署成功了^_^\n`);
    process.exit(0);
  } catch (err) {
    errorLog(`  部署失败 ${err}`);
    process.exit(1);
  }
}

async function connectSSH(config) {
  const {
    host,
    port,
    username,
    password,
    privateKey,
    passphrase,
    webDir,
  } = config;
  const sshConfig = {
    host,
    port,
    username,
    password,
    privateKey,
    passphrase,
  };
  try {
    console.log(`连接${underlineLog(host)}`);
    await ssh.connect(sshConfig);
    successLog("  SSH连接成功");
  } catch (err) {
    errorLog(`  连接失败 ${err}`);
    process.exit(1);
  }
}

function getFileName(name) {
  if (name) {
    const list = name.split("/");
    return list[list.length - 1];
  }
}
// 开始打包
async function startZip(localFilePath) {
  return new Promise((resolve, reject) => {
    infoLog("1、开始打包成zip");
    const archive = archiver("zip", {
      zlib: { level: 9 },
    }).on("error", (err) => {
      throw err;
    });
    const stat = fs.lstatSync(localFilePath);

    // // 创建文件输出流
    const output = fs
      .createWriteStream(`${projectDir}/dist.zip`)
      .on("close", (err) => {
        if (err) {
          errorLog("  关闭archiver异常:", err);
          reject(err);
          return;
        }
        successLog("  zip打包成功");
        resolve();
      });
    archive.pipe(output);
    if (stat.isFile()) {
      archive.append(fs.createReadStream(localFilePath), {
        name: getFileName(localFilePath),
      }); //压缩文件
    } else {
      archive.directory(localFilePath, false); //'./upload'   // 从distPath子目录追加内容并重命名
    }
    archive.finalize(); //  // 完成打包归档
  });
}

// 上传文件

async function uploadFile(webDir) {
  try {
    console.log(`上传zip至目录${underlineLog(webDir)}`);
    const spinner = ora("正在上传中...");
    spinner.start();
    await ssh.putFile(`${projectDir}/dist.zip`, `${webDir}/dist.zip`);
    spinner.stop();
    successLog("  zip包上传成功");
  } catch (err) {
    errorLog(`  zip包上传失败 ${err}`);
    process.exit(1);
  }
}

// 执行Linux命令
async function runCommand(command, webDir) {
  await ssh.execCommand(command, { cwd: webDir });
}
// 开始执行远程命令
async function statrRemoteShell(webDir, commond, afterSh) {
  infoLog("开始执行服务器的命令");
  try {
    await runCommand(`cd ${webDir}`, webDir);
    await runCommand("unzip dist.zip", webDir);

    if (commond) {
      await runCommand(`chmod +x ./${commond}`, webDir);
      await runCommand(commond, webDir);
      await runCommand("rm -rf run.sh", webDir);
    }
    if (afterSh) {
      await runCommand(afterSh, webDir);
    }
    successLog("  服务端执行成功");
  } catch (err) {
    errorLog(`  服务器命令执行失败${err}`);
    process.exit(1);
  }
}
async function deleteLocalZip() {
  return new Promise((resolve, reject) => {
    infoLog("开始删除本地zip包");
    fs.unlink(`${projectDir}/dist.zip`, (err) => {
      if (err) {
        errorLog(`  本地zip包删除失败 ${err}`, err);
        reject(err);
        process.exit(1);
      }
      successLog("  本地zip包删除成功\n");
      resolve();
    });
  });
}

module.exports = updateData;
