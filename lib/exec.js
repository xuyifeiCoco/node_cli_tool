const childProcess = require('child_process');
const which = require('which');
const chalk = require('chalk');

function findYarn() {
    const yarns = ['yarn'];
    for (let i = 0; i < yarns.length; i++) {
        try {
            // 查找环境变量下指定的可执行文件的第一个实例
            which.sync(yarns[i]);
            return yarns[i]
        } catch (e) {
        }
    }
    throw new Error(chalk.red('请安装yarn,通过 npm install yarn -g'));
}
/**
 * 查找系统中用于安装依赖包的命令
 */
function findNpm() {
    const npms = ['tnpm', 'cnpm', 'npm'];
    for (let i = 0; i < npms.length; i++) {
        try {
            // 查找环境变量下指定的可执行文件的第一个实例
            which.sync(npms[i]);
            return npms[i]
        } catch (e) {
        }
    }
    throw new Error(chalk.red('请安装npm'));
}

/**
 * 开启子进程来执行命令
 * @param {String} cmd 待执行的命令 
 * @param {Array} args 命令执行时的参数.
 * @param {Function} fn 执行完成时的回调.
 */
function exec(cmd, args, fn) {
    args = args || [];
    const runner = childProcess.spawn(cmd, args, {
        stdio: 'inherit'
    });

    runner.on('close', function (code) {
        if (fn) {
            fn(code);
        }
    })
}

module.exports = {
    exec,
    findNpm,
    findYarn
};
