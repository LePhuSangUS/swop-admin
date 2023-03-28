import modelExtend from 'dva-model-extend';
import moment from 'moment';
import api from 'services/api';
import {
  IEffect,
  IModel,
  IRecords,
  IMatchingStats,
  ISwopStats,
  IStatsRevenue,
  IStatsCumulative,
} from 'types';
import { pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IDashboardModelState {
  totalLaundry: number;
  totalUser: number;
  totalDress: number;
  swopStats: IRecords<ISwopStats>;
  matchingStats: IRecords<IMatchingStats>;
  statsRevenue: IRecords<IStatsRevenue>;
  statsCumulative: IStatsCumulative;
  dispatching: { [key: string]: boolean };
}

export const namespace = 'dashboard';

export interface IDashboardModelType extends IModel<IDashboardModelState> {
  namespace: string;
  effects: {
    countUser: IEffect;
    countLaundry: IEffect;
    countDress: IEffect;
    getSwopStats: IEffect;
    getMatchingStats: IEffect;
    statsRevenue: IEffect;
    statsCumulative: IEffect;
  };
}

const _DashboardModel: IDashboardModelType = {
  namespace: namespace,
  state: {
    totalDress: 0,
    totalUser: 0,
    totalLaundry: 0,
    matchingStats: null,
    swopStats: null,
    statsRevenue: null,
    statsCumulative: null,
    dispatching: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathMatchRegexp('/dashboard', pathname) || pathMatchRegexp('/', pathname)) {
          // @ts-ignore
          const payload = location.query;

          dispatch({ type: 'countLaundry' });
          dispatch({ type: 'countUser' });
          dispatch({ type: 'countDress' });
          dispatch({ type: 'getSwopStats' });
          dispatch({ type: 'getMatchingStats' });
          dispatch({
            type: 'statsRevenue',
            payload: {
              from_time: moment().startOf('month').unix(),
              to_time: moment().endOf('month').unix(),
            },
          });
          dispatch({
            type: 'statsCumulative',
            payload: {
              from_time: moment().startOf('day').unix(),
              to_time: moment().endOf('day').unix(),
            },
          });
        }
      });
    },
  },
  effects: {
    *statsCumulative({ payload }, { call, put }) {
      const { success, data } = yield call(api.statsCumulative, payload);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            statsCumulative: data,
          },
        });
      } else {
        throw data;
      }
    },
    *statsRevenue({ payload }, { call, put }) {
      const { success, data } = yield call(api.statsRevenue, payload);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            statsRevenue: data,
          },
        });
      } else {
        throw data;
      }
    },
    *countUser({ payload }, { call, put }) {
      const { success, data } = yield call(api.countUser);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            totalUser: data.total,
          },
        });
      } else {
        throw data;
      }
    },
    *countLaundry({ payload }, { call, put }) {
      const { success, data } = yield call(api.countLaundry);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            totalLaundry: data.total,
          },
        });
      } else {
        throw data;
      }
    },
    *countDress({ payload }, { call, put }) {
      const { success, data } = yield call(api.countDress);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            totalDress: data.total,
          },
        });
      } else {
        throw data;
      }
    },
    *getMatchingStats({ payload }, { call, put }) {
      const { success, data } = yield call(api.getMatchingStats);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            matchingStats: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getSwopStats({ payload }, { call, put }) {
      const { success, data } = yield call(api.getSwopStats);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swopStats: data,
          },
        });
      } else {
        throw data;
      }
    },
  },
};

const DashboardModel: IDashboardModelType = modelExtend(updateModel, _DashboardModel);
export default DashboardModel;
