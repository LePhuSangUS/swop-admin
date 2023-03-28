import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { IEffect, IModel, IPaginationParam, ITransaction } from 'types';
import { ISwop, ISwopTracking } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface ISwopDetailModelState {
  swop: ISwop;
  swopTrackings: ISwopTracking[];
  transactions: {
    list: ITransaction[];
    pagination?: IPaginationParam;
  };
}

export const namespace = 'swopDetails';
export interface ISwopDetailModelType extends IModel<ISwopDetailModelState> {
  effects: {
    getSwop: IEffect;
    getSwopTracking: IEffect;
    getTransactions: IEffect;
  };
}

const _Model: ISwopDetailModelType = {
  namespace: namespace,
  state: {
    swop: null,
    swopTrackings: null,
    transactions: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/swops/:id', pathname);

        if (match) {
          dispatch({
            type: 'getSwop',
            payload: {
              id: match[1],
            },
          });
          dispatch({
            type: 'getSwopTracking',
            payload: {
              id: match[1],
            },
          });
          dispatch({
            type: 'getTransactions',
            payload: {
              swop_id: match[1],
              page: 1,
              limit: config.defaultPageSize,
            },
          });
        }
      });
    },
  },

  effects: {
    *getSwop({ payload }, { call, put }) {
      const response = yield call(api.getSwop, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swop: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getTransactions({ payload }, { call, put }) {
      const response = yield call(api.listTransaction, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            transactions: {
              list: data?.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getSwopTracking({ payload }, { call, put }) {
      const response = yield call(api.getSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swopTrackings: data?.records,
          },
        });
      } else {
        throw data;
      }
    },
  },
};

const Model: ISwopDetailModelType = modelExtend(updateModel, _Model);
export default Model;
