import modelExtend from 'dva-model-extend';
import store from 'store';
import api from 'services/api';
import {
  IEffect,
  IModel,
  IReducer,
  ICollection,
  ILook,
  IConnectState,
  IPaginationParam,
  ILookDress,
  IRemovalAIResponse,
} from 'types';
import { config, dataURIToBlob, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import { removeImageBackground } from 'services/removal';
import { uploadS3Image } from 'services/s3';

export interface ICollectionDetailsModelState {
  collection: ICollection;
  currentLook: ILook;
  currentLookDress: ILookDress;
  modalLookType: 'add' | 'update';
  modalLookVisible: boolean;
  modalLookDressType: 'add' | 'update';
  modalLookDressVisible: boolean;
  modalFilterLookVisible: boolean;
  looks: {
    list: ILook[];
    pagination: IPaginationParam;
  };
  filter: {};
}

export interface ICollectionDetailsModelType extends IModel<ICollectionDetailsModelState> {
  effects: {
    getCollection: IEffect;
    getListLook: IEffect;
    filterLook: IEffect;
    addLook: IEffect;
    updateLook: IEffect;
    removeLook: IEffect;
    addLookDress: IEffect;
    updateLookDress: IEffect;
    removeLookDress: IEffect;
  };
  reducers: {
    showModalLook: IReducer<ICollectionDetailsModelState>;
    hideModalLook: IReducer<ICollectionDetailsModelState>;
    showModalLookDress: IReducer<ICollectionDetailsModelState>;
    hideModalLookDress: IReducer<ICollectionDetailsModelState>;
    showModalFilterLook: IReducer<ICollectionDetailsModelState>;
    hideModalFilterLook: IReducer<ICollectionDetailsModelState>;
    clearFilterLook: IReducer<ICollectionDetailsModelState>;
    addLookSuccess: IReducer<ICollectionDetailsModelState>;
    updateLookSuccess: IReducer<ICollectionDetailsModelState>;
    removeLookSuccess: IReducer<ICollectionDetailsModelState>;
    addLookDressSuccess: IReducer<ICollectionDetailsModelState>;
    updateLookDressSuccess: IReducer<ICollectionDetailsModelState>;
    removeLookDressSuccess: IReducer<ICollectionDetailsModelState>;
  };
}

const filterKey = 'collectionDetails_look_filter';

export const namespace = 'collectionDetails';

const _Model: ICollectionDetailsModelType = {
  namespace: namespace,

  state: {
    collection: null,
    currentLook: null,
    modalLookVisible: false,
    modalLookType: 'add',
    modalLookDressType: 'add',
    modalFilterLookVisible: false,
    modalLookDressVisible: false,
    currentLookDress: null,
    filter: {},
    looks: {
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
        const match = pathMatchRegexp('/collections/:id', pathname);
        if (match) {
          dispatch({
            type: 'getCollection',
            payload: {
              id: match[1],
            },
          });

          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListLook',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              collection_id: match[1],
              filter: defaultFilter,
            },
          });
        }
      });
    },
  },

  effects: {
    *getCollection({ payload }, { call, put }) {
      const response = yield call(api.getCollection, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            collection: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListLook({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select(
        (state: IConnectState) => state.collectionDetails,
      );
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
            looks: {
              list: data.records,
              pagination,
            },
            filter,
          },
        });
      }
    },
    *filterLook({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { success, data } = yield call(api.getListLook, query);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            looks: {
              list: data.records,
              pagination,
            },
            filter: isClear ? {} : query,
            modalFilterLookVisible: false,
          },
        });
      }
    },
    *addLook({ payload }, { call, put }) {
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
        yield put({ type: 'addLookSuccess', payload: data });
      } else {
        throw data;
      }
    },

    *updateLook({ payload }, { select, call, all, put }) {
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
    *addLookDress({ payload }, { call, put }) {
      const { data, success } = yield call(api.createLookDress, payload);
      if (data && success) {
        yield put({ type: 'addLookDressSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *updateLookDress({ payload }, { call, put }) {
      console.log('*** payload', payload);
      const { data, success } = yield call(api.updateLookDress, payload);
      if (data && success) {
        yield put({ type: 'updateLookDressSuccess', payload: data });
      } else {
        throw data;
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
  },

  reducers: {
    showModalLook(state, { payload }) {
      return { ...state, ...payload, modalLookVisible: true };
    },
    hideModalLook(state) {
      return { ...state, currentLook: null, currentLookDress: null, modalLookVisible: false };
    },
    showModalLookDress(state, { payload }) {
      return { ...state, ...payload, modalLookDressVisible: true };
    },
    hideModalLookDress(state) {
      return { ...state, currentLook: null, currentLookDress: null, modalLookDressVisible: false };
    },
    showModalFilterLook(state, { payload }) {
      return { ...state, ...payload, modalFilterLookVisible: true };
    },
    hideModalFilterLook(state) {
      return { ...state, currentLook: null, currentLookDress: null, modalFilterLookVisible: false };
    },
    clearFilterLook(state, { payload }) {
      state.filter = {};
      return state;
    },
    addLookSuccess(state, { payload }) {
      state.looks.list = [payload, ...(state.looks.list || [])];
      state.currentLook = null;
      state.modalLookVisible = false;
      return state;
    },
    addLookDressSuccess(state, { payload }) {
      state.modalLookDressVisible = false;
      const index = state.looks.list?.findIndex((item) => item.id === payload.look_id);
      if (index !== -1) {
        if (
          Array.isArray(state.looks.list[index].dresses) &&
          state.looks.list[index].dresses.length
        ) {
          state.looks.list[index].dresses.push(payload);
        } else {
          state.looks.list[index].dresses = [payload];
        }
      }

      state.currentLook = null;
      state.currentLookDress = null;

      return state;
    },
    updateLookDressSuccess(state, { payload }) {
      state.modalLookDressVisible = false;
      const index = state.looks.list?.findIndex((item) => item.id === payload.look_id);
      if (index !== -1) {
        if (
          Array.isArray(state.looks.list[index].dresses) &&
          state.looks.list[index].dresses.length
        ) {
          const idx = state.looks.list[index].dresses?.findIndex(
            (dress) => dress.id === payload.id,
          );
          if (idx !== -1) {
            state.looks.list[index].dresses[idx] = payload;
          }
        }
      }
      state.currentLook = null;
      state.currentLookDress = null;

      return state;
    },
    removeLookDressSuccess(state, { payload }) {
      const index = state.looks.list?.findIndex((item) => item.id === payload.look_id);
      if (index !== -1) {
        if (
          Array.isArray(state.looks.list[index].dresses) &&
          state.looks.list[index].dresses.length
        ) {
          state.looks.list[index].dresses = state.looks.list[index].dresses?.filter(
            (item) => item.id !== payload.id,
          );
        }
      }
      return state;
    },
    updateLookSuccess(state, { payload }) {
      const index = state.looks.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.looks.list[index] = payload;
      }
      state.modalLookVisible = false;
      state.currentLook = null;
      state.currentLookDress = null;
      return state;
    },
    removeLookSuccess(state, { payload }) {
      state.looks.list = state.looks.list?.filter((item) => item.id !== payload.id);

      state.modalLookVisible = false;
      state.looks.pagination.total = state.looks.pagination.total - 1;
      return state;
    },
  },
};

const Model: ICollectionDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
