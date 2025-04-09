/** 接口响应结构 */
export type ResponseConstructor<T = any> = {
  ret: number;
  msg: string;
  data: T;
};
