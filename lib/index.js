#!/usr/bin/env node

const which = require("which");
const inquirer = require("inquirer");
const ora = require("ora");
const program = require("commander");
const deploy = require("./onlyUpdate");
const { exec, findNpm, findYarn } = require("./exec");
const { successLog, infoLog, errorLog } = require("./utils/index");
const { moBanList } = require("./config");
const { clone } = require("./download");

/**
 * 执行npm install命令, 安装项目依赖.
 */
const install = (projectName) => {
  const yarn = findYarn();
  exec(which.sync(yarn), ["install"], function () {
    successLog(yarn + "安装完成");
    infoLog(`cd ${projectName} 开始工作`);
  });
  // const yarn = findYarn();
  // exec(which.sync(yarn), ['install'], function () {
  //     console.log(yarn + '安装完成');
  // });
};
if (process.argv.length == 2) {
  successLog(`
                           youdi_cli 命令
    ------------------------------------------------------------
       youdi_cli create <template> projectName  |  创建项目
       youdi_cli -V                                |  查看版本号
       youdi_cli list                               |  查看模板列表
       youdi_cli publish                          |  服务器发布代码
    ------------------------------------------------------------
`);
}

async function dowlandMoban(downloadUrl, projectName) {
  try {
    await clone(downloadUrl, projectName);
    successLog(`下载成功 cd ${projectName} and yarn install`);
  } catch (err) {
    errorLog("下载失败");
  }
}

program
  .version(require("../package.json").version, "-v, --version")
  .command("create <template> <project>")
  .description("初始化项目模板")
  .action(async (templateName, projectName) => {
    let downloadUrl = moBanList[templateName];
    if (downloadUrl) {
      dowlandMoban(downloadUrl, projectName);
    } else {
      inquirer
        .prompt([
          {
            type: "input",
            name: "project_name",
            message: "请输入项目名称",
            default: "ceshi",
          },
          {
            type: "list",
            name: "template_name",
            message: "请选择需要下载的模板",
            choices: ["vue_mobile", "vue_web"],
            default: "vue_mobile",
          },
        ])
        .then((answer) => {
          dowlandMoban(moBanList[answer.template_name], answer.project_name);
        });
    }
  });
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    successLog(`
                              油滴的vue 模板
            -----------------------------------------------
                 vue_mobile        vue的移动端模板  
                 vue_web            vue的web端模板
            -----------------------------------------------
        `);
  });

program
  .command("publish")
  .description("发布项目到服务器")
  .action(() => {
    deploy();
  });

program.parse(process.argv);
// install("ceshi");

// module.exports = {
//     install
// };
