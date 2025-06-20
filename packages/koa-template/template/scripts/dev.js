const { spawn } = require("child_process");
const { apps } = require("../ecosystem/ecosystem.config-test");
const pkg = require("../package.json");

// 读取测试环境 env
const { env } = apps[0];

const pm2Env = Object.keys(env).reduce(
  (prev, key) => ({ ...prev, [key]: env[key] }),
  {}
);

/**
 * 启动程序
 * @returns
 */
function run() {
  // 启动子进程，主要目的是为了和测试环境共享环境变量
  const [command, ...args] = process.argv.slice(2);

  const tsNode = spawn(command, args, {
    stdio: "inherit",
    detached: true, // 可以不和主进程放在一个 process group，从而防止子进程监听到 signal 事件
    env: Object.assign(pm2Env, {
      ...process.env,
      name: pkg.name,
      NODE_ENV: "development",
    }),
  });

  const shutdown = new Promise((resolve) => {
    tsNode.on("exit", () => {
      console.log("[spawn] process ends.");
      resolve();
    });

    tsNode.on("error", () => {
      console.error("[spawn] init child process error.");
      resolve();
    });
  });

  return { tsNode, shutdown };
}

const { tsNode, shutdown } = run();

const gracefulShutdown = async () => {
  tsNode.kill();
  await shutdown;
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
