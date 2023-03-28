import modelExtend from 'dva-model-extend';
import moment from 'moment';
import api from 'services/api';
import store from 'store';
import { IConnectState, IEffect, IModel, IPaginationParam, IReducer, ISwopStats } from 'types';
import { ISwop } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface ISwopModelState {
  currentItem: ISwop;
  modalVisible: boolean;
  modalFilterVisible: boolean;
  list: ISwop[];
  pagination?: IPaginationParam;
  filter: {};
  swopStats: ISwopStats;
}

const filterKey = 'swops_filter';

export const namespace = 'swops';
export interface IOrderModelType extends IModel<ISwopModelState> {
  namespace: string;
  effects: {
    getListSwop: IEffect;
    getSwopStats: IEffect;
    filterSwop: IEffect;
    updateSwop: IEffect;
    deleteSwop: IEffect;
  };
  reducers: {
    showModal: IReducer<ISwopModelState>;
    hideModal: IReducer<ISwopModelState>;

    showModalFilter: IReducer<ISwopModelState>;
    hideModalFilter: IReducer<ISwopModelState>;

    updateSwopSuccess: IReducer<ISwopModelState>;
    deleteSwopSuccess: IReducer<ISwopModelState>;
  };
}

const _SwopModel: IOrderModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    modalVisible: false,
    modalFilterVisible: false,
    list: [],
    filter: {},
    swopStats: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: config.defaultPageSizeSmall,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/swops', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListSwop',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
          dispatch({
            type: 'getSwopStats',
          });
        }
      });
    },
  },

  effects: {
    *getSwopStats({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getSwopStatusStats);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            swopStats: data,
          },
        });
      }
    },
    *getListSwop({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.swops);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListSwop, params);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
            filter,
          },
        });
      }
    },
    *filterSwop({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { success, data } = yield call(api.getListSwop, query);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
            filter: isClear ? {} : payload,
            modalFilterVisible: false,
          },
        });
      }
    },
    *updateSwop({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.updateSwop, payload);
      if (success && data) {
        yield put({
          type: 'updateSwopSuccess',
          payload: data,
        });
      }
    },
    *deleteSwop({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.deleteSwop, payload);
      if (success && data) {
        yield put({
          type: 'deleteSwopSuccess',
          payload: payload,
        });
      }
    },
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    showModalFilter(state, { payload }) {
      return { ...state, ...payload, modalFilterVisible: true };
    },

    hideModalFilter(state) {
      return { ...state, modalFilterVisible: false };
    },

    updateSwopSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload?.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },

    deleteSwopSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload?.id);
      if (index !== -1) {
        state.list[index].deleted_at = payload.deleted_at || moment().unix();
      }
      return state;
    },
  },
};

const SwopModel: IOrderModelType = modelExtend(updateModel, _SwopModel);
export default SwopModel;
