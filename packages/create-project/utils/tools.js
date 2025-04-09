'use strict';

const path = require('path');
const os = require('os');
const chalk = require('chalk');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const inquirer = require('inquirer');

const { REGISTRY_NPM, regProject, extraDir } = require('./constants');
/**
 * yarnpkg add deps
 * @param {Array} deps
 * @param {Function} error
 */
function yarnpkgAdd(deps, error, options = []) {
  console.log(`Installing ${chalk.cyan(deps.join(','))} ...`);

  const proc = spawn.sync(
    'yarn',
    ['add', ...deps, ...options, '--registry', REGISTRY_NPM],
    {
      stdio: 'inherit',
    },
  );
  if (proc.status !== 0) {
    console.log(chalk.red(`Error: yarn add ${deps.join(',')} error`));
    typeof error === 'function' && error();
    process.exit(1);
  }
  console.log('install success');
}

/**
 * yarnpkg remove deps
 * @param {Array} deps
 * @param {Function} error
 */
function yarnpkgRemove(deps, error) {
  console.log(`\nRemoving ${chalk.cyan(deps.join(','))}...`);

  const proc = spawn.sync('yarn', ['remove', ...deps], {
    stdio: 'inherit',
  });
  if (proc.status !== 0) {
    console.log(chalk.red(`Error: yarn remove ${deps.join(',')} failed`));
    typeof error === 'function' && error();
    process.exit(1);
  }
}
function yarnpkgRemoveModules() {
  const proc = spawn.sync('rm', ['-rf', 'node_modules', 'yarn.lock'], {
    stdio: 'inherit',
  });
  if (proc.status !== 0) {
    process.exit(1);
  }
}

const FRAMEWORKS = {
  type: 'input',
  name: 'projectName',
  message: '请输入项目英文名称（小写字母或数字、中划线连接）：',
  validate(projectName) {
    // 组件名格式 ☞ 小写字母或数字、中划线连接
    if (!regProject.test(projectName)) {
      console.log(
        chalk.yellow(
          '\n格式错误，小写字母或数字、中划线连接，示例：component-example',
        ),
      );
      return false;
    }
    return true;
  },
};

/**
 * 输入交互
 */
async function inputProjectNameCreate(name) {
  const answers = await inquirer.prompt([
    {
      ...FRAMEWORKS,
      when: () => !name,
    },
    {
      type: 'list',
      name: 'platform',
      message: '请选择一个模式：',
      default: 0,
      choices: ['mobile', 'pc'],
    },
  ]);
  if (name) {
    return {
      ...answers,
      projectName: name,
    };
  }
  return answers;
}

async function inputProjectNameGenerate(name) {
  const answers = await inquirer.prompt([
    {
      ...FRAMEWORKS,
      when: () => !name,
    },
  ]);
  if (name) {
    return {
      ...answers,
      projectName: name,
    };
  }
  return answers;
}

async function inputProjectPath() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: '请输入生成模版后的存放目录：',
    },
  ]);
  return answers;
}

/**
 * 创建 .gitignore
 * @param {String} rootProject
 */
function createIgnoreFile(
  rootProject,
  origin = 'gitignore',
  target = '.gitignore',
) {
  const gitignoreExists = fs.existsSync(path.join(rootProject, origin));

  if (gitignoreExists) {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fs.moveSync(
      path.join(rootProject, origin),
      path.join(rootProject, target),
      [],
    );
  }
}

/**
 * 目录不存在自动创建，已存在直接退出。
 * @param {String} dir
 */
function ensureDir(dir) {
  if (fs.existsSync(dir)) {
    console.log(
      chalk.red(
        `Error: 当前目录下已存在文件夹 ${chalk.yellow(
          dir,
        )} 请移除或更换其它名称`,
      ),
    );
    process.exit(1);
  } else {
    // node v10 下 ensureDir/ensureDirSync 表现不一致，不返回路径
    fs.ensureDirSync(dir);
  }
}

/**
 * 创建失败，移除新建目录
 * @param {String} rootProject
 * @param {String} projectName
 */
function removeRootProject(rootProject, projectName) {
  console.log(
    `Deleting ${chalk.cyan(`${projectName}`)} from ${chalk.cyan(
      path.resolve(rootProject, '..'),
    )}`,
  );
  // 进程切换到上一级
  process.chdir(path.resolve(rootProject, '..'));
  fs.removeSync(path.join(rootProject));
}

// 递归获取目录下所有文件路径
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function createPackageJson(rootProject, projectName) {
  // 初始化基础的 package.json
  const pkgJson = {
    version: '1.0.0',
    description: '',
    keywords: [],
    license: 'MIT',
  };

  fs.writeFileSync(
    path.join(rootProject, 'package.json'),
    JSON.stringify(pkgJson, null, 2) + os.EOL,
  );
}

// 复制目录时过滤文件
// 定义一个过滤函数，过滤掉某些目录和文件
function filterFuncAddPkg(src) {
  const basename = path.basename(src);
  const isLockFile = basename.includes('.lock');
  const isLogFile = basename.includes('.log');
  return (
    ![...extraDir, 'package.json'].includes(
      basename,
    ) &&
    !isLockFile &&
    !isLogFile
  );
}
function filterFunc(src) {
  const path = require('path');
  const basename = path.basename(src);
  const isLockFile = basename.includes('.lock');
  const isLogFile = basename.includes('.log');
  return (
    !extraDir.includes(basename) &&
    !isLockFile &&
    !isLogFile
  );
}

// 向文件中追加内容
function appendDataToFile(filePath, data) {
  const content = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
  if (content.indexOf(data) === -1) {
    fs.appendFileSync(filePath, data);
  }
}

module.exports = {
  yarnpkgAdd,
  yarnpkgRemove,
  yarnpkgRemoveModules,
  inputProjectNameCreate,
  inputProjectNameGenerate,
  inputProjectPath,
  createIgnoreFile,
  ensureDir,
  removeRootProject,
  getFiles,
  createPackageJson,
  filterFuncAddPkg,
  filterFunc,
  appendDataToFile
};
