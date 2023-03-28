import modelExtend from 'dva-model-extend';
import moment from 'moment';
import store from 'store';
import {
  IEffect,
  IModel,
  IReducer,
  IPaginationParam,
  IConnectState,
  IUserStats,
  IDress,
} from 'types';
import { IUser } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import { setDefaultTimezone } from 'utils/date';
import { uploadS3Image } from 'services/s3';
import api from 'services/api';

export interface IUserModelState {
  currentUser: IUser;
  currentDress: IDress;
  list: IUser[];
  filter: object;
  pagination: IPaginationParam;
  modalVisible: boolean;
  modalFilterVisible: boolean;
  modalActivateVisible: boolean;
  modalType: 'create' | 'update';
  userStats: IUserStats;
}

const filterKey = 'users_filter';

export interface IUserModelType extends IModel<IUserModelState> {
  namespace: 'users';
  effects: {
    getListUser: IEffect;
    getUserStats: IEffect;
    filterUser: IEffect;
    deleteUser: IEffect;
    createUser: IEffect;
    updateUser: IEffect;
    deactivateAccount: IEffect;
    activateAccount: IEffect;
    unArchiveAccount: IEffect;
  };
  reducers: {
    showModal: IReducer<IUserModelState>;
    hideModal: IReducer<IUserModelState>;
    updateUserSuccess: IReducer<IUserModelState>;
    deleteUserSuccess: IReducer<IUserModelState>;
    showModalActivateAccount: IReducer<IUserModelState>;
    hideModalActivateAccount: IReducer<IUserModelState>;
    showModalFilter: IReducer<IUserModelState>;
    hideModalFilter: IReducer<IUserModelState>;
    activateAccountSuccess: IReducer<IUserModelState>;
    deactivateAccountSuccess: IReducer<IUserModelState>;
    unArchiveAccountSuccess: IReducer<IUserModelState>;
  };
}

const _UserModel: IUserModelType = {
  namespace: 'users',
  state: {
    currentUser: null,
    currentDress: null,
    modalVisible: false,
    modalFilterVisible: false,
    modalActivateVisible: false,
    modalType: 'create',
    list: [],
    filter: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: config.defaultPageSize,
    },
    userStats: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/users', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListUser',
            payload: {
              page: 1,
              limit: config.defaultPageSize,
              ...payload,
              filter: defaultFilter,
            },
          });

          dispatch({
            type: 'getUserStats',
          });
        }
      });
    },
  },

  effects: {
    *getUserStats({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getUserStats, payload);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            userStats: data,
          },
        });
      }
    },
    *activateAccount({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.activateUser, payload);

      if (success && data) {
        yield put({
          type: 'activateAccountSuccess',
          payload: payload,
        });
      }
    },
    *deactivateAccount({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.deactivateUser, payload);

      if (success && data) {
        yield put({
          type: 'deactivateAccountSuccess',
          payload: payload,
        });
      }
    },
    *unArchiveAccount({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.unArchiveUser, payload);

      if (success && data) {
        yield put({
          type: 'unArchiveAccountSuccess',
          payload: data,
        });
      }
    },
    *getListUser({ payload = {} }, { call, put, select }) {
      const { filter: defaultFilter } = yield select((state: IConnectState) => state.users);
      const filter = {
        ...defaultFilter,
        ...(payload?.filter || {}),
      };
      const params = {
        ...filter,
        ...payload,
      };

      const { success, data } = yield call(api.getListUser, params);
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
    *filterUser({ payload = {} }, { call, put }) {
      const { isClear = false, ...query } = payload;
      const { success, data } = yield call(api.getListUser, query);
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
    *deleteUser({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.removeUser, { id: payload });

      if (success && data) {
        yield put({
          type: 'deleteUserSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *createUser({ payload }, { call, put }) {
      const { birthday, imageFile } = payload;
      if (imageFile) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: 'avatar',
        });
        if (success) {
          const formData = new FormData();
          const key = `users/${imageFile.uid}_${imageFile.name}`;
          const { url, ...other } = data;

          Object.keys(other).forEach((k) => formData.append(k, other[k]));

          formData.append('key', key);
          formData.append('file', imageFile);

          const { success } = yield call(uploadS3Image, url, formData);
          if (success) {
            payload.avatar = `${url}/${key}`;
          }
        }
      }

      if (moment.isMoment(birthday)) {
        payload.birthday = moment(birthday).format('YYYY-MM-DD');
      }

      if (payload.pickup_location) {
        payload.lat = `${payload.pickup_location?.lat}`;
        payload.lng = `${payload.pickup_location?.lng}`;
        payload.address = `${payload.pickup_location?.formatted_address}`;
        payload.google_place_id = `${payload.pickup_location?.google_place_id}`;

        delete payload.pickup_location;
      }

      const data = yield call(api.createUser, payload);
      if (data.success) {
        yield put({ type: 'hideModal' });
      } else {
        throw data;
      }
    },

    *updateUser({ payload }, { select, call, put }) {
      const { imageFile } = payload;
      if (imageFile) {
        const { success, data } = yield call(api.getS3Signature, {
          content_type: imageFile.type,
          prefix: 'avatar',
        });
        if (success) {
          const formData = new FormData();
          const { url, key, ...other } = data;

          Object.keys(other).forEach((k) => formData.append(k, other[k]));

          formData.append('key', key);
          formData.append('file', imageFile);

          const { success } = yield call(uploadS3Image, url, formData);
          if (success) {
            payload.avatar = `${url}/${key}`;
          }
        }
      }

      const { data, success } = yield call(api.updateUser, payload);
      if (data && success) {
        yield put({
          type: 'updateUserSuccess',
          payload: data,
        });
        const currentUser = store.get('user', null);
        if (currentUser?.id === data?.id) {
          store.set('user', data);
          if (currentUser?.timezone !== data?.timezone) {
            setDefaultTimezone();
          }
        }
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
    showModalActivateAccount(state, { payload }) {
      return { ...state, ...payload, modalActivateVisible: true };
    },
    hideModalActivateAccount(state) {
      return { ...state, modalActivateVisible: false };
    },
    showModalFilter(state, { payload }) {
      return { ...state, ...payload, modalFilterVisible: true };
    },
    hideModalFilter(state) {
      return { ...state, modalFilterVisible: false };
    },
    updateUserSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalVisible = false;
      return state;
    },
    deleteUserSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].deleted_at = payload.deleted_at;
        state.list[index].phone = '';
        state.list[index].email = '';
      }
      state.modalActivateVisible = false;
      return state;
    },
    activateAccountSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].is_inactive = false;
      }

      return state;
    },
    deactivateAccountSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].is_inactive = true;
      }

      return state;
    },
    unArchiveAccountSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
      state.modalActivateVisible = false;
      return state;
    },
  },
};

const UserModel: IUserModelType = modelExtend(updateModel, _UserModel);
export default UserModel;
