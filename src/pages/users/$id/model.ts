import modelExtend from 'dva-model-extend';
import api from 'services/api';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  ISwop,
  ITransaction,
  IConnectState,
} from 'types';
import { IUser, IDress, IUserDevice, IUserCredit } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IUserDetailsModelState {
  user: IUser;
  filterDress: any;
  currentDress: IDress;
  modalCreditType: 'create' | 'update';
  modalCreditVisible: boolean;
  modalTransactionVisible: boolean;
  sendAllDevicesOfUser: boolean;
  currentCredit: IUserCredit;
  currentDevice: IUserDevice;
  modalNotificationVisible: boolean;
  modalRequestTokenVisible: boolean;
  modalAddDeviceVisible: boolean;
  modalUpdateDressVisible: boolean;
  modalFilterDressVisible: boolean;
  swops: {
    list: ISwop[];
    pagination: IPaginationParam;
  };
  otherDresses: {
    list: IDress[];
    pagination: IPaginationParam;
  };
  dresses: {
    list: IDress[];
    pagination: IPaginationParam;
  };
  devices: {
    list: IUserDevice[];
    pagination: IPaginationParam;
  };
  credits: {
    list: IUserCredit[];
    pagination: IPaginationParam;
  };
  transactions: {
    list: ITransaction[];
    pagination?: IPaginationParam;
  };
}

export interface IUserDetailsModelType extends IModel<IUserDetailsModelState> {
  effects: {
    getUser: IEffect;
    getListSwop: IEffect;
    getListDress: IEffect;
    getListOtherDress: IEffect;
    getListCredit: IEffect;
    getTransactions: IEffect;
    getListDevice: IEffect;
    requestToken: IEffect;
    createCredit: IEffect;
    updateCredit: IEffect;
    sendPushNotification: IEffect;
    addDevice: IEffect;
    removeDevice: IEffect;
    updateDress: IEffect;
    createTransaction: IEffect;
  };
  reducers: {
    showModalNotification: IReducer<IUserDetailsModelState>;
    hideModalNotification: IReducer<IUserDetailsModelState>;

    showModalTransaction: IReducer<IUserDetailsModelState>;
    hideModalTransaction: IReducer<IUserDetailsModelState>;

    showModalAddDevice: IReducer<IUserDetailsModelState>;
    hideModalAddDevice: IReducer<IUserDetailsModelState>;

    showModalRequestToken: IReducer<IUserDetailsModelState>;
    hideModalRequestToken: IReducer<IUserDetailsModelState>;

    showModalCredit: IReducer<IUserDetailsModelState>;
    hideModalCredit: IReducer<IUserDetailsModelState>;

    showModalUpdateDress: IReducer<IUserDetailsModelState>;
    hideModalUpdateDress: IReducer<IUserDetailsModelState>;

    showModalFilterDress: IReducer<IUserDetailsModelState>;
    hideModalFilterDress: IReducer<IUserDetailsModelState>;

    updateUserToken: IReducer<IUserDetailsModelState>;

    updateCreditSuccess: IReducer<IUserDetailsModelState>;
    createCreditSuccess: IReducer<IUserDetailsModelState>;

    addDeviceSuccess: IReducer<IUserDetailsModelState>;
    removeDeviceSuccess: IReducer<IUserDetailsModelState>;

    updateDressSuccess: IReducer<IUserDetailsModelState>;
  };
}

export const namespace = 'userDetails';

const _Model: IUserDetailsModelType = {
  namespace: namespace,

  state: {
    user: null,
    currentDress: null,
    filterDress: null,
    modalCreditType: 'create',
    modalCreditVisible: false,
    modalAddDeviceVisible: false,
    sendAllDevicesOfUser: false,
    modalTransactionVisible: false,
    modalUpdateDressVisible: false,
    modalFilterDressVisible: false,
    currentCredit: null,
    currentDevice: null,
    swops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    transactions: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    otherDresses: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    dresses: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    credits: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSize,
      },
    },
    devices: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSize,
      },
    },
    modalNotificationVisible: false,
    modalRequestTokenVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/users/:id', pathname);
        if (match) {
          dispatch({ type: 'getUser', payload: match[1] });
          dispatch({
            type: 'getListDress',
            payload: {
              user_id: match[1],
              page: 1,
              limit: config.defaultPageSizeSmall,
            },
          });
          dispatch({
            type: 'getListSwop',
            payload: {
              user_id: match[1],
              page: 1,
              limit: config.defaultPageSizeSmall,
            },
          });
          dispatch({
            type: 'getListDevice',
            payload: {
              id: match[1],
              page: 1,
              limit: config.defaultPageSize,
            },
          });
          dispatch({
            type: 'getListCredit',
            payload: {
              user_id: match[1],
              page: 1,
              limit: config.defaultPageSize,
            },
          });
          dispatch({
            type: 'getTransactions',
            payload: {
              user_id: match[1],
              page: 1,
              limit: config.defaultPageSize,
            },
          });
        }
      });
    },
  },

  effects: {
    *updateDress({ payload }, { select, call, all, put }) {
      const { fileList } = payload;

      if (Array.isArray(fileList) && fileList.length) {
        const { currentDress } = yield select((state: IConnectState) => state.userDetails);
        let canUpload = false;
        const uploadImages = new FormData();
        fileList.forEach((item) => {
          if (typeof item?.url === 'string' && item?.url !== '') {
            const thumbnail = (currentDress as IDress).thumbnails?.find(
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
    *getTransactions({ payload }, { call, put }) {
      const response = yield call(api.listTransaction, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            transactions: {
              list: data?.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getListOtherDress({ payload }, { call, put, select }) {
      const { filter, ...params } = payload;
      const { filterDress } = yield select((state: IConnectState) => state.userDetails);
      const response = yield call(api.getListOtherDress, { ...params, ...(filter || filterDress) });
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            filterDress: filter,
            otherDresses: {
              list: data?.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *addDevice({ payload }, { call, select, put }) {
      const response = yield call(api.addUserDevice, payload);
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'addDeviceSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *removeDevice({ payload }, { call, select, put }) {
      const response = yield call(api.removeUserDevice, payload);
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'removeDeviceSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *sendPushNotification({ payload }, { call, select, put }) {
      const response = yield call(api.sendPushNotification, payload);
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'hideModalNotification',
        });
      } else {
        throw data;
      }
    },
    *requestToken({ payload }, { call, select, put }) {
      const { id, pin } = payload;
      const response = yield call(api.requestToken, {
        id,
        pin,
      });
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'updateUserToken',
          payload: {
            token: data.token,
          },
        });
      } else {
        throw data;
      }
    },
    *createCredit({ payload }, { call, select, put }) {
      const response = yield call(api.addCredit, payload);
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'createCreditSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *updateCredit({ payload }, { call, select, put }) {
      const response = yield call(api.updateCredit, payload);
      const { success, data } = response;
      if (success && data) {
        yield put({
          type: 'updateCreditSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *getUser({ payload }, { call, put }) {
      const response = yield call(api.getUser, {
        id: payload,
      });
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            user: data,
          },
        });
        yield put({
          type: 'getListOtherDress',
          payload: {
            id: data.id,
            user_coordinate_id: data.coordinate_id,
            page: 1,
            limit: config.defaultPageSize,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwop({ payload }, { call, put }) {
      const response = yield call(api.getListSwop, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            swops: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getListDevice({ payload }, { call, put }) {
      const response = yield call(api.getListDeviceOfUser, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            devices: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getListCredit({ payload }, { call, put }) {
      const response = yield call(api.getListCredit, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            credits: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *getListDress({ payload }, { call, put }) {
      const response = yield call(api.getListDress, payload);
      const { success, data } = response;
      if (success) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            dresses: {
              list: data.records,
              pagination,
            },
          },
        });
      } else {
        throw data;
      }
    },
    *createTransaction({ payload }, { call, put }) {
      const response = yield call(api.createTransaction, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'hideModalTransaction',
        });

        yield put({
          type: 'getTransactions',
          payload: {
            user_id: payload.user_id,
            page: 1,
            limit: config.defaultPageSize,
          },
        });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    showModalTransaction(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalTransactionVisible: true,
      };
    },
    hideModalTransaction(state) {
      return {
        ...state,
        modalTransactionVisible: false,
      };
    },
    showModalNotification(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalNotificationVisible: true,
      };
    },
    hideModalNotification(state) {
      return {
        ...state,
        modalNotificationVisible: false,
        currentDevice: null,
      };
    },
    showModalUpdateDress(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalUpdateDressVisible: true,
      };
    },
    hideModalUpdateDress(state) {
      return {
        ...state,
        modalUpdateDressVisible: false,
        currentDress: null,
      };
    },
    showModalAddDevice(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalAddDeviceVisible: true,
      };
    },
    hideModalAddDevice(state) {
      return {
        ...state,
        modalNotificationVisible: false,
        modalAddDeviceVisible: null,
      };
    },

    showModalFilterDress(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalFilterDressVisible: true,
      };
    },
    hideModalFilterDress(state) {
      return {
        ...state,
        modalNotificationVisible: false,
        modalFilterDressVisible: null,
      };
    },

    showModalRequestToken(state, { payload }) {
      return {
        ...state,
        modalRequestTokenVisible: true,
      };
    },
    hideModalRequestToken(state, { payload }) {
      return {
        ...state,
        modalRequestTokenVisible: false,
      };
    },

    showModalCredit(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalCreditVisible: true,
      };
    },
    hideModalCredit(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalCreditVisible: false,
      };
    },

    updateUserToken(state, { payload }) {
      state.user.token = payload.token;
      return state;
    },

    createCreditSuccess(state, { payload }) {
      if (Array.isArray(payload?.records) && payload?.records.length) {
        state.credits.list?.unshift(...payload?.records);
        state.user.remaining_credits = state.user.remaining_credits + payload?.records.length;
      }

      state.modalCreditVisible = false;
      return state;
    },

    updateCreditSuccess(state, { payload }) {
      const index = state.credits?.list.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.credits.list[index] = payload;
      }
      state.modalCreditVisible = false;
      return state;
    },
    addDeviceSuccess(state, { payload }) {
      const index = state?.devices?.list?.findIndex((item) => item.token === payload.token);
      if (index === -1) {
        state.devices.list.push(payload);
      }
      state.modalAddDeviceVisible = false;
      return state;
    },
    removeDeviceSuccess(state, { payload }) {
      if (state.devices?.list) {
        state.devices.list = state?.devices?.list?.filter((item) => item.token !== payload.token);
      }

      return state;
    },
    updateDressSuccess(state, { payload }) {
      const index = state.dresses?.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.dresses.list[index] = payload;
      }
      state.modalUpdateDressVisible = false;
      return state;
    },
  },
};

const Model: IUserDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
