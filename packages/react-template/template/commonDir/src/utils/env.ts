// 编译环境
const { MODE } = import.meta.env;

// 是否为开发环境
export const isDev: boolean = MODE === 'development';
// 是否为mock环境
export const isMock: boolean = MODE === 'mock';
// 是否为本地环境
export const isLocal: boolean = isDev || isMock;
// 是否为测试环境
export const isTest: boolean = MODE === 'test';
// 是否为生产环境
export const isProd: boolean = MODE === 'production';
