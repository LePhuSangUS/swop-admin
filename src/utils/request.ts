import { message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { cloneDeep } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import store from 'store';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constants';
import config from './config';

const codeMessage = {
  400: 'There was an error in the request, and the server did not create or modify data.',
  401: 'The user does not have permissions.',
  403: 'The user is authorized, but access is prohibited.',
  404: 'The request was made for a record that does not exist, and the server did not perform an operation.',
  422: 'When creating an object, a validation error occurred.',
  500: 'A server error occurred. Please check the server.',
  502: 'Gateway error.',
  503: 'Services are unavailable and the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};

const { CancelToken } = axios;
// @ts-ignore
window.cancelRequest = new Map();

const request = (url: string, options: AxiosRequestConfig & { isAuthorized?: boolean }) => {
  const {
    data,
    baseURL = config.baseURL,
    isAuthorized = true,
    headers = { 'Content-Type': 'application/json' },
  } = options;

  const cloneData = cloneDeep(data);

  try {
    let domain = '';
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      url = url.slice(domain.length);
    }

    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + url;
  } catch (e: any) {
    message.error(e.message);
  }

  options.headers = {
    ...headers,
    isAuthorized,
  };
  options.url = url;
  if (data instanceof FormData) {
    options.data = data;
  } else {
    options.data = cloneData;
  }
  options.baseURL = baseURL;
  options.cancelToken = new CancelToken((cancel) => {
    // @ts-ignore
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  return axios(options)
    .then((response) => {
      const { statusText, status, data } = response;

      let result = {};
      if (typeof data === 'object') {
        result = data;
        if (Array.isArray(data)) {
          // @ts-ignore
          result.list = data;
        }
      } else {
        // @ts-ignore
        result.data = data;
      }

      const res = {
        success: true,
        message: statusText,
        statusCode: status,
        data: result,
      };

      return Promise.resolve(res);
    })
    .catch((error: AxiosError) => {
      const { response, message } = error;

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return Promise.reject({
          success: false,
        });
      }

      let msg;
      let statusCode;

      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;

        msg = data.message || codeMessage[data.code] || statusText;
      } else {
        statusCode = 600;
        msg = error.message || 'Network Error';
      }
      if (statusCode === 401 || statusCode === 403) {
        // @ts-ignore
        window.g_app._store.dispatch({
          type: 'app/sessionTimeout',
        });
      }

      if (statusCode === 403) {
        // router.push("/403");
      }
      if (statusCode <= 504 && statusCode >= 500) {
        // router.push("/500");
      }
      if (statusCode >= 404 && statusCode < 422) {
        // router.push("/404");
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      });
    });
};

axios.interceptors.request.use(
  function (config) {
    const token = store.get('token');

    if (config.headers.isAuthorized && typeof token === 'string' && token !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    delete config.headers['isAuthorized'];
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);
export default request;
