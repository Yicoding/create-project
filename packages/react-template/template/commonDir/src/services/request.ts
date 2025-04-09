import axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance
} from 'axios';
import { getRandomInt } from '@/utils/tools';
import type { ResponseConstructor } from './types';

// 接口请求超时时长，可根据需要自行修改
const AXIOS_TIME_OUT = 50 * 1000;

const service: AxiosInstance = axios.create({
  // 如果整个项目的请求域名只有一个，可以设置统一的baseURL
  // baseURL: "",
  timeout: AXIOS_TIME_OUT
});

// 全局请求加时间戳防止缓存
service.interceptors.request.use((config) => {
  // 设置超时时长
  config.timeout = AXIOS_TIME_OUT;
  if (config.method && config.method.toUpperCase() === 'GET') {
    config.params = {
      _ts: Date.now() + `00${getRandomInt(0, 100)}`.slice(-3),
      ...config.params
    };
  }
  return config;
});

// 响应
service.interceptors.response.use(
  (response: AxiosResponse<ResponseConstructor>) => {
    const { ret, data } = response.data;
    if (ret === 0) {
      return data;
    }
    return Promise.reject(response.data);
  },
  (error: AxiosError) => {
    return Promise.reject(error.response);
  }
);

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  }
};
