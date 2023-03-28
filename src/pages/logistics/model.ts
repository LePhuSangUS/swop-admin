import modelExtend from 'dva-model-extend';
import { IEffect, IModel, IReducer, IPaginationParam } from 'types';
import { IDeliveryExprotCSV } from 'types';
import { config, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface ILogisticsModelState {
  pickSwopperStops: {
    list: IDeliveryExprotCSV[];
    pagination: IPaginationParam;
  };
  pickLaundryStops: {
    list: IDeliveryExprotCSV[];
    pagination: IPaginationParam;
  };
  dropSwopperStops: {
    list: IDeliveryExprotCSV[];
    pagination: IPaginationParam;
  };
  dropLaundryStops: {
    list: IDeliveryExprotCSV[];
    pagination: IPaginationParam;
  };

  pickStops: IDeliveryExprotCSV[];
  dropStops: IDeliveryExprotCSV[];

  modalExportDropStopsVisible: boolean;
  modalExportPickStopsVisible: boolean;

  modalFilterDropStopsVisible: boolean;
  modalFilterPickStopsVisible: boolean;

  dropStopsFilter: Object;
  pickStopsFilter: Object;
}

export interface ILogisticsModelType extends IModel<ILogisticsModelState> {
  namespace: string;
  effects: {
    getDropStops: IEffect;
    getPickStops: IEffect;

    filterDropStops: IEffect;
    filterPickStops: IEffect;

    exportDropStops: IEffect;
    exportPickStops: IEffect;
  };
  reducers: {
    showModalExportDropStops: IReducer<ILogisticsModelState>;
    hideModalExportDropStops: IReducer<ILogisticsModelState>;

    showModalFilterDropStops: IReducer<ILogisticsModelState>;
    hideModalFilterDropStops: IReducer<ILogisticsModelState>;

    showModalExportPickStops: IReducer<ILogisticsModelState>;
    hideModalExportPickStops: IReducer<ILogisticsModelState>;

    showModalFilterPickStops: IReducer<ILogisticsModelState>;
    hideModalFilterPickStops: IReducer<ILogisticsModelState>;

    clearPickStopsFilter: IReducer<ILogisticsModelState>;
    clearDropStopsFilter: IReducer<ILogisticsModelState>;
  };
}

export const namespace = 'logistics';

const _UserModel: ILogisticsModelType = {
  namespace: namespace,
  state: {
    modalExportDropStopsVisible: false,
    modalExportPickStopsVisible: false,
    modalFilterDropStopsVisible: false,
    modalFilterPickStopsVisible: false,
    dropLaundryStops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    dropSwopperStops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    pickLaundryStops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    pickSwopperStops: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        total: 0,
        pageSize: config.defaultPageSizeSmall,
      },
    },
    dropStops: [],
    pickStops: [],
    dropStopsFilter: null,
    pickStopsFilter: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/logistics', location.pathname)) {
          dispatch({
            type: 'getPickStops',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
            },
          });
          dispatch({
            type: 'getDropStops',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
            },
          });
        }
      });
    },
  },

  effects: {
    *getDropStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getDropStops, payload);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            dropStops: data?.records,
          },
        });
      }
    },
    *getPickStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getPickStops, payload);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            pickStops: data?.records,
          },
        });
      }
    },

    *filterDropStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getDropStops, payload);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            dropStops: data?.records,
            dropStopsFilter: payload,
          },
        });
      }
    },
    *filterPickStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.getPickStops, payload);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            pickStops: data?.records,
            pickStopsFilter: payload,
          },
        });
      }
    },

    *exportDropStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.exportDropStops, payload);

      if (success && data) {
      }
    },
    *exportPickStops({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.exportPickStops, payload);

      if (success && data) {
      }
    },
  },

  reducers: {
    showModalExportDropStops(state, { payload }) {
      return { ...state, ...payload, modalExportDropStopsVisible: true };
    },

    hideModalExportDropStops(state) {
      return { ...state, modalExportDropStopsVisible: false };
    },

    showModalFilterDropStops(state, { payload }) {
      return { ...state, ...payload, modalFilterDropStopsVisible: true };
    },

    hideModalFilterDropStops(state) {
      return { ...state, modalFilterDropStopsVisible: false };
    },

    showModalExportPickStops(state, { payload }) {
      return { ...state, ...payload, modalExportPickStopsVisible: true };
    },

    hideModalExportPickStops(state) {
      return { ...state, modalExportPickStopsVisible: false };
    },

    showModalFilterPickStops(state, { payload }) {
      return { ...state, ...payload, modalFilterPickStopsVisible: true };
    },

    hideModalFilterPickStops(state) {
      return { ...state, modalFilterPickStopsVisible: false };
    },

    clearDropStopsFilter(state, { payload }) {
      state.dropStopsFilter = null;
      return state;
    },

    clearPickStopsFilter(state) {
      state.pickStopsFilter = null;
      return state;
    },
  },
};

const UserModel: ILogisticsModelType = modelExtend(updateModel, _UserModel);
export default UserModel;
