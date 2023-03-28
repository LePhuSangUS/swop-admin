import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { IEffect, IModel, IReducer, IPaginationParam, IDelivery } from 'types';
import { ISwop, ILaundry, ILaundryPrice } from 'types';
import { getPagination, pathMatchRegexp } from 'utils';
import { getSwopForDelivery } from 'utils/mapping';
import { updateModel } from 'utils/models';

export interface ILaundryDetailsModelState {
  laundry: ILaundry;
  modalLaundryPriceVisible: boolean;
  modalAssignDeliveryVisible: boolean;
  modalUpdateDeliveryVisible: boolean;
  currentLaundryPrice: ILaundryPrice;
  currentDelivery: ISwop;
  swops: {
    list: ISwop[];
    pagination: IPaginationParam;
  };
  deliveries: {
    list: IDelivery[];
    pagination: IPaginationParam;
  };
}

export interface ILaundryDetailsModelType extends IModel<ILaundryDetailsModelState> {
  effects: {
    getLaundry: IEffect;
    getListDelivery: IEffect;
    getSwopAssignedToLaundry: IEffect;
    updateLaundryPrice: IEffect;
    assignDelivery: IEffect;
    updateDelivery: IEffect;
  };
  reducers: {
    showModalLaundryPrice: IReducer<ILaundryDetailsModelState>;
    hideModalLaundryPrice: IReducer<ILaundryDetailsModelState>;

    updateLaundryPriceSuccess: IReducer<ILaundryDetailsModelState>;
    assignDeliverySuccess: IReducer<ILaundryDetailsModelState>;
    updateDeliverySuccess: IReducer<ILaundryDetailsModelState>;

    showModalAssignDelivery: IReducer<ILaundryDetailsModelState>;
    hideModalAssignDelivery: IReducer<ILaundryDetailsModelState>;

    showModalUpdateDelivery: IReducer<ILaundryDetailsModelState>;
    hideModalUpdateDelivery: IReducer<ILaundryDetailsModelState>;
  };
}

export const namespace = 'laundryDetails';

const _Model: ILaundryDetailsModelType = {
  namespace: namespace,

  state: {
    laundry: null,
    currentLaundryPrice: null,
    currentDelivery: null,
    modalLaundryPriceVisible: false,
    modalAssignDeliveryVisible: false,
    modalUpdateDeliveryVisible: false,
    swops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: 5,
      },
    },
    deliveries: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: 5,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/laundries/:id', pathname);
        if (match) {
          dispatch({
            type: 'getLaundry',
            payload: {
              id: match[1],
            },
          });
          dispatch({
            type: 'getListDelivery',
            payload: {
              laundry_id: match[1],
            },
          });

          dispatch({
            type: 'getSwopAssignedToLaundry',
            payload: {
              id: match[1],
              page: 1,
              limit: 5,
            },
          });
        }
      });
    },
  },

  effects: {
    *getListDelivery({ payload }, { call, put }) {
      const response = yield call(api.getListDelivery, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        let newRecords = [...data.records];

        newRecords = newRecords.map((item) => {
          return getSwopForDelivery(item);
        });

        yield put({
          type: 'updateState',
          payload: {
            deliveries: {
              list: newRecords,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getLaundry({ payload }, { call, put }) {
      const response = yield call(api.getLaundry, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            laundry: data,
          },
        });
      } else {
        throw data;
      }
    },
    *updateLaundryPrice({ payload }, { call, put }) {
      const response = yield call(api.updateLaundryPrice, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateLaundryPriceSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *getSwopAssignedToLaundry({ payload }, { call, put }) {
      const response = yield call(api.getSwopAssignedToLaundry, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swops: {
              list: data.records,
              pagination: getPagination(data),
            },
          },
        });
      } else {
        throw data;
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
    showModalLaundryPrice(state, { payload }) {
      return { ...state, ...payload, modalLaundryPriceVisible: true };
    },
    hideModalLaundryPrice(state) {
      return { ...state, currentLaundryPrice: null, modalLaundryPriceVisible: false };
    },
    updateLaundryPriceSuccess(state, { payload }) {
      const index = state.laundry?.prices.findIndex(
        (item) => item.cloth_category === payload.cloth_category,
      );
      if (index !== -1) {
        state.laundry.prices[index] = payload;
      }
      state.modalLaundryPriceVisible = false;
      state.currentLaundryPrice = null;
      return state;
    },
    assignDeliverySuccess(state, { payload }) {
      state.deliveries.list = state.deliveries.list.filter((item) => item.id !== payload.id);
      state.modalAssignDeliveryVisible = false;
      return state;
    },
    showModalAssignDelivery(state, { payload }) {
      return { ...state, ...payload, modalAssignDeliveryVisible: true };
    },

    hideModalAssignDelivery(state) {
      return { ...state, modalAssignDeliveryVisible: false, currentDelivery: null };
    },
    showModalUpdateDelivery(state, { payload }) {
      return { ...state, ...payload, modalUpdateDeliveryVisible: true };
    },

    hideModalUpdateDelivery(state) {
      return { ...state, modalUpdateDeliveryVisible: false, currentDelivery: null };
    },

    updateDeliverySuccess(state, { payload }) {
      const index = state?.deliveries.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.deliveries.list[index] = payload;
      }
      state.modalUpdateDeliveryVisible = false;
      return state;
    },
  },
};

const Model: ILaundryDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
