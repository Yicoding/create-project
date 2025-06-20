import Router from "@koa/router";

const router = new Router();

router.get("/getActivity", async (ctx) => {
  try {
    const query = ctx.request.query;

    ctx.body = {
      ret: 0,
      msg: "success",
      data: "getActivity",
    };
  } catch (error) {
    console.log("error", error);
    ctx.body = { ret: -1, msg: error };
  }
  ctx.status = 200;
});

router.post("/createActivity", async (ctx) => {
  try {
    const data = ctx.request.body;

    ctx.body = {
      ret: 0,
      msg: "success",
      data: "createActivity",
    };
  } catch (error) {
    console.log("error", error);
    ctx.body = { ret: -1, msg: error };
  }
  ctx.status = 200;
});

export default router;
