'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chalk = require('chalk');
const standardVersion = require('standard-version');
const spawn = require('cross-spawn');
const {
  appendDataToFile,
  filterFuncAddPkg,
  createIgnoreFile,
  expandPkgName
} = require('../utils/tools');
const { REGISTRY_XNPM, extraDir } = require('../utils/constants');
const { checkGitStatus } = require('../utils/git');

async function publish(options) {

  checkGitStatus()

  // 待删除的scripts数组，支持删除多个
  const { deleteScripts } = options;

  // 待转换项目的根路径
  const currentProjectPath = process.cwd();
  const pkgFileName = 'package.json';
  const tmpFileName = 'template.json';
  const READMEName = 'README.md';
  // 项目package.json路径
  const pkgFilePath = `${currentProjectPath}/${pkgFileName}`;
  // readmeName路径
  const READMEPath = `${currentProjectPath}/${READMEName}`;
  // .gitignore路径
  const gitignoreFilePath = `${currentProjectPath}/.gitignore`;

  // 转换成npm后的发布目录
  const targetDirName = 'dist-publish';
  const targetPath = `${currentProjectPath}/${targetDirName}`;
  const templateDir = `${targetPath}/template`;

  // 判断是否为项目的根目录
  if (!fs.existsSync(pkgFilePath)) {
    console.log(
      chalk.red(`没有检测到${pkgFileName}，请检查当前目录是否为项目的根目录`),
    );
    process.exit(1);
  }

  // 升级version
  try {
    await standardVersion({
      noVerify: true,
      silent: true,
      releaseAs: 'patch',
    });
  } catch (error) {
    console.log(chalk.red('Error: 运行 standard-version 异常'));
    console.log(
      chalk.yellow(
        '若选择的是 Current 版本，该 version 可能已发布过，请确认是否需要重新指定。' + error,
      ),
    );
    console.log();
    process.exit(1);
  }

  // 删除之前的发布目录
  fs.removeSync(targetPath)
  // 创建发布目录
  fs.ensureDirSync(targetPath)
  fs.ensureDirSync(templateDir)

  // 复制当前目录文件到template目录
  const currentDirFilePath = fs.readdirSync(currentProjectPath)
  currentDirFilePath.forEach(filePath => {
    if (extraDir.includes(filePath)) return;
    fs.copySync(`${currentProjectPath}/${filePath}`, `${templateDir}/${filePath}`, {
      filter: filterFuncAddPkg,
    })
  })

  /** 移动后改写文件 */
  // 改写.gitignore文件
  createIgnoreFile(templateDir, '.gitignore', 'gitignore');
  appendDataToFile(gitignoreFilePath, targetDirName)

  // 读取package.json
  const { name, version, author, maintainers, ...originPkgJson } = fs.readJsonSync(pkgFilePath);

  if (!author) {
    console.log(
      chalk.yellow('\npackage.json中必须包含 author 字段\n'),
    );
    process.exit(1);
  }

  if (!maintainers) {
    console.log(
      chalk.yellow('\npackage.json中必须包含 maintainers 字段\n'),
    );
    process.exit(1);
  }

  if (deleteScripts) {
    deleteScripts.forEach(item => {
      if (item) {
        delete originPkgJson.scripts[item]
      }
    })
  }

  // 创建template.json
  const templateJson = {
    package: originPkgJson,
  };

  // 写入创建templateJson
  fs.writeFileSync(
    path.join(targetPath, tmpFileName),
    JSON.stringify(templateJson, null, 2) + os.EOL,
  );


  // 创建发布的package.json
  const pkgJson = {
    name: expandPkgName(name),
    version,
    keywords: [],
    description: '',
    author,
    maintainers,
    main: tmpFileName,
    license: 'MIT',
    files: ['template', tmpFileName],
  };

  // 写入发布的package.json
  fs.writeFileSync(
    path.join(targetPath, pkgFileName),
    JSON.stringify(pkgJson, null, 2) + os.EOL,
  );

  if (fs.existsSync(READMEPath)) {
    fs.copySync(READMEPath, `${targetPath}/${READMEName}`)
  }

  /** 发布 */
  try {
    process.chdir(targetPath);
    const procBuild = spawn.sync(
      'npm',
      ['publish', '--registry', REGISTRY_XNPM],
      {
        stdio: 'inherit',
      },
    );
    if (procBuild.status !== 0) {
      console.log(chalk.red('\nError: 发布失败\n'));
      process.exit(1);
    }
  } finally {
    // 执行结束后进程切回根目录
    process.chdir(currentProjectPath);
  }

  // 发布成功
  console.log(chalk.green(`${pkgJson.name} v${pkgJson.version} 发布成功！`));
  console.log(chalk.green(`查看地址： http://npm.ximalaya.com/package/${pkgJson.name}`));
}

module.exports = {
  publish,
};
