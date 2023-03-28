import modelExtend from 'dva-model-extend';
import store from 'store';
import { IEffect, IModel, IReducer, IPaginationParam, IConnectState, IMatchingStats } from 'types';
import { IMatching } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface IMatchingModelState {
  currentItem: IMatching;
  list: IMatching[];
  filter: {};
  pagination: IPaginationParam;
  modalVisible: boolean;
  modalFilterVisible: boolean;
  matchingStats: IMatchingStats;
}

export interface IMatchingModelType extends IModel<IMatchingModelState> {
  namespace: string;
  effects: {
    getListMatching: IEffect;
    getMatchingStats: IEffect;
    filterMatching: IEffect;
    updateMatching: IEffect;
  };
  reducers: {
    clearFilter: IReducer<IMatchingModelState>;

    showModal: IReducer<IMatchingModelState>;
    hideModal: IReducer<IMatchingModelState>;

    showModalFilter: IReducer<IMatchingModelState>;
    hideModalFilter: IReducer<IMatchingModelState>;

    updateMatchingSuccess: IReducer<IMatchingModelState>;
  };
}

const filterKey = 'matching_filter';

export const namespace = 'matchings';

const _UserModel: IMatchingModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    modalVisible: false,
    modalFilterVisible: false,
    list: [],
    filter: {},
    matchingStats: null,
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
        if (pathMatchRegexp('/matchings', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListMatching',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
          dispatch({
            type: 'getMatchingStats',
          });
        }
      });
    },
  },

  effects: {
    *getMatchingStats({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getMatchingStatusStats);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            matchingStats: data,
          },
        });
      }
    },
    *getListMatching({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.matchings);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListMatching, params);
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
    *filterMatching({ payload = {} }, { call, put }) {
      const { isClear, ...query } = payload;
      const { success, data } = yield call(api.getListMatching, query);
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
    *updateMatching({ payload }, { select, call, put }) {
      const { data, success } = yield call(api.updateMatching, payload);
      if (data && success) {
        yield put({
          type: 'updateMatchingSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    clearFilter(state, { payload }) {
      state.filter = {};
      return state;
    },
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
    updateMatchingSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
  },
};

const UserModel: IMatchingModelType = modelExtend(updateModel, _UserModel);
export default UserModel;
