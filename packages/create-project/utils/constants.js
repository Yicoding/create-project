'use strict';

const regProject = /^[a-z0-9]+(\-[a-z0-9]+)*$/;

const REGISTRY_NPM = 'https://registry.npmjs.org';

const extraDir = ['node_modules', 'build', 'dist', '.git', 'dist-publish', 'es', 'lib'];

const templateName = '@ecode/react-template';

module.exports = {
  regProject,
  REGISTRY_NPM,
  extraDir,
  templateName,
};
