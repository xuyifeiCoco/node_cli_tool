const which = require('which');
const { exec, findNpm, findYarn } = require('./exec');

/**
 * 执行npm install命令, 安装项目依赖.
 */
const install = () => {
    // const npm = findNpm();
    // exec(which.sync(npm), ['install'], function () {
    //     console.log(npm + '安装完成');
    // });
    const yarn = findYarn();
    exec(which.sync(yarn), ['install'], function () {
        console.log(yarn + '安装完成');
    });
};

module.exports = {
    install
};

