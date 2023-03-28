import modelExtend from 'dva-model-extend';
import { IEffect, IModel, IReducer, IPaginationParam } from 'types';
import { IDress, IDressReported } from 'types';
import { getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface IDressReportedModelState {
  currentItem: IDressReported;
  filter: Partial<IDressReported>;
  list: IDress[];
  pagination: IPaginationParam;
  modalVisible: boolean;
  modalType: 'create' | 'update';
}

export const namespace = 'reports';

export interface IDressReportedModelType extends IModel<IDressReportedModelState> {
  namespace: string;
  effects: {
    getListReportCount: IEffect;
  };
  reducers: {
    showModal: IReducer<IDressReportedModelState>;
    hideModal: IReducer<IDressReportedModelState>;
  };
}

const _DressModel: IDressReportedModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    filter: {},
    modalVisible: false,
    modalType: 'create',
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/reports', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          dispatch({
            type: 'getListReportCount',
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
    *getListReportCount({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.listReportCount, payload);
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
          },
        });
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
  },
};

const DressModel: IDressReportedModelType = modelExtend(updateModel, _DressModel);
export default DressModel;
