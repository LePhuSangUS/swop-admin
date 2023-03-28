import modelExtend from 'dva-model-extend';
import api from 'services/api';
import {
  IEffect,
  IModel,
  IRecords,
  IMatchingExpiry,
  ISwopDropOff,
  ISwopPickUp,
  ISwopReturnDeliveryScheduled,
  ISwopReturnDropOff,
  ISwopReturnPickUpScheduled,
  ISwopReturnPickUp,
  IMatchingRetentionProposed,
  IMatchingEarlyReturnProposed,
  IMatchingReturnInitiated,
  IMatchingEarlyReturnConfirmed,
  IMatchingExtensionProposed,
  IMatchingExtensionConfirmed,
  IReducer,
  ISwopPicked,
  ISwopReturnDelivered,
  ISwopMissingLaundry,
  ISwopReady,
  IMatchingFinished,
  ISwopReturnReady,
  ISwopPickUpScheduled,
  IMatchingCompleted,
} from 'types';
import { pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface ICronModelState {
  listSwopReady: IRecords<ISwopReady>;
  listSwopReturnReady: IRecords<ISwopReturnReady>;
  listSwopPickUpScheduledIfOtherDifferent: IRecords<ISwopPickUpScheduled>;
  listSwopReadyIfOtherDifferent: IRecords<ISwopReady>;
  listSwopReturnReadyIfOtherDifferent: IRecords<ISwopReturnReady>;
  listSwopPicked: IRecords<ISwopPicked>;
  listSwopDelivered: IRecords<ISwopPicked>;
  listSwopReturnDelivered: IRecords<ISwopReturnDelivered>;
  listSwopDropOff: IRecords<ISwopDropOff>;
  listMatchingExpiry: IRecords<IMatchingExpiry>;
  listMatchingFinished: IRecords<IMatchingFinished>;
  listSwopPickUp: IRecords<ISwopPickUp>;
  listSwopReturnDropOff: IRecords<ISwopReturnDropOff>;
  listSwopReturnPickUpScheduled: IRecords<ISwopReturnPickUpScheduled>;
  listSwopReturnPickUp: IRecords<ISwopReturnPickUp>;
  listSwopMissingLaundry: IRecords<ISwopMissingLaundry>;
  listMatchingCompleted: IRecords<IMatchingCompleted>;
  listMatchingRetentionProposed: IRecords<IMatchingRetentionProposed>;
  listMatchingEarlyReturnProposed: IRecords<IMatchingEarlyReturnProposed>;
  listMatchingEarlyReturnConfirmed: IRecords<IMatchingEarlyReturnConfirmed>;
  listMatchingReturnInitiated: IRecords<IMatchingReturnInitiated>;
  listMatchingReturnInitiatedForChat: IRecords<IMatchingReturnInitiated>;
  listMatchingCompletedForChat: IRecords<IMatchingReturnInitiated>;
  listMatchingExtensionProposed: IRecords<IMatchingExtensionProposed>;
  listMatchingExtensionConfirmed: IRecords<IMatchingExtensionConfirmed>;

  modalTimeElapsedVisible: boolean;
  currentTaskName: string;
  dispatching: { [key: string]: boolean };
}

export const namespace = 'cron';

export interface ICronModelType extends IModel<ICronModelState> {
  namespace: string;
  effects: {
    dispatchTask: IEffect;
    getListSwopReady: IEffect;
    getListSwopReadyIfOtherDifferent: IEffect;
    getListSwopReturnReadyIfOtherDifferent: IEffect;
    getListSwopReturnReadyScheduledIfOtherDifferent: IEffect;
    getListSwopPickUpScheduledIfOtherDifferent: IEffect;
    getListSwopDropOff: IEffect;
    getListSwopReturnReady: IEffect;
    getListMatchingExpiry: IEffect;
    getListSwopPickUp: IEffect;
    getListSwopPicked: IEffect;
    getListSwopDelivered: IEffect;
    getListSwopReturnDelivered: IEffect;
    getListSwopReturnDropOff: IEffect;
    getListSwopReturnPickUpScheduled: IEffect;
    getListSwopReturnPickUp: IEffect;
    getListMatchingCompleted: IEffect;
    getListMatchingFinished: IEffect;
    getListMatchingRetentionProposed: IEffect;
    getListMatchingEarlyReturnProposed: IEffect;
    getListMatchingEarlyReturnConfirmed: IEffect;
    getListMatchingReturnInitiated: IEffect;
    getListMatchingReturnInitiatedForChat: IEffect;
    getListMatchingCompletedForChat: IEffect;
    getListMatchingExtensionProposed: IEffect;
    getListMatchingExtensionConfirmed: IEffect;
  };
  reducers: {
    dispatchTaskStart: IReducer<ICronModelState>;
    dispatchTaskEnd: IReducer<ICronModelState>;

    showModalTimeElapsed: IReducer<ICronModelState>;
    hideModalTimeElapsed: IReducer<ICronModelState>;
  };
}

const _CronModel: ICronModelType = {
  namespace: namespace,
  state: {
    listSwopReady: null,
    listSwopReturnReady: null,
    listSwopReadyIfOtherDifferent: null,
    listSwopReturnReadyIfOtherDifferent: null,
    listSwopPickUpScheduledIfOtherDifferent: null,
    listSwopPicked: null,
    listSwopDelivered: null,
    listSwopReturnDelivered: null,
    listMatchingExpiry: null,
    listSwopDropOff: null,
    listSwopPickUp: null,
    listMatchingCompleted: null,
    listSwopReturnDropOff: null,
    listSwopReturnPickUpScheduled: null,
    listSwopReturnPickUp: null,
    listSwopMissingLaundry: null,
    listMatchingRetentionProposed: null,
    listMatchingEarlyReturnProposed: null,
    listMatchingEarlyReturnConfirmed: null,
    listMatchingReturnInitiated: null,
    listMatchingReturnInitiatedForChat: null,
    listMatchingCompletedForChat: null,
    listMatchingExtensionConfirmed: null,
    listMatchingExtensionProposed: null,
    listMatchingFinished: null,

    modalTimeElapsedVisible: false,
    currentTaskName: '',
    dispatching: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathMatchRegexp('/cron', pathname)) {
          // @ts-ignore

          dispatch({ type: 'getListSwopReady' });
          dispatch({ type: 'getListSwopReturnReady' });
          dispatch({ type: 'getListSwopReadyIfOtherDifferent' });
          dispatch({ type: 'getListSwopReturnReadyIfOtherDifferent' });
          dispatch({ type: 'getListSwopPickUpScheduledIfOtherDifferent' });
          dispatch({ type: 'getListSwopReturnReadyScheduledIfOtherDifferent' });

          dispatch({ type: 'getListSwopDropOff' });
          dispatch({ type: 'getListSwopPickUp' });
          dispatch({ type: 'getListSwopPicked' });
          dispatch({ type: 'getListSwopDelivered' });

          dispatch({ type: 'getListSwopReturnDelivered' });
          dispatch({ type: 'getListSwopReturnDropOff' });
          dispatch({ type: 'getListSwopReturnPickUpScheduled' });
          dispatch({ type: 'getListSwopReturnPickUp' });

          dispatch({ type: 'getListMatchingCompleted' });
          dispatch({ type: 'getListMatchingExpiry' });
          dispatch({ type: 'getListMatchingFinished' });
          dispatch({ type: 'getListMatchingRetentionProposed' });
          dispatch({ type: 'getListMatchingEarlyReturnProposed' });
          dispatch({ type: 'getListMatchingExtensionProposed' });
          dispatch({ type: 'getListMatchingEarlyReturnConfirmed' });
          dispatch({ type: 'getListMatchingReturnInitiated' });
          dispatch({ type: 'getListMatchingReturnInitiatedForChat' });
          dispatch({ type: 'getListMatchingCompletedForChat' });
          dispatch({ type: 'getListMatchingReturnExtensionProposed' });
          dispatch({ type: 'getListMatchingReturnExtensionConfirmed' });
        }
      });
    },
  },
  effects: {
    *dispatchTask({ payload }, { call, put }) {
      const { success, data } = yield call(api.dispatchTask, payload);

      if (success) {
      } else {
        throw data;
      }
    },
    *getListSwopPickUpScheduledIfOtherDifferent({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopPickUpScheduledIfOtherDifferent);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopPickUpScheduledIfOtherDifferent: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnReadyScheduledIfOtherDifferent({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnReadyIfOtherDifferent);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnReadyIfOtherDifferent: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReadyIfOtherDifferent({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReadyIfOtherDifferent);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReadyIfOtherDifferent: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnReadyIfOtherDifferent({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnReadyIfOtherDifferent);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnReadyIfOtherDifferent: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopDelivered({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopDelivered);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopDelivered: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingCompleted({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingCompleted);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingCompleted: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnDelivered({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnDelivered);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnDelivered: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnReady({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnReady);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnReady: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReady({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReady);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReady: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingFinished({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingFinished);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingFinished: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingExpiry({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingExpiry);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingExpiry: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopPicked({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopPicked);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopPicked: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopDropOff({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopDropOff);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopDropOff: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnPickUpScheduled({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnPickUpScheduled);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnPickUpScheduled: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopPickUp({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopPickUp);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopPickUp: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnDropOff({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnDropOff);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnDropOff: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListSwopReturnPickUp({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListSwopReturnPickUp);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listSwopReturnPickUp: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingRetentionProposed({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingRetentionProposed);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingRetentionProposed: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingCompletedForChat({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingCompletedForChat);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingCompletedForChat: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingEarlyReturnProposed({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingEarlyReturnProposed);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingEarlyReturnProposed: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingEarlyReturnConfirmed({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingEarlyReturnConfirmed);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingEarlyReturnConfirmed: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingExtensionProposed({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingExtensionProposed);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingExtensionProposed: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingExtensionConfirmed({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingExtensionConfirmed);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingExtensionConfirmed: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingReturnInitiatedForChat({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingReturnInitiatedForChat);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingReturnInitiatedForChat: data,
          },
        });
      } else {
        throw data;
      }
    },
    *getListMatchingReturnInitiated({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListMatchingReturnInitiated);

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            listMatchingReturnInitiated: data,
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
        currentTaskName: '',
      };
    },
  },
};

const CronModel: ICronModelType = modelExtend(updateModel, _CronModel);
export default CronModel;
