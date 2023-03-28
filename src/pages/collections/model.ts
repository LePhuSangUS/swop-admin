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
import { ICollection } from 'types';
import { config, dataURIToBlob, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';
import { removeImageBackground } from 'services/removal';
import { uploadS3Image } from 'services/s3';

export interface ICollectionModelState {
  currentItem: ICollection;
  filter: {};
  list: ICollection[];
  pagination: IPaginationParam;
  modalFilterVisible: boolean;
  modalAddLookVisible: boolean;
  modalVisible: boolean;
  modalType: 'create' | 'update';
}

const filterKey = 'collections_filter';

export const namespace = 'collections';

export interface ICollectionModelType extends IModel<ICollectionModelState> {
  namespace: string;
  effects: {
    getListCollection: IEffect;
    filterCollection: IEffect;
    createCollection: IEffect;
    updateCollection: IEffect;
    removeCollection: IEffect;
    addLook: IEffect;
  };
  reducers: {
    clearFilter: IReducer<ICollectionModelState>;
    createCollectionSuccess: IReducer<ICollectionModelState>;
    updateCollectionSuccess: IReducer<ICollectionModelState>;
    removeCollectionSuccess: IReducer<ICollectionModelState>;

    addLookSuccess: IReducer<ICollectionModelState>;

    showModal: IReducer<ICollectionModelState>;
    hideModal: IReducer<ICollectionModelState>;

    showModalUnArchive: IReducer<ICollectionModelState>;
    hideModalUnArchive: IReducer<ICollectionModelState>;

    showModalFilter: IReducer<ICollectionModelState>;
    hideModalFilter: IReducer<ICollectionModelState>;

    showModalAddLook: IReducer<ICollectionModelState>;
    hideModalAddLook: IReducer<ICollectionModelState>;
  };
}

const _CollectionModel: ICollectionModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    filter: {},
    modalVisible: false,
    modalFilterVisible: false,
    modalAddLookVisible: false,
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
        if (pathMatchRegexp('/collections', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListCollection',
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
      const { imageFile, collection_name } = payload;

      if (imageFile) {
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
            const key = `looks/${imageFile.uid}_${imageFile.name}`;
            const { url, ...other } = data;

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
      }
      const { data, success } = yield call(api.createLook, payload);
      if (data && success) {
        yield put({ type: 'addLookSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *getListCollection({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.collections);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListCollection, params);
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
    *filterCollection({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListCollection, payload);
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

    *createCollection({ payload }, { call, put }) {
      const { name, imageFile } = payload;
      if (imageFile?.uid) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: `collections/${name}`,
        });
        if (success) {
          // const formData = new FormData();
          // formData.append('image_file', imageFile);

          // const { success, data: resp } = yield call(removeImageBackground, formData);
          // if (success) {
          //   const removalData = resp as IRemovalAIResponse;
          //   const formData = new FormData();
          //   const { url, key, ...other } = data;

          //   Object.keys(other).forEach((k) => formData.append(k, other[k]));

          //   const file = dataURIToBlob(`data:image/jpeg;base64,${removalData.base64}`);

          //   formData.append('key', key);
          //   formData.append('file', file);

          //   const { success } = yield call(uploadS3Image, url, formData);
          //   if (success) {
          //     payload.photo = `${url}/${key}`;
          //   }
          // }
          const formData = new FormData();
          const { url, key, ...other } = data;

          Object.keys(other).forEach((k) => formData.append(k, other[k]));

          formData.append('key', key);
          formData.append('file', imageFile);

          const { success } = yield call(uploadS3Image, url, formData);
          if (success) {
            payload.photo = `${url}/${key}`;
          }
        }
      } else {
        if (typeof imageFile === 'string' && imageFile !== '') {
          payload.photo = imageFile;
        }
      }

      const { data, success } = yield call(api.createCollection, payload);
      if (data && success) {
        yield put({ type: 'createCollectionSuccess', payload: data });
      } else {
        throw data;
      }
    },

    *updateCollection({ payload }, { select, call, all, put }) {
      const { name, imageFile } = payload;
      if (imageFile?.uid) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: `collections/${name}`,
        });
        if (success) {
          // const formData = new FormData();
          // formData.append('image_file', imageFile);

          // const { success, data: resp } = yield call(removeImageBackground, formData);
          // if (success) {
          //   const removalData = resp as IRemovalAIResponse;
          //   const formData = new FormData();
          //   const { url, key, ...other } = data;

          //   Object.keys(other).forEach((k) => formData.append(k, other[k]));

          //   const file = dataURIToBlob(`data:image/jpeg;base64,${removalData.base64}`);

          //   formData.append('key', key);
          //   formData.append('file', file);

          //   const { success } = yield call(uploadS3Image, url, formData);
          //   if (success) {
          //     payload.photo = `${url}/${key}`;
          //   }
          // }

          const formData = new FormData();
          const { url, key, ...other } = data;

          Object.keys(other).forEach((k) => formData.append(k, other[k]));

          formData.append('key', key);
          formData.append('file', imageFile);

          const { success } = yield call(uploadS3Image, url, formData);
          if (success) {
            payload.photo = `${url}/${key}`;
          }
        }
      } else {
        if (typeof imageFile === 'string' && imageFile !== '') {
          payload.photo = imageFile;
        }
      }

      const { data, success } = yield call(api.updateCollection, payload);
      if (data && success) {
        yield put({ type: 'updateCollectionSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *removeCollection({ payload }, { select, call, all, put }) {
      const { data, success } = yield call(api.deleteCollection, payload);
      if (data && success) {
        yield put({ type: 'removeCollectionSuccess', payload });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    addLookSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.collection_id);
      if (index !== -1) {
        state.list[index].total_looks = (state.list[index].total_looks || 0) + 1;
      }
      state.modalAddLookVisible = false;
      return state;
    },
    clearFilter(state, { payload }) {
      state.filter = {};
      return state;
    },
    createCollectionSuccess(state, { payload }) {
      state.list = [payload, ...(state.list || [])];
      state.currentItem = null;
      state.modalVisible = false;
      return state;
    },
    updateCollectionSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
    removeCollectionSuccess(state, { payload }) {
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
    showModalAddLook(state, { payload }) {
      return { ...state, ...payload, modalAddLookVisible: true };
    },
    hideModalAddLook(state) {
      return { ...state, modalAddLookVisible: false };
    },
  },
};

const CollectionModel: ICollectionModelType = modelExtend(updateModel, _CollectionModel);
export default CollectionModel;
