declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly DEPLOYMENT_ENV: "test" | "uat" | "production";
    readonly INSTANCE_ID: string | undefined;
    readonly REDIS_HOST: string;
    readonly REDIS_PORT: string;
    readonly REDIS_PASSWORD: string;
    readonly PORT: string;
    /** 存储系统的应用名 */
    readonly STORAGE_APP_KEY: string;
    /** 存储系统的秘钥 */
    readonly STORAGE_APP_SECRET: string;
    /** 存储系统的资源域名 */
    readonly STORAGE_ORIGIN: string;
    readonly EM_ID: string;
    readonly EM_SECRET: string;
    readonly EM_SOCKET: string;
    readonly EM_ERRORS: string;
    readonly EM_LOG_DIR: string;
    /** activity-maker-builder 的版本号 */
    readonly APP_VERSION: string;
    /** 内网用的域名，方便内部服务间调用，可以不走 consul */
    readonly AM_ORIGIN: string;
  }
}

declare module "xtransit";
