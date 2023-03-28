import request from 'utils/request';

import endpoints from './endpoints';
import config from 'utils/config';
import { Method } from 'axios';

export type Response<T> = Promise<{
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}>;

export const gen = (params: string, baseURL = config.baseURL) => {
  let url = params;
  let method: Method = 'GET';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    method = paramsArray[0] as Method;
    url = paramsArray[1];
  }

  return function (data: any, params: any, headers: any) {
    return request(url, {
      data,
      method,
      params: params ? params : method === 'GET' ? data : params,
      baseURL,
      headers,
    });
  };
};

type APIFunc = (data?: any, params?: any, headers?: any) => Response<any>;

type APIMap = {
  [key in keyof typeof endpoints]: APIFunc;
};

const api = {};
for (const key in endpoints) {
  switch (key) {
    default:
      api[key] = gen(endpoints[key]);
      break;
  }
}

export default api as APIMap;
