import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { delay } from 'redux-saga';
import {
  IConnectState,
  IEffect,
  IModel,
  IOverdueBalance,
  IReducer,
  ISwop,
  ITransaction,
  IUser,
} from 'types';
import { IMatching, ISwopTracking } from 'types';
import { pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IMatchingDetailsModelState {
  matching: IMatching;
  currentSwopTracking: ISwopTracking;
  currentSwop: ISwop;
  currentOtherSwop: ISwop;
  currentSwopUser: IUser;
  currentOtherSwopUser: IUser;
  currentTaskPayload: {
    name: string;
    data: {
      swop_id?: string;
      matching_id?: string;
    };
  };
  userOverdueBalance: IOverdueBalance;
  counterUserOverdueBalance: IOverdueBalance;
  modalTimeElapsedVisible: boolean;
  currentSwopTrackingIsCounter: boolean;
  swopTrackings: ISwopTracking[];
  counterSwopTrackings: ISwopTracking[];
  swopTransactions: ITransaction[];
  counterSwopTransactions: ITransaction[];
  modalUpdateMatchingVisible: boolean;
  modalUpdateSwopVisible: boolean;
  modalSwopTrackingVisible: boolean;
  modalAssignDeliveryVisible: boolean;
  modalSwopTrackingType: 'create' | 'update';
  dispatching: { [key: string]: boolean };
}

export interface IMatchingDetailsModelType extends IModel<IMatchingDetailsModelState> {
  effects: {
    getMatching: IEffect;
    updateMatching: IEffect;
    updateSwop: IEffect;
    getUserOverdueBalance: IEffect;
    getCounterUserOverdueBalance: IEffect;
    getSwopTrackings: IEffect;
    getCounterSwopTrackings: IEffect;
    getSwopTransactions: IEffect;
    getCounterSwopTransactions: IEffect;
    deleteSwopTracking: IEffect;
    updateSwopTracking: IEffect;
    createSwopTracking: IEffect;
    fixSameReturnLaundry: IEffect;
    fixSameLaundry: IEffect;
    markAsEarlyReturnConfirmed: IEffect;
    markAsRetentionConfirmed: IEffect;
    assignDelivery: IEffect;
    markSwopStatus: IEffect;
    simulateSwopStatus: IEffect;
  };
  reducers: {
    dispatchTaskStart: IReducer<IMatchingDetailsModelState>;
    dispatchTaskEnd: IReducer<IMatchingDetailsModelState>;

    showModalTimeElapsed: IReducer<IMatchingDetailsModelState>;
    hideModalTimeElapsed: IReducer<IMatchingDetailsModelState>;

    showModalUpdateMatching: IReducer<IMatchingDetailsModelState>;
    hideModalUpdateMatching: IReducer<IMatchingDetailsModelState>;

    hideModalAssignDelivery: IReducer<IMatchingDetailsModelState>;
    showModalAssignDelivery: IReducer<IMatchingDetailsModelState>;

    showModalUpdateSwop: IReducer<IMatchingDetailsModelState>;
    hideModalUpdateSwop: IReducer<IMatchingDetailsModelState>;

    showModalSwopTracking: IReducer<IMatchingDetailsModelState>;
    hideModalSwopTracking: IReducer<IMatchingDetailsModelState>;

    deleteSwopTrackingSuccess: IReducer<IMatchingDetailsModelState>;
    updateSwopTrackingSuccess: IReducer<IMatchingDetailsModelState>;
    createSwopTrackingSuccess: IReducer<IMatchingDetailsModelState>;
    updateSwopSuccess: IReducer<IMatchingDetailsModelState>;
    getMatchingSuccess: IReducer<IMatchingDetailsModelState>;

    getUserOverdueBalanceSuccess: IReducer<IMatchingDetailsModelState>;
    getCounterUserOverdueBalanceSuccess: IReducer<IMatchingDetailsModelState>;
  };
}

export const namespace = 'matchingDetails';

const _Model: IMatchingDetailsModelType = {
  namespace: namespace,

  state: {
    matching: null,
    swopTrackings: null,
    counterUserOverdueBalance: null,
    userOverdueBalance: null,
    currentSwop: null,
    currentOtherSwop: null,
    currentOtherSwopUser: null,
    currentSwopUser: null,
    counterSwopTrackings: null,
    currentTaskPayload: null,
    dispatching: {},
    swopTransactions: null,
    counterSwopTransactions: null,
    modalUpdateMatchingVisible: false,
    modalSwopTrackingVisible: false,
    modalUpdateSwopVisible: false,
    modalTimeElapsedVisible: false,
    modalAssignDeliveryVisible: false,
    currentSwopTracking: null,
    modalSwopTrackingType: 'create',
    currentSwopTrackingIsCounter: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/matchings/:id', pathname);
        if (match) {
          dispatch({ type: 'getMatching', payload: { id: match[1] } });
        }
      });
    },
  },

  effects: {
    *simulateSwopStatus({ payload }, { call, put, select }) {
      const { matching } = yield select((state: IConnectState) => state.matchingDetails);
      yield put({
        type: 'dispatchTaskStart',
        payload: payload,
      });
      const { success, data } = yield call(api.dispatchTask, payload);
      yield call(delay, 3000);
      yield put({
        type: 'dispatchTaskEnd',
        payload: payload,
      });
      if (success) {
        yield put({
          type: 'getMatching',
          payload: { id: matching?.id },
        });
      } else {
        throw data;
      }
    },
    *markSwopStatus({ payload }, { call, put, select }) {
      let response;
      if (!payload.isSendBack) {
        response = yield call(api.markSwopStatus, payload);
      } else {
        response = yield call(api.adminSendBack, payload);
      }

      const { success, data } = response;
      if (success) {
        const { matching } = yield select((state: IConnectState) => state.matchingDetails);
        yield put({
          type: 'getMatching',
          payload: { id: matching?.id },
        });
      } else {
        throw data;
      }
    },

    *getUserOverdueBalance({ payload }, { call, put, select }) {
      const response = yield call(api.getUserOverdueBalance, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'getUserOverdueBalanceSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *getCounterUserOverdueBalance({ payload }, { call, put, select }) {
      const response = yield call(api.getUserOverdueBalance, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'getCounterUserOverdueBalanceSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *assignDelivery({ payload }, { call, put, select }) {
      const response = yield call(api.assignDelivery, payload);
      const { success, data } = response;
      if (success) {
        const { matching } = yield select((state: IConnectState) => state.matchingDetails);
        yield put({
          type: 'hideModalAssignDelivery',
          payload: { id: matching?.id },
        });

        yield put({
          type: 'getMatching',
          payload: { id: matching?.id },
        });
      } else {
        throw data;
      }
    },
    *markAsEarlyReturnConfirmed({ payload }, { call, put, select }) {
      const response = yield call(api.markAsEarlyReturnConfirmed, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'getMatching',
          payload: { id: payload?.id },
        });
      } else {
        throw data;
      }
    },
    *markAsRetentionConfirmed({ payload }, { call, put, select }) {
      const response = yield call(api.markAsRetentionConfirmed, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'getMatching',
          payload: { id: payload?.id },
        });
      } else {
        throw data;
      }
    },
    *updateSwop({ payload }, { call, put, select }) {
      const response = yield call(api.updateSwop, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateSwopSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *fixSameLaundry({ payload }, { call, put, select }) {
      const response = yield call(api.fixSameLaundry, payload);
      const { success, data } = response;
      if (success) {
        const { matching } = yield select((state: IConnectState) => state.matchingDetails);
        yield put({
          type: 'getMatching',
          payload: { id: matching?.id },
        });
      } else {
        throw data;
      }
    },
    *fixSameReturnLaundry({ payload }, { call, put, select }) {
      const response = yield call(api.fixSameReturnLaundry, payload);
      const { success, data } = response;
      if (success) {
        const { matching } = yield select((state: IConnectState) => state.matchingDetails);
        yield put({
          type: 'getMatching',
          payload: { id: matching?.id },
        });
      } else {
        throw data;
      }
    },
    *updateMatching({ payload }, { call, put }) {
      const response = yield call(api.updateMatching, payload);
      const { success, data } = response;
      if (success) {
        yield put({ type: 'hideModalUpdateMatching' });
        yield put({
          type: 'getMatching',
          payload: { id: payload.id },
        });
      } else {
        throw data;
      }
    },
    *createSwopTracking({ payload }, { call, put }) {
      const response = yield call(api.createSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'createSwopTrackingSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *deleteSwopTracking({ payload }, { call, put }) {
      const response = yield call(api.deleteSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'deleteSwopTrackingSuccess',
          payload: payload,
        });
      } else {
        throw data;
      }
    },
    *updateSwopTracking({ payload }, { call, put }) {
      const response = yield call(api.updateSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateSwopTrackingSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *getMatching({ payload }, { call, put }) {
      const response = yield call(api.getMatching, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'getMatchingSuccess',
          payload: data,
        });

        yield put({ type: 'getSwopTrackings', payload: { id: data.swop_id } });
        yield put({ type: 'getCounterSwopTrackings', payload: { id: data.counter_swop_id } });

        yield put({ type: 'getSwopTransactions', payload: { id: data.swop_id } });
        yield put({ type: 'getCounterSwopTransactions', payload: { id: data.counter_swop_id } });

        yield put({ type: 'getUserOverdueBalance', payload: { id: data.user_id } });
        yield put({ type: 'getCounterUserOverdueBalance', payload: { id: data.counter_id } });
      } else {
        throw data;
      }
    },
    *getSwopTrackings({ payload }, { call, put }) {
      const response = yield call(api.getSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swopTrackings: data?.records?.reverse(),
          },
        });
      } else {
        throw data;
      }
    },
    *getCounterSwopTrackings({ payload }, { call, put }) {
      const response = yield call(api.getSwopTracking, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            counterSwopTrackings: data?.records?.reverse(),
          },
        });
      } else {
        throw data;
      }
    },
    *getSwopTransactions({ payload }, { call, put }) {
      const response = yield call(api.getSwopTransactions, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            swopTransactions: data?.records,
          },
        });
      } else {
        throw data;
      }
    },
    *getCounterSwopTransactions({ payload }, { call, put }) {
      const response = yield call(api.getSwopTransactions, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            counterSwopTransactions: data?.records,
          },
        });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    dispatchTaskStart(state, { payload }) {
      state.dispatching[payload.name] = true;
      return state;
    },
    dispatchTaskEnd(state, { payload }) {
      state.dispatching[payload.name] = false;
      state.modalTimeElapsedVisible = false;
      return state;
    },
    getUserOverdueBalanceSuccess(state, { payload }) {
      state.userOverdueBalance = payload;
      return state;
    },
    getCounterUserOverdueBalanceSuccess(state, { payload }) {
      state.counterUserOverdueBalance = payload;
      return state;
    },
    showModalTimeElapsed(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalTimeElapsedVisible: true,
      };
    },
    hideModalTimeElapsed(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalTimeElapsedVisible: false,
        currentTaskPayload: null,
      };
    },
    getMatchingSuccess(state, { payload }) {
      const matching = payload as IMatching;
      state.matching = matching;
      state.matching.swop.user = matching.user;
      state.matching.counter_swop.user = matching.counter;
      state.modalAssignDeliveryVisible = false;
      return state;
    },
    deleteSwopTrackingSuccess(state, { payload }) {
      if (payload.is_counter) {
        const index = state.counterSwopTrackings?.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.counterSwopTrackings = state.counterSwopTrackings.filter(
            (item) => item.id !== payload.id,
          );
        }
      } else {
        const index = state.swopTrackings?.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.swopTrackings = state.swopTrackings.filter((item) => item.id !== payload.id);
        }
      }

      return state;
    },
    updateSwopTrackingSuccess(state, { payload }) {
      if (payload.is_counter) {
        const index = state.counterSwopTrackings?.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.counterSwopTrackings[index] = payload;
        }
      } else {
        const index = state.swopTrackings?.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.swopTrackings[index] = payload;
        }
      }
      state.modalSwopTrackingVisible = false;
      return state;
    },
    createSwopTrackingSuccess(state, { payload }) {
      if (payload.is_counter) {
        state.counterSwopTrackings.push(payload);
      } else {
        state.swopTrackings.push(payload);
      }
      state.modalSwopTrackingVisible = false;
      state.currentSwopTracking = null;
      return state;
    },
    updateSwopSuccess(state, { payload }) {
      if (payload.is_counter) {
        state.matching.counter_swop = payload;
      } else {
        state.matching.swop = payload;
      }
      state.modalUpdateSwopVisible = false;
      return state;
    },
    showModalUpdateMatching(state, { payload }) {
      return { ...state, ...payload, modalUpdateMatchingVisible: true };
    },

    hideModalUpdateMatching(state) {
      return { ...state, currentSwopTracking: null, modalUpdateMatchingVisible: false };
    },
    showModalUpdateSwop(state, { payload }) {
      return { ...state, ...payload, modalUpdateSwopVisible: true };
    },

    hideModalUpdateSwop(state) {
      return { ...state, currentSwop: null, modalUpdateSwopVisible: false };
    },

    showModalSwopTracking(state, { payload }) {
      return { ...state, ...payload, modalSwopTrackingVisible: true };
    },

    hideModalSwopTracking(state) {
      return { ...state, modalSwopTrackingVisible: false, currentSwopTracking: null };
    },
    showModalAssignDelivery(state, { payload }) {
      return { ...state, ...payload, modalAssignDeliveryVisible: true };
    },

    hideModalAssignDelivery(state) {
      return {
        ...state,
        modalAssignDeliveryVisible: false,
        currentSwop: null,
        currentOtherSwop: null,
      };
    },
  },
};

const Model: IMatchingDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
