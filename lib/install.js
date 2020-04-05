const which = require('which');
const { exec, findNpm, findYarn } = require('./exec');
const { successLog, infoLog } = require('./utils/index')

/**
 * 执行npm install命令, 安装项目依赖.
 */
const install = (projectName) => {
    const yarn = findYarn();
    exec(which.sync(yarn), ['install'], function () {
        successLog(yarn + '安装完成');
        infoLog(`cd ${projectName} 开始工作`);

    });
    // const yarn = findYarn();
    // exec(which.sync(yarn), ['install'], function () {
    //     console.log(yarn + '安装完成');
    // });
};

module.exports = {
    install
};

