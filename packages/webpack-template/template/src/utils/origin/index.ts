/**
 * url origin
 *  - 推荐尽可能使用 https
 *  - 自动区分编译环境
 *  - 根据xxx各环境的 path 规则，自动生成 origin
 */

import generate from './generate';

/**
 * https://m.xxxx.com
 */
export const ORIGIN_M = generate();

/**
 * https://mobile.xxxx.com
 */
export const ORIGIN_MOBILE = generate({
  subdomain: 'mobile',
});
