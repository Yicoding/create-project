"use strict";

const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk"); // eslint-disable-line
const pkg = require("../package.json");

process.on("unhandledRejection", (err) => {
  throw err;
});

// 部署环境
const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV;
const appDirectory = fs.realpathSync(process.cwd());

// 复制 pm2 配置文件
const ecosystemFilePath = path.resolve(
  appDirectory,
  `ecosystem/ecosystem.config-${DEPLOYMENT_ENV}.js`
);

if (checkRequiredFiles([ecosystemFilePath])) {
  console.log(chalk.cyan(`Current deploy environment: ${DEPLOYMENT_ENV}.\n`));
  const input = fs.readFileSync(ecosystemFilePath, "utf8");
  const output = input.replace(/__PROJECT_NAME__/g, pkg.name);
  fs.writeFileSync(
    path.resolve(appDirectory, "ecosystem.config.js"),
    output,
    "utf8"
  );
  fs.copy(
    path.resolve(appDirectory, "src/origin"),
    path.resolve(appDirectory, "dist/origin")
  );
} else {
  process.exitCode = 1;
}

function checkRequiredFiles(files) {
  let currentFilePath;
  try {
    files.forEach((filePath) => {
      currentFilePath = filePath;
      fs.accessSync(filePath, fs.F_OK);
    });
    return true;
  } catch (err) {
    const dirName = path.dirname(currentFilePath);
    const fileName = path.basename(currentFilePath);
    console.log(chalk.red("Could not find a required file."));
    console.log(chalk.red("  Name: ") + chalk.cyan(fileName));
    console.log(chalk.red("  Searched in: ") + chalk.cyan(dirName));
    return false;
  }
}
