const ora = require('ora')
const p = ora('创建中...')
p.start();
setTimeout(() => {
  p.stop();
}, 3000);
