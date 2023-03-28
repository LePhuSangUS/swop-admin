import modelExtend from 'dva-model-extend';
import moment from 'moment';
import store from 'store';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  IConnectState,
  IDressStats,
  IRemovalAIResponse,
} from 'types';
import { IDress } from 'types';
import { config, dataURIToBlob, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import { removeImageBackground } from 'services/removal';
import api from 'services/api';
import { uploadS3Image } from 'services/s3';

export interface IDressModelState {
  currentItem: IDress;
  filter: {};
  list: IDress[];
  pagination: IPaginationParam;
  modalFilterVisible: boolean;
  modalVisible: boolean;
  dressStats: IDressStats;
  modalType: 'create' | 'update';
}

const filterKey = 'dress_filter';

export const namespace = 'dresses';

export interface IDressModelType extends IModel<IDressModelState> {
  namespace: string;
  effects: {
    getListDress: IEffect;
    getDressStats: IEffect;
    filterDress: IEffect;
    archiveDress: IEffect;
    unArchiveDress: IEffect;
    createDress: IEffect;
    updateDress: IEffect;
    activateDress: IEffect;
    deactivateDress: IEffect;
  };
  reducers: {
    clearFilter: IReducer<IDressModelState>;
    archiveDressSuccess: IReducer<IDressModelState>;
    createDressSuccess: IReducer<IDressModelState>;
    updateDressSuccess: IReducer<IDressModelState>;
    unArchiveDressSuccess: IReducer<IDressModelState>;
    activateDressSuccess: IReducer<IDressModelState>;
    deactivateDressSuccess: IReducer<IDressModelState>;

    showModal: IReducer<IDressModelState>;
    hideModal: IReducer<IDressModelState>;

    showModalUnArchive: IReducer<IDressModelState>;
    hideModalUnArchive: IReducer<IDressModelState>;

    showModalFilter: IReducer<IDressModelState>;
    hideModalFilter: IReducer<IDressModelState>;
  };
}

const _DressModel: IDressModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    filter: {},
    modalVisible: false,
    modalFilterVisible: false,
    modalType: 'create',
    list: [],
    dressStats: null,
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
        if (pathMatchRegexp('/dresses', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListDress',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
          dispatch({
            type: 'getDressStats',
          });
        }
      });
    },
  },

  effects: {
    *getDressStats({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.dresses);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getDressStats, params);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            dressStats: data,
          },
        });
      }
    },
    *getListDress({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.dresses);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListDress, params);
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
    *filterDress({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { success, data } = yield call(api.getListDress, query);
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
    *activateDress({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.activateDress, payload);

      if (success && data) {
        yield put({
          type: 'activateDressSuccess',
          payload: payload,
        });
      } else {
        throw data;
      }
    },
    *deactivateDress({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.deactivateDress, payload);

      if (success && data) {
        yield put({
          type: 'deactivateDressSuccess',
          payload: payload,
        });
      } else {
        throw data;
      }
    },
    *archiveDress({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.archiveDress, payload);

      if (success && data) {
        yield put({
          type: 'archiveDressSuccess',
          payload: payload,
        });
      } else {
        throw data;
      }
    },
    *unArchiveDress({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.unArchiveDress, payload);

      if (success && data) {
        yield put({
          type: 'unArchiveDressSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *createDress({ payload }, { call, put }) {},

    *updateDress({ payload }, { select, call, all, put }) {
      const { fileList } = payload;

      if (Array.isArray(fileList) && fileList.length) {
        const { currentItem } = yield select((state: IConnectState) => state.dresses);
        let canUpload = false;
        const uploadImages = new FormData();
        fileList.forEach((item) => {
          if (typeof item?.url === 'string' && item?.url !== '') {
            const thumbnail = (currentItem as IDress).thumbnails?.find(
              (it) => it.split('/')?.pop() === item?.url.split('/')?.pop(),
            );

            if (typeof thumbnail === 'string' && thumbnail !== '') {
              payload.photos = [...(payload.photos || []), item?.url];
              payload.thumbnails = [...(payload.thumbnails || []), thumbnail];
            }
          } else {
            uploadImages.append('files', item.originFileObj);
            canUpload = true;
          }
        });

        if (canUpload) {
          const { data, success } = yield call(api.uploadDressPhotos, uploadImages, null, {
            'Content-Type': `multipart/form-data`,
          });

          if (data && success) {
            data?.records?.forEach((item: any) => {
              payload.photos = [...(payload.photos || []), item.photo];

              payload.thumbnails = [...(payload.thumbnails || []), item.thumbnail];
            });
          }
        }
      }
      const { data, success } = yield call(api.updateDress, payload);
      if (data && success) {
        yield put({ type: 'updateDressSuccess', payload: data });
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
    archiveDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].deleted_at = moment().unix();
      }
      return state;
    },
    createDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      } else {
        state.list.push(payload);
      }
      return state;
    },
    updateDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
    unArchiveDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].deleted_at = null;
      }
      return state;
    },
    activateDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].is_inactive = false;
      }
      return state;
    },
    deactivateDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].is_inactive = true;
      }
      return state;
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },

    showModalUnArchive(state, { payload }) {
      return { ...state, ...payload, modalActivateVisible: true };
    },
    hideModalUnArchive(state) {
      return { ...state, modalActivateVisible: false };
    },

    showModalFilter(state, { payload }) {
      return { ...state, ...payload, modalFilterVisible: true };
    },
    hideModalFilter(state) {
      return { ...state, modalFilterVisible: false };
    },
  },
};

const DressModel: IDressModelType = modelExtend(updateModel, _DressModel);
export default DressModel;
