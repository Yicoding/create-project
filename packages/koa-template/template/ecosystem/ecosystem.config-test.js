module.exports = {
  apps: [
    {
      name: "__PROJECT_NAME__",
      script: "./dist/index.js",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      log_date_format: "YYYY-MM-DD HH:mm:ss:SS",
      error_file: "/var/log/__PROJECT_NAME__/error.log",
      out_file: "/var/log/__PROJECT_NAME__/out.log",
      env: {
        NODE_ENV: "production",
        EM_LOG_DIR: "/var/log/__PROJECT_NAME__",
      },
    },
    {
      name: "__PROJECT_NAME__ xtransit process",
      script: "dist/emtransit.js",
      exec_mode: "fork",
      error_file: `/logs/trace/logs/log-__PROJECT_NAME__-log.out`,
      out_file: `/logs/trace/logs/dynamic-__PROJECT_NAME__-log.out`,
      env: {
        EM_ID: "99",
        EM_SECRET: "xxx",
        EM_SOCKET: "ws://xx.xx.xx.local",
        EM_ERRORS: [
          `/var/log/__PROJECT_NAME__/error.out`, // 生产、UAT PM2 错误日志
          `/var/log/trace/logs/log-__PROJECT_NAME__-log.out`, // 生产、UAT XDCS 错误日志
          `/logs/trace/logs/log-__PROJECT_NAME__-log.out`, // 测试错误日志
        ],
        EM_LOG_DIR: "/var/log/__PROJECT_NAME__",
      },
    },
  ],
};
