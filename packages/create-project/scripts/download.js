'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chalk = require('chalk');
const replace = require('replace-in-file');

const { tryGitInit, tryGitCommit } = require('../utils/git');
const {
  ensureDir,
  createIgnoreFile,
  yarnpkgAdd,
  removeRootProject,
  yarnpkgRemoveModules,
  createPackageJson,
  inputProjectNameGenerate,
} = require('../utils/tools');
const { regProject } = require('../utils/constants');

async function download(templateName, name, prefix, options) {
  const { replaceContent } = options;
  const { projectName } = await inputProjectNameGenerate(name);

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

  // 创建基础 package.json
  createPackageJson(rootProject, projectName);

  // 切换进程到新建的组件目录
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

  // 模板template.json路径
  const templateJsonPath = path.join(templatePath, 'template.json');

  // 模版template路径
  const templateDir = path.join(templatePath, 'template');

  // template.json内容
  let templateJson = {};
  if (fs.existsSync(templateJsonPath)) {
    templateJson = require(templateJsonPath);
  }
  let projectPackage = require(path.resolve((rootProject, 'package.json')));
  const { dependencies, ...resProjectPackage } = projectPackage;

  try {
    const pkgJson = {
      name:
        prefix && projectName.indexOf(prefix) === -1
          ? `${prefix}${projectName}`
          : projectName,
      ...resProjectPackage,
      ...(templateJson.package || {}),
    };
    // 写入文件
    fs.writeFileSync(
      path.join(rootProject, 'package.json'),
      JSON.stringify(pkgJson, null, 2) + os.EOL,
    );
  } catch (error) {
    console.log('写入package.json报错， 请检查：', error);
    removeRootProject(rootProject, projectName);
    process.exit(1);
  }

  /** 复制文件 */
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, rootProject);
  } else {
    console.log(
      chalk.red(`Error: 从 ${templateName} 复制内容到 ${projectName} 出错`),
    );
    removeRootProject(rootProject, projectName);
    process.exit(1);
  }

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

  // 替换特定名称
  const regex = /projectName2/g;
  replace.sync({
    files: path.join(rootProject, '**/*'),
    from: regex,
    to: projectName,
    ignore: ['**/node_modules/**'],
  });
  console.log('替换特定名称', rootProject, projectName, regex);

  // 替换文件内容
  if (replaceContent) {
    try {
      const regex = new RegExp(replaceContent[0], 'g');
      replace.sync({
        files: path.join(rootProject, '**/*'),
        from: regex,
        to: replaceContent[1],
        ignore: ['**/node_modules/**'],
      });
    } catch (error) {
      console.log(chalk.red('更新 Template 内容出错了', error));
    }
  }

  console.log(
    `\nSuccess! Created ${chalk.greenBright(projectName)} at ${chalk.green(
      rootProject,
    )}\n`,
  );
  console.log(`  ${chalk.cyan('cd')} ${chalk.greenBright(projectName)}`);
  console.log();
  console.log();
  console.log(
    'Now, you can run the following command to start the development:',
  );
  console.log();
}

module.exports = {
  download,
};
