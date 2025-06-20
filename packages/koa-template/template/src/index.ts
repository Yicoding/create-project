import http from "http";
import { start } from "xprofiler";
import { clarion } from "clarion";

import { PROJECT_NAME } from "./utils/config";
import app from "./app";

import { port } from "./utils/config";

const server = http.createServer(app.callback());

if (process.env.NODE_ENV !== "development") {
  // 初始化 easy-monitor 日志
  start({ log_dir: process.env.EM_LOG_DIR });
  // XDCS 日志
  clarion.init(PROJECT_NAME);
}

server.listen(port, async () => {
  console.log("-----------DIVIDER-----------");
  console.log(`🚀 Server started at http://localhost:${port}/`);
});
