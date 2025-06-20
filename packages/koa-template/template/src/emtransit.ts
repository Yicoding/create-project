import { start } from 'xtransit';
import { resolveApp } from './common/paths';

start({
  server: process.env.EM_SOCKET,
  appId: process.env.EM_ID,
  appSecret: process.env.EM_SECRET,
  errors: JSON.parse(process.env.EM_ERRORS),
  packages: [`${resolveApp('.')}/package.json`],
  logDir: process.env.EM_LOG_DIR,
  errexp: {},
});
