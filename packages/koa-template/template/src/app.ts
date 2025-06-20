import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import logger from "koa-logger";
const cors = require("koa2-cors");
import { traceIds, requestTrace, healthcheck } from "clarion";

import router from "./routes";

const app = new Koa();

// 初始化日志串联
app.use(traceIds.koaMiddleware());
// 流量监控
app.use(requestTrace.koaMiddleware());
// 无损发布（包含健康检查接口）
app.use(healthcheck.koaMiddleware());
// 请求日志
app.use(logger());
app.use(bodyParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });

export default app;
