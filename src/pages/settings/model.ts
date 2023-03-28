import modelExtend from 'dva-model-extend';
import { IEffect, IModel, IReducer, IPaginationParam, IUser } from 'types';
import { IPriceSetting } from 'types';
import { getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface ISettingModelState {
  currentSetting: IPriceSetting;
  currentAdmin: IUser;
  currentShipper: IUser;
  currentUpdatingUser: IUser;
  settings: {
    list: IPriceSetting[];
    pagination: IPaginationParam;
  };
  admins: {
    pagination: IPaginationParam;
    list: IUser[];
  };
  shippers: {
    pagination: IPaginationParam;
    list: IUser[];
  };
  modalVisible: boolean;
  modalAddAdminVisible: boolean;
  modalAddShipperVisible: boolean;
  modalUpdateUserVisible: boolean;
  modalType: 'create' | 'update';
}

export const namespace = 'settings';

export interface ISettingModelType extends IModel<ISettingModelState> {
  namespace: string;
  effects: {
    getListAdmin: IEffect;
    deleteAdmin: IEffect;
    addAdmin: IEffect;

    getListShipper: IEffect;
    deleteShipper: IEffect;
    addShipper: IEffect;

    getListPriceSettings: IEffect;
    updatePriceSetting: IEffect;

    updateUser: IEffect;
  };
  reducers: {
    updatePriceSettingSuccess: IReducer<ISettingModelState>;
    showModal: IReducer<ISettingModelState>;
    hideModal: IReducer<ISettingModelState>;

    showModalAddAdmin: IReducer<ISettingModelState>;
    hideModalAddAdmin: IReducer<ISettingModelState>;

    deleteAdminSuccess: IReducer<ISettingModelState>;

    showModalAddShipper: IReducer<ISettingModelState>;
    hideModalAddShipper: IReducer<ISettingModelState>;

    showModalUpdateUser: IReducer<ISettingModelState>;
    hideModalUpdateUser: IReducer<ISettingModelState>;

    deleteShipperSuccess: IReducer<ISettingModelState>;

    updateUserSuccess: IReducer<ISettingModelState>;
  };
}

const _DressModel: ISettingModelType = {
  namespace: namespace,
  state: {
    currentSetting: null,
    currentAdmin: null,
    currentShipper: null,
    modalVisible: false,
    currentUpdatingUser: null,
    modalUpdateUserVisible: false,
    modalAddShipperVisible: false,
    modalAddAdminVisible: false,
    modalType: 'create',
    admins: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: 10,
      },
    },
    shippers: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: 10,
      },
    },
    settings: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: 10,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/settings', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          dispatch({
            type: 'getListPriceSettings',
            payload: {
              page: 1,
              limit: 10,
            },
          });
          dispatch({
            type: 'getListAdmin',
            payload: {
              page: 1,
              limit: 10,
              ...payload,
            },
          });
          dispatch({
            type: 'getListShipper',
            payload: {
              page: 1,
              limit: 10,
              ...payload,
            },
          });
        }
      });
    },
  },

  effects: {
    *updateUser({ payload }, { select, call, put }) {
      const { data, success } = yield call(api.updateUser, payload);
      if (data && success) {
        yield put({
          type: 'updateUserSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *getListAdmin({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListUser, {
        ...payload,
        list_role: 'admin',
      });
      if (success && data) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            admins: {
              list: data.records,
              pagination,
            },
          },
        });
      }
    },
    *addAdmin({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.createUser, payload);
      if (success && data) {
        yield put({
          type: 'getListAdmin',
          payload: {
            page: 1,
            limit: 10,
            list_role: 'admin',
          },
        });
        yield put({
          type: 'hideModalAddAdmin',
        });
      }
    },
    *deleteAdmin({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.deleteUser, payload);
      if (success && data) {
        yield put({
          type: 'deleteAdminSuccess',
          payload: payload,
        });
      }
    },

    *getListShipper({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListUser, {
        ...payload,
        list_role: 'shipper',
      });
      if (success && data) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            shippers: {
              list: data.records,
              pagination,
            },
          },
        });
      }
    },
    *addShipper({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.createUser, payload);
      if (success && data) {
        yield put({
          type: 'getListShipper',
          payload: {
            page: 1,
            limit: 10,
            list_role: 'shipper',
          },
        });
        yield put({
          type: 'hideModalAddShipper',
        });
      }
    },
    *deleteShipper({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.deleteUser, payload);
      if (success && data) {
        yield put({
          type: 'deleteShipperSuccess',
          payload: payload,
        });
      }
    },

    *getListPriceSettings({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.getListPriceSettings, payload);
      if (success && data) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            settings: {
              list: data.records,
              pagination,
            },
          },
        });
      }
    },
    *updatePriceSetting({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.updatePriceSetting, payload);
      if (success && data) {
        yield put({
          type: 'updatePriceSettingSuccess',
          payload: data,
        });
      }
    },
  },

  reducers: {
    updatePriceSettingSuccess(state, { payload }) {
      const index = state?.settings.list.findIndex(
        (item) => item.country_code === payload.country_code,
      );
      if (index !== -1) {
        state.settings.list[index] = payload;
      }
      state.modalVisible = false;
      state.currentSetting = null;
      return state;
    },
    deleteAdminSuccess(state, { payload }) {
      state.admins.list = state.admins?.list?.filter((item) => item.id !== payload.id);
      state.modalAddAdminVisible = false;

      return state;
    },
    deleteShipperSuccess(state, { payload }) {
      state.shippers.list = state.shippers?.list?.filter((item) => item.id !== payload.id);
      state.modalAddAdminVisible = false;

      return state;
    },
    updateUserSuccess(state, { payload }) {
      const index = state?.admins?.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.admins.list[index] = payload;
      }
      state.modalUpdateUserVisible = false;
      return state;
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    showModalUpdateUser(state, { payload }) {
      return { ...state, ...payload, modalUpdateUserVisible: true };
    },
    hideModalUpdateUser(state) {
      return { ...state, modalUpdateUserVisible: false, currentUpdatingUser: null };
    },
    showModalAddAdmin(state, { payload }) {
      return { ...state, ...payload, modalAddAdminVisible: true };
    },
    hideModalAddAdmin(state) {
      return { ...state, modalAddAdminVisible: false };
    },
    showModalAddShipper(state, { payload }) {
      return { ...state, ...payload, modalAddShipperVisible: true };
    },
    hideModalAddShipper(state) {
      return { ...state, modalAddShipperVisible: false };
    },
  },
};

const DressModel: ISettingModelType = modelExtend(updateModel, _DressModel);
export default DressModel;
