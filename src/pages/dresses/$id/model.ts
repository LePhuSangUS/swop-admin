import { AxiosResponse } from 'axios';
import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { removeImageBackground } from 'services/removal';
import {
  IConnectState,
  IEffect,
  IModel,
  IPaginationParam,
  IReducer,
  IRemovalAIResponse,
} from 'types';
import { ISwop, IDress } from 'types';
import { getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IDressDetailsModelState {
  dress: IDress;
  modalVisible: boolean;
  activeSwops: {
    list: ISwop[];
    pagination: IPaginationParam;
  };
  availableSwops: {
    list: ISwop[];
    pagination: IPaginationParam;
  };
}

export interface IDressDetailsModelType extends IModel<IDressDetailsModelState> {
  effects: {
    getDress: IEffect;
    updateDress: IEffect;
    getActiveSwopsOfDress: IEffect;
    getAvailableSwopsOfDress: IEffect;
  };
  reducers: {
    showModal: IReducer<IDressDetailsModelState>;
    hideModal: IReducer<IDressDetailsModelState>;
    updateDressSuccess: IReducer<IDressDetailsModelState>;
  };
}

export const namespace = 'dressDetails';

const _Model: IDressDetailsModelType = {
  namespace: namespace,

  state: {
    dress: null,
    activeSwops: null,
    availableSwops: null,
    modalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/dresses/:id', pathname);
        if (match) {
          dispatch({
            type: 'getDress',
            payload: {
              id: match[1],
            },
          });

          dispatch({
            type: 'getActiveSwopsOfDress',
            payload: {
              id: match[1],
            },
          });

          dispatch({
            type: 'getAvailableSwopsOfDress',
            payload: {
              id: match[1],
            },
          });
        }
      });
    },
  },

  effects: {
    *getDress({ payload }, { call, put }) {
      const response = yield call(api.getDress, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            dress: data,
          },
        });
      } else {
        throw data;
      }
    },
    *updateDress({ payload }, { select, call, all, put }) {
      const { fileList } = payload;

      if (Array.isArray(fileList) && fileList.length) {
        const { dress } = yield select((state: IConnectState) => state.dressDetails);
        let canUpload = false;
        let uploadImages: Array<FormData> = [];
        fileList.forEach((item) => {
          if (typeof item?.url === 'string' && item?.url !== '') {
            const thumbnail = (dress as IDress).thumbnails?.find(
              (it) => it.split('/')?.pop() === item?.url.split('/')?.pop(),
            );

            if (typeof thumbnail === 'string' && thumbnail !== '') {
              payload.photos = [...(payload.photos || []), item?.url];
              payload.thumbnails = [...(payload.thumbnails || []), thumbnail];
            }
          } else {
            var file = new FormData();
            file.append('image_file', item.originFileObj);
            uploadImages.push(file);

            canUpload = true;
          }
        });

        // if (canUpload) {
        //   const { data, success } = yield call(api.uploadDressPhotos, removeImageBackgrounds, null, {
        //     'Content-Type': `multipart/form-data`,
        //   });

        //   if (data && success) {
        //     data?.records?.forEach((item: any) => {
        //       payload.photos = [...(payload.photos || []), item.photo];

        //       payload.thumbnails = [...(payload.thumbnails || []), item.thumbnail];
        //     });
        //   }
        // }

        if (canUpload) {
          const calls = uploadImages.map((file) => call(removeImageBackground, file));
          const resp: Array<any> = yield all(calls);
          resp?.forEach((item) => {
            if (item.success) {
              const data = item.data as IRemovalAIResponse;
              payload.photos = [...(payload.photos || []), data?.url];

              payload.thumbnails = [...(payload.thumbnails || []), data?.preview_demo];
            }
          });
        }
      }
      const { data, success } = yield call(api.updateDress, payload);
      if (data && success) {
        yield put({ type: 'updateDressSuccess', payload: data });
      } else {
        throw data;
      }
    },
    *getActiveSwopsOfDress({ payload }, { call, put }) {
      const response = yield call(api.getActiveSwopsOfDress, payload);
      const { success, data } = response;

      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            activeSwops: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getAvailableSwopsOfDress({ payload }, { call, put }) {
      const response = yield call(api.getAvailableSwopsDress, payload);
      const { success, data } = response;
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            availableSwops: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
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
    updateDressSuccess(state, { payload }) {
      state.dress = payload;
      state.modalVisible = false;
      return state;
    },
  },
};

const Model: IDressDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
