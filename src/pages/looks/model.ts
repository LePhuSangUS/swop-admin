import modelExtend from 'dva-model-extend';
import store from 'store';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  IConnectState,
  IRemovalAIResponse,
} from 'types';
import { ILook } from 'types';
import { config, dataURIToBlob, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';
import { uploadS3Image } from 'services/s3';
import { removeImageBackground } from 'services/removal';

export interface ILookModelState {
  currentItem: ILook;
  filter: {};
  list: ILook[];
  pagination: IPaginationParam;
  modalFilterVisible: boolean;
  modalAddLookDressVisible: boolean;
  modalVisible: boolean;
  modalType: 'create' | 'update';
}

const filterKey = 'looks_filter';

export const namespace = 'looks';

export interface ILookModelType extends IModel<ILookModelState> {
  namespace: string;
  effects: {
    getListLook: IEffect;
    filterLook: IEffect;
    createLook: IEffect;
    updateLook: IEffect;
    removeLook: IEffect;
    addLook: IEffect;
    addLookDress: IEffect;
  };
  reducers: {
    clearFilter: IReducer<ILookModelState>;
    createLookSuccess: IReducer<ILookModelState>;
    updateLookSuccess: IReducer<ILookModelState>;
    removeLookSuccess: IReducer<ILookModelState>;

    showModal: IReducer<ILookModelState>;
    hideModal: IReducer<ILookModelState>;

    showModalUnArchive: IReducer<ILookModelState>;
    hideModalUnArchive: IReducer<ILookModelState>;

    showModalFilter: IReducer<ILookModelState>;
    hideModalFilter: IReducer<ILookModelState>;

    showModalAddLookDress: IReducer<ILookModelState>;
    hideModalAddLookDress: IReducer<ILookModelState>;

    showModalLook: IReducer<ILookModelState>;
    hideModalLook: IReducer<ILookModelState>;

    addLookDressSuccess: IReducer<ILookModelState>;
  };
}

const _LooksModel: ILookModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    filter: {},
    modalVisible: false,
    modalFilterVisible: false,
    modalAddLookDressVisible: false,
    modalType: 'create',
    list: [],
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
        if (pathMatchRegexp('/looks', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListLook',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
        }
      });
    },
  },

  effects: {
    *addLook({ payload }, { call, put }) {
      const { imageFile } = payload;
      if (imageFile?.uid) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: `looks`,
        });
        if (success) {
          const formData = new FormData();
          formData.append('image_file', imageFile);

          const { success, data: resp } = yield call(removeImageBackground, formData);
          if (success) {
            const removalData = resp as IRemovalAIResponse;
            const formData = new FormData();
            const { url, key, ...other } = data;

            Object.keys(other).forEach((k) => formData.append(k, other[k]));

            const file = dataURIToBlob(`data:image/jpeg;base64,${removalData.base64}`);

            formData.append('key', key);
            formData.append('file', file);

            const { success } = yield call(uploadS3Image, url, formData);
            if (success) {
              payload.photo = `${url}/${key}`;
            }
          }
        }
      } else {
        if (typeof imageFile === 'string' && imageFile !== '') {
          payload.photo = imageFile;
        }
      }

      const { data, success } = yield call(api.createLook, payload);
      if (data && success) {
        yield put({ type: 'addLookSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *addLookDress({ payload }, { call, put }) {
      const { data, success } = yield call(api.createLookDress, payload);
      if (data && success) {
        yield put({ type: 'addLookDressSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *getListLook({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.looks);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListLook, params);
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
    *filterLook({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListLook, payload);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
            filter: payload,
            modalFilterVisible: false,
          },
        });
      }
    },

    *createLook({ payload }, { call, put }) {
      const { collection_name, imageFile } = payload;
      if (imageFile?.uid) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: `looks`,
        });
        if (success) {
          const formData = new FormData();
          formData.append('image_file', imageFile);

          const { success, data: resp } = yield call(removeImageBackground, formData);
          if (success) {
            const removalData = resp as IRemovalAIResponse;
            const formData = new FormData();
            const { url, key, ...other } = data;

            Object.keys(other).forEach((k) => formData.append(k, other[k]));

            const file = dataURIToBlob(`data:image/jpeg;base64,${removalData.base64}`);

            formData.append('key', key);
            formData.append('file', file);

            const { success } = yield call(uploadS3Image, url, formData);
            if (success) {
              payload.photo = `${url}/${key}`;
            }
          }
        }
      } else {
        if (typeof imageFile === 'string' && imageFile !== '') {
          payload.photo = imageFile;
        }
      }

      const { data, success } = yield call(api.createLook, payload);
      if (data && success) {
        yield put({ type: 'createLookSuccess', payload: data });
      } else {
        throw data;
      }
    },

    *updateLook({ payload }, { select, call, all, put }) {
      const { collection_name, imageFile } = payload;
      if (imageFile?.uid) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: `looks`,
        });
        if (success) {
          const formData = new FormData();
          formData.append('image_file', imageFile);

          const { success, data: resp } = yield call(removeImageBackground, formData);
          if (success) {
            const removalData = resp as IRemovalAIResponse;
            const formData = new FormData();
            const { url, key, ...other } = data;

            Object.keys(other).forEach((k) => formData.append(k, other[k]));

            const file = dataURIToBlob(`data:image/jpeg;base64,${removalData.base64}`);

            formData.append('key', key);
            formData.append('file', file);

            const { success } = yield call(uploadS3Image, url, formData);
            if (success) {
              payload.photo = `${url}/${key}`;
            }
          }
        }
      } else {
        if (typeof imageFile === 'string' && imageFile !== '') {
          payload.photo = imageFile;
        }
      }
      const { data, success } = yield call(api.updateLook, payload);
      if (data && success) {
        yield put({ type: 'updateLookSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *removeLook({ payload }, { select, call, all, put }) {
      const { data, success } = yield call(api.deleteLook, payload);
      if (data && success) {
        yield put({ type: 'removeLookSuccess', payload });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    addLookDressSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.look_id);
      if (index !== -1) {
        state.list[index].dresses.push(payload);
      }
      state.modalAddLookDressVisible = false;
      return state;
    },
    clearFilter(state, { payload }) {
      state.filter = {};
      return state;
    },
    createLookSuccess(state, { payload }) {
      state.list = [payload, ...(state.list || [])];
      state.currentItem = null;
      state.modalVisible = false;
      return state;
    },
    updateLookSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
    removeLookSuccess(state, { payload }) {
      state.list = state.list?.filter((item) => item.id !== payload.id);

      state.modalVisible = false;
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
    showModalAddLookDress(state, { payload }) {
      return { ...state, ...payload, modalAddLookDressVisible: true };
    },
    hideModalAddLookDress(state) {
      return { ...state, modalAddLookDressVisible: false };
    },
    showModalLook(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModalLook(state) {
      return { ...state, modalVisible: false };
    },
  },
};

const CollectionModel: ILookModelType = modelExtend(updateModel, _LooksModel);
export default CollectionModel;
