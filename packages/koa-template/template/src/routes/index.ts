import Router from "@koa/router";
import activity from "./activity";
import { name } from "../package.json";

const router = new Router({ prefix: `/${PROJECT_NAME}` });

router.use("/activity", activity.routes());

export default router;
