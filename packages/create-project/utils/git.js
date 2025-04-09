'use strict';

const { execSync } = require('child_process');
const chalk = require('chalk');

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository()) {
      return false;
    }

    execSync('git init --initial-branch=master', { stdio: 'ignore' });
    return true;
  } catch (e) {
    // console.warn('Git repo not initialized', e);
    // return false;
    try {
      execSync('git init', { stdio: 'ignore' });
      return true;
    } catch (e) {
      console.warn('Git repo not initialized', e);
      return false;
    }
  }
}

function tryGitCommit(appPath) {
  try {
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "chore: initialize"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    // We couldn't commit in already initialized git repo,
    // maybe the commit author config is not set.
    // In the future, we might supply our own committer
    // like Ember CLI does, but for now, let's just
    // remove the Git files to avoid a half-done state.
    console.warn('Git commit not created', e);
    console.warn('Removing .git directory...');
    try {
      // unlinkSync() doesn't work on directories.
      fs.removeSync(path.join(appPath, '.git'));
    } catch (removeErr) {
      // Ignore.
    }
    return false;
  }
}

/**
 * 检测代码，确认已 commit、push
 */
function checkGitStatus() {
  try {
    const regCommit = /(M\s)|(\?\?\s)|(D\s)|(A\s)/g;
    const regPush = /\[ahead\s\d*\]/;
    const msg = execSync('git status -b -s').toString().trim();
    const tips = `发布组件前先 commit、push 代码，可以避免多人发布同一组件时代码产生差异。`;

    // no commit
    if (regCommit.test(msg)) {
      console.log(
        chalk.yellow('\n检测到工作区代码还未提交，请先 Commit 代码。\n'),
      );
      console.log();
      console.log(chalk.gray(tips));
      process.exit(1);
    }

    // no push
    if (regPush.test(msg)) {
      console.log(
        chalk.yellow('\n检测到本地仓库代码还未推送，请先 Push 代码。\n'),
      );
      console.log();
      console.log(chalk.gray(tips));
      process.exit(1);
    }
  } catch (error) {
    console.log(error);
    console.log(chalk.red('\nError: Git 状态检测出现异常\n'));
    process.exit(1);
  }
}

module.exports = {
  isInGitRepository,
  tryGitInit,
  tryGitCommit,
  checkGitStatus
};
