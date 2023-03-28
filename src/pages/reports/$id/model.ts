import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { IEffect, IModel } from 'types';
import { IDress, IReportDress, IPaginationParam } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IReportDetailsModelState {
  dress: IDress;
  list: IReportDress[];
  pagination?: IPaginationParam;
}

export const namespace = 'reportDetails';
export interface IReportDetailsModelType extends IModel<IReportDetailsModelState> {
  effects: {
    getListDressReportDetails: IEffect;
    getDress: IEffect;
  };
}

const _Model: IReportDetailsModelType = {
  namespace: namespace,
  state: {
    dress: null,
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: config.defaultPageSize,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/reports/:id', pathname);

        if (match) {
          dispatch({
            type: 'getListDressReportDetails',
            payload: {
              id: match[1],
            },
          });

          dispatch({
            type: 'getDress',
            payload: {
              id: match[1],
            },
          });
        }
      });
    },
  },

  effects: {
    *getListDressReportDetails({ payload }, { call, put }) {
      const response = yield call(api.getListDressReportDetails, payload);
      const { success, data } = response;
      const pagination = getPagination(data);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
          },
        });
      } else {
        throw data;
      }
    },
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
  },
};

const Model: IReportDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
