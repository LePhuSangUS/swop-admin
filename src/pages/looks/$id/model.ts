import modelExtend from 'dva-model-extend';
import store from 'store';
import api from 'services/api';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  ILook,
  IConnectState,
  ILookDress,
} from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface ILookDetailsModelState {
  look: ILook;
  currentLookDress: ILookDress;
  modalLookDressType: 'add' | 'update';
  modalLookDressVisible: boolean;
  modalFilterLookVisible: boolean;
  lookDresses: {
    list: ILookDress[];
    pagination: IPaginationParam;
  };
  filter: {};
}

export interface ICollectionDetailsModelType extends IModel<ILookDetailsModelState> {
  effects: {
    getLook: IEffect;
    getLookDressList: IEffect;
    addLookDress: IEffect;
    updateLookDress: IEffect;
    removeLookDress: IEffect;
  };
  reducers: {
    showModalLookDress: IReducer<ILookDetailsModelState>;
    hideModalLookDress: IReducer<ILookDetailsModelState>;
    showModalFilterLookDress: IReducer<ILookDetailsModelState>;
    hideModalFilterLookDress: IReducer<ILookDetailsModelState>;
    clearFilterLookDress: IReducer<ILookDetailsModelState>;
    addLookDressSuccess: IReducer<ILookDetailsModelState>;
    updateLookDressSuccess: IReducer<ILookDetailsModelState>;
    removeLookDressSuccess: IReducer<ILookDetailsModelState>;
  };
}

const filterKey = 'lookDetails_look_filter';

export const namespace = 'lookDetails';

const _Model: ICollectionDetailsModelType = {
  namespace: namespace,

  state: {
    look: null,
    modalLookDressVisible: false,
    modalLookDressType: 'add',
    modalFilterLookVisible: false,
    currentLookDress: null,
    filter: {},
    lookDresses: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSize,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/looks/:id', pathname);
        if (match) {
          dispatch({
            type: 'getLook',
            payload: {
              id: match[1],
            },
          });

          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getLookDressList',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              look_id: match[1],
              filter: defaultFilter,
            },
          });
        }
      });
    },
  },

  effects: {
    *getLook({ payload }, { call, put }) {
      const response = yield call(api.getLook, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            look: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getLookDressList({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.lookDetails);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListLookDress, params);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            lookDresses: {
              list: data.records,
              pagination,
            },
            filter,
          },
        });
      }
    },
    *addLookDress({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { success, data } = yield call(api.createLookDress, query);
      if (success && data) {
        yield put({
          type: 'addLookDressSuccess',
          payload: data,
        });
      }
    },
    *removeLookDress({ payload }, { call, put }) {
      const { data, success } = yield call(api.deleteLookDress, payload);
      if (data && success) {
        yield put({ type: 'removeLookDressSuccess', payload: payload });
      } else {
        throw data;
      }
    },

    *updateLookDress({ payload }, { select, call, all, put }) {
      const { data, success } = yield call(api.updateLookDress, payload);
      if (data && success) {
        yield put({ type: 'updateLookDressSuccess', payload: data });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    showModalLookDress(state, { payload }) {
      return { ...state, ...payload, modalLookDressVisible: true };
    },
    hideModalLookDress(state) {
      return { ...state, modalLookDressVisible: false };
    },
    showModalFilterLookDress(state, { payload }) {
      return { ...state, ...payload, modalFilterLookVisible: true };
    },
    hideModalFilterLookDress(state) {
      return { ...state, modalFilterLookVisible: false };
    },
    clearFilterLookDress(state, { payload }) {
      state.filter = {};
      return state;
    },
    addLookDressSuccess(state, { payload }) {
      state.lookDresses.list = [payload, ...(state.lookDresses.list || [])];
      state.look = null;
      state.modalLookDressVisible = false;
      return state;
    },
    updateLookDressSuccess(state, { payload }) {
      const index = state.lookDresses.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.lookDresses.list[index] = payload;
      }
      state.modalLookDressVisible = false;
      return state;
    },
    removeLookDressSuccess(state, { payload }) {
      state.lookDresses.list = state.lookDresses.list?.filter((item) => item.id !== payload.id);

      state.modalLookDressVisible = false;
      state.lookDresses.pagination.total = state.lookDresses.pagination.total - 1;
      return state;
    },
  },
};

const Model: ICollectionDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
