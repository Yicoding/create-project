'use strict';

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ejs = require('ejs');

const { tryGitInit, tryGitCommit } = require('../utils/git');
const {
  inputProjectNameCreate,
  ensureDir,
  getFiles,
  createIgnoreFile,
  yarnpkgAdd,
  yarnpkgRemoveModules,
  removeRootProject
} = require('../utils/tools');
const { regProject, templateName } = require('../utils/constants');

async function create(name) {
  const { projectName, platform, store } = await inputProjectNameCreate(name);

  if (!regProject.test(projectName)) {
    console.log(
      chalk.red(
        '\n格式错误，小写字母或数字、中划线连接，示例：project-example',
      ),
    );
    process.exit(1);
  }

  // 创建目录
  ensureDir(projectName);

  // 待创建项目的根路径
  const rootProject = path.resolve(projectName);

  // 切换进程到待创建项目的根路径
  process.chdir(rootProject);

  // install component template
  yarnpkgAdd([templateName], () => {
    removeRootProject(rootProject, projectName);
  });

  // 模版npm包的根目录
  const templatePath = path.dirname(
    require.resolve(`${templateName}/package.json`, {
      paths: [rootProject],
    }),
  );

  // 模版template路径
  const templateDir = path.join(templatePath, 'template');

  /** 处理文件 */
  let files = getFiles(templateDir);
  if (platform === 'pc') {
    files = files.filter((o) => !/mobileDir/.test(o));
  } else {
    files = files.filter((o) => !/pcDir/.test(o));
  }
  files.forEach(async (filePath) => {
    let content;
    try {
      content = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });
    } catch { }
    // 文件可读则写入
    if (content) {
      const outPath = filePath
        .replace(templateDir, rootProject) // 替换模板目录
        .replace(/(commonDir|mobileDir|pcDir)\//g, '') // 去除前缀目录
        .replace(/\.ejs$/, ''); // 去除.ejs后缀
      const ourDir = outPath.replace(path.basename(filePath).replace(/\.ejs$/, ''), ''); // 去除文件名
      fs.ensureDirSync(ourDir);
      if (/\.ejs$/.test(filePath)) {
        const str = ejs.render(content, { projectName, platform, store });
        fs.writeFileSync(outPath, str);
      } else {
        fs.copyFileSync(filePath, outPath);
      }
    }
  });

  // remove template pkg
  yarnpkgRemoveModules();

  // create .gitignore
  console.log('\nInitialized .gitignore file.');
  createIgnoreFile(rootProject);

  // git init
  let initializedGit = false;
  if (tryGitInit()) {
    initializedGit = true;
    console.log('\nInitialized a git repository.\n');
  }

  // git commit
  if (initializedGit && tryGitCommit(rootProject)) {
    console.log('\nCreated git commit.');
  }

  console.log(
    `\nSuccess! Created ${chalk.greenBright(projectName)} at ${chalk.green(
      rootProject,
    )}\n`,
  );
  console.log(`  ${chalk.cyan('cd')} ${chalk.greenBright(projectName)}`);
  console.log();
  console.log(chalk.cyan('  执行yarn'));
  console.log('    先安装项目依赖.');
  console.log(chalk.cyan('  yarn dev'));
  console.log('    启动本地开发.');
  console.log();
  console.log(chalk.cyan('  yarn mock'));
  console.log('    本地开发时使用mock数据.');
  console.log();
  console.log(chalk.cyan('  yarn start-test'));
  console.log('    本地开发时启用测试环境.');
  console.log();
  console.log(
    'Now, you can run the following command to start the development:',
  );
  console.log();
}

module.exports = {
  create,
};
