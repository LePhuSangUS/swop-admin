import modelExtend from 'dva-model-extend';
import store from 'store';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  IConnectState,
  IDeliveryStats,
  ISwop,
} from 'types';
import { IDelivery } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';
import { getSwopForDelivery } from 'utils/mapping';

export interface IDeliveryModelState {
  currentItem: IDelivery;
  list: IDelivery[];
  filter: {};
  pagination: IPaginationParam;
  modalAssignDeliveryVisible: boolean;
  modalUpdateDeliveryVisible: boolean;
  modalFilterVisible: boolean;
  deliveryStats: IDeliveryStats;
}

const filterKey = 'deliveries_filter';
export interface IDeliveryModelType extends IModel<IDeliveryModelState> {
  namespace: string;
  effects: {
    getListDelivery: IEffect;
    getDeliveryStats: IEffect;
    filterDelivery: IEffect;
    assignDelivery: IEffect;
    updateDelivery: IEffect;
  };
  reducers: {
    showModalFilter: IReducer<IDeliveryModelState>;
    hideModalFilter: IReducer<IDeliveryModelState>;
    clearFilter: IReducer<IDeliveryModelState>;

    showModalAssignDelivery: IReducer<IDeliveryModelState>;
    hideModalAssignDelivery: IReducer<IDeliveryModelState>;

    showModalUpdateDelivery: IReducer<IDeliveryModelState>;
    hideModalUpdateDelivery: IReducer<IDeliveryModelState>;

    assignDeliverySuccess: IReducer<IDeliveryModelState>;
    updateDeliverySuccess: IReducer<IDeliveryModelState>;
  };
}

export const namespace = 'deliveries';

const _UserModel: IDeliveryModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    modalFilterVisible: false,
    modalAssignDeliveryVisible: false,
    modalUpdateDeliveryVisible: false,
    list: [],
    filter: {},
    deliveryStats: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: config.defaultPageSize,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/deliveries', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListDelivery',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
          dispatch({
            type: 'getDeliveryStats',
          });
        }
      });
    },
  },

  effects: {
    *getDeliveryStats({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getDeliveryStats);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            deliveryStats: data,
          },
        });
      }
    },
    *getListDelivery({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.deliveries);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListDelivery, params);
      const pagination = getPagination(data);
      if (success && data) {
        let newRecords = [...data.records];

        newRecords = data.records.map((item: ISwop) => {
          return getSwopForDelivery(item);
        });

        yield put({
          type: 'updateState',
          payload: {
            list: newRecords,
            deliveries: {
              list: newRecords,
              pagination,
            },
          },
        });
      }
    },
    *filterDelivery({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { delivery_date_moment, ...others } = query;
      const { success, data } = yield call(api.getListDelivery, others);
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
    *assignDelivery({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.assignDelivery, payload);
      if (success && data) {
        yield put({
          type: 'assignDeliverySuccess',
          payload: data,
        });
      }
    },
    *updateDelivery({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.updateDelivery, payload);
      if (success && data) {
        yield put({
          type: 'updateDeliverySuccess',
          payload: data,
        });
      }
    },
  },

  reducers: {
    clearFilter(state, { payload }) {
      state.filter = {};
      return state;
    },
    showModalFilter(state, { payload }) {
      return { ...state, ...payload, modalFilterVisible: true };
    },
    hideModalFilter(state) {
      return { ...state, modalFilterVisible: false };
    },

    showModalAssignDelivery(state, { payload }) {
      return { ...state, ...payload, modalAssignDeliveryVisible: true };
    },

    hideModalAssignDelivery(state) {
      return { ...state, modalAssignDeliveryVisible: false };
    },

    showModalUpdateDelivery(state, { payload }) {
      return { ...state, ...payload, modalUpdateDeliveryVisible: true };
    },

    hideModalUpdateDelivery(state) {
      return { ...state, modalUpdateDeliveryVisible: false };
    },

    assignDeliverySuccess(state, { payload }) {
      state.list = state.list.filter((item) => item.id !== payload.id);
      state.modalAssignDeliveryVisible = false;
      return state;
    },
    updateDeliverySuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalUpdateDeliveryVisible = false;
      return state;
    },
  },
};

const UserModel: IDeliveryModelType = modelExtend(updateModel, _UserModel);
export default UserModel;
