import modelExtend from 'dva-model-extend';
import { IEffect, IModel, IReducer, IPaginationParam, ILaundryStats } from 'types';
import { ILaundry } from 'types';
import { getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface ILaundryModelState {
  currentItem: ILaundry;
  list: ILaundry[];
  pagination: IPaginationParam;
  modalVisible: boolean;
  modalActivateVisible: boolean;
  modalType: 'create' | 'update';
  laundryStats: ILaundryStats;
}

export const namespace = 'laundries';

export interface ILaundryModelType extends IModel<ILaundryModelState> {
  namespace: string;
  effects: {
    getListLaundry: IEffect;
    getLaundryStats: IEffect;
    deleteLaundry: IEffect;
    createLaundry: IEffect;
    updateLaundry: IEffect;
    activateLaundry: IEffect;
  };
  reducers: {
    deleteLaundrySuccess: IReducer<ILaundryModelState>;
    createLaundrySuccess: IReducer<ILaundryModelState>;
    updateLaundrySuccess: IReducer<ILaundryModelState>;
    activateLaundrySuccess: IReducer<ILaundryModelState>;

    showModal: IReducer<ILaundryModelState>;
    hideModal: IReducer<ILaundryModelState>;

    showModalActivateLaundry: IReducer<ILaundryModelState>;
    hideModalActivateLaundry: IReducer<ILaundryModelState>;
  };
}

const _LaundryModel: ILaundryModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    modalVisible: false,
    modalActivateVisible: false,
    modalType: 'create',
    list: [],
    laundryStats: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/laundries', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          dispatch({
            type: 'getListLaundry',
            payload: {
              page: 1,
              limit: 10,
              ...payload,
            },
          });
          dispatch({
            type: 'getLaundryStats',
          });
        }
      });
    },
  },

  effects: {
    *activateLaundry({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.activateLaundry, payload);

      if (success && data) {
        yield put({
          type: 'activateLaundrySuccess',
          payload: data,
        });
      }
    },
    *getLaundryStats({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getLaundryStats, payload);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            laundryStats: data,
          },
        });
      }
    },
    *getListLaundry({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListLaundry, payload);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
          },
        });
      }
    },
    *deleteLaundry({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.removeLaundry, { id: payload });

      if (success && data) {
        yield put({
          type: 'deleteLaundrySuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *createLaundry({ payload }, { call, put }) {
      const { data, success } = yield call(api.createLaundry, payload);
      if (success) {
        yield put({ type: 'createLaundrySuccess', payload: data });
      } else {
        throw data;
      }
    },

    *updateLaundry({ payload }, { select, call, put }) {
      const { data, success } = yield call(api.updateLaundry, payload);
      if (data && success) {
        yield put({ type: 'updateLaundrySuccess', payload: data });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    deleteLaundrySuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].deleted_at = payload.deleted_at;
        state.list[index].phone = '';
        state.list[index].name = '';
        if (state.list[index].manager) {
          state.list[index].manager.phone = '';
        }
        if (state.list[index].relationship_manager) {
          state.list[index].relationship_manager.phone = '';
        }
      }
      state.modalActivateVisible = false;
      return state;
    },
    createLaundrySuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      } else {
        state.list.push(payload);
      }
      state.modalVisible = false;
      return state;
    },
    updateLaundrySuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
    activateLaundrySuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalActivateVisible = false;
      return state;
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },

    showModalActivateLaundry(state, { payload }) {
      return { ...state, ...payload, modalActivateVisible: true };
    },
    hideModalActivateLaundry(state) {
      return { ...state, modalActivateVisible: false };
    },
  },
};

const LaundryModel: ILaundryModelType = modelExtend(updateModel, _LaundryModel);
export default LaundryModel;
