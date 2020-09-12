module.exports = {
  dev: {
    localFilePath:
      "/Users/piguanzheng/Documents/youdi_platform/buyer_app/publish/dev",
    webDir: "/opt/www/youdi-platform/app", //上传到服务器的位置
    // commond: './run.sh',
    projectName: "",
    prefentSh: async (exec, dir, ora) => {
      try {
        console.log("开始打包");
        exec("npm run build", { cwd: dir });
        console.log("打包成功,开始压缩上传");
      } catch (err) {
        process.exit(1);
      }
    },
    afterSh: "rm -rf pad && mv dist pad",
    //服务器相关配置
    password: "",
    username: "",
    host: "",
    port: "22",
  },
  pro: {
    localFilePath:
      "/Users/piguanzheng/Documents/study/github_study/auto_upload/deploy_x/dist/index.html",
    webDir: "/opt/www/youdi-platform/ceshi", //上传到服务器的位置
    //服务器相关配置
    password: "",
    username: "web",
    host: "",
    port: "",
  },
};
