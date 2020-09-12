#`用到的工具包`
1、commander 其作用是让 node 命令行程序的制作更加简单，封装后的 node 命令行接口 #`配置`
1、添加全局命令的时候需要在`cli`的头部标明当前的执行环境

# npm 常用命令

npm login
npm publish
npm unpublish --force 删除刚刚发布的包

# npm 建立本地包的链接

在当前包的下面执行 `sudo npm link`

### 注意：在入口文件需要添加 #!/usr/bin/env node
