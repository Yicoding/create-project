'use strict';

const regProject = /^[a-z0-9]+(\-[a-z0-9]+)*$/;

const REGISTRY_XNPM = 'http://xnpm.ximalaya.com';

const extraDir = ['node_modules', 'build', 'dist', '.git', 'dist-publish', 'es', 'lib'];

const templateName = '@xmly/react-template';

module.exports = {
  regProject,
  REGISTRY_XNPM,
  extraDir,
  templateName,
};
