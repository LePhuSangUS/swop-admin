import store from 'store';
import { router } from 'umi';
import { IEffect, IModel } from 'types';
import { parseFromUrl, pathMatchRegexp } from 'utils';
import { setDefaultTimezone } from 'utils/date';
import api from 'services/api';

export interface ILoginModelState {}
export interface ILoginModelType extends IModel<ILoginModelState> {
  effects: { login: IEffect };
}

const Model: ILoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const { success, data } = yield call(api.login, payload);
      if (success && data) {
        store.set('token', data.token);
        store.set('user', data.user);

        setDefaultTimezone();

        var value = parseFromUrl(location?.search);
        var from = value?.from || '';
        // @ts-ignore
        if (!pathMatchRegexp('/', from) && !pathMatchRegexp('/login', from)) {
          // @ts-ignore
          router.push(from);
          return;
        }

        router.push('/dashboard');
      } else {
        throw data;
      }
    },
  },
};

export default Model;
