import store from 'store';
import config from 'utils/config';
import { stringify } from 'qs';
import { IConnectState, IMenuItem, IReducer, ITheme, IModel, ISubscription, IEffect } from 'types';
import { IWebsocketMessage, INotificationItem, IConstants } from 'types';
import { router, parseFromUrl, pathMatchRegexp } from 'utils';
import { queryLayout } from 'utils';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constants';
import { setDefaultTimezone } from 'utils/date';
import api from 'services/api';

export interface IAppModelState {
  routeList: IMenuItem[];
  locationPathname: string;
  locationQuery: any;
  theme: ITheme;
  notificationKeys: string[];
  collapsed: boolean;
  appConstants: IConstants;
  notifications: INotificationItem[];
  websocketConnected: boolean;
  websocketMessages: Array<IWebsocketMessage>;
}

export const namespace = 'app';
export interface IAppModelType extends IModel<IAppModelState> {
  namespace: string;
  effects: {
    sessionTimeout: IEffect;
    checkSession: IEffect;
    getAppConstants: IEffect;
    signOut: IEffect;
  };
  reducers: {
    updateState: IReducer<IAppModelState>;
    handleThemeChange: IReducer<IAppModelState>;
    handleCollapseChange: IReducer<IAppModelState>;
    allNotificationsRead: IReducer<IAppModelState>;
    appendWebsocketMessage: IReducer<IAppModelState>;
    clearWebsocketMessage: IReducer<IAppModelState>;
    changeWebsocketState: IReducer<IAppModelState>;
    setNotificationKey: IReducer<IAppModelState>;
  };

  subscriptions: {
    setup: ISubscription;
    setupHistory: ISubscription;
    setupRequestCancel: ISubscription;
  };
}

const AppModel: IAppModelType = {
  namespace: namespace,
  state: {
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        route: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
    websocketMessages: [],
    websocketConnected: false,
    appConstants: null,
    notificationKeys: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'checkSession' });
      dispatch({ type: 'getAppConstants' });
    },
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            // @ts-ignore
            locationQuery: location.query,
          },
        });
      });
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        // @ts-ignore
        const { cancelRequest = new Map() } = window;

        // @ts-ignore
        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE);
            cancelRequest.delete(key);
          }
        });
      });
    },
  },
  effects: {
    *checkSession({ payload }, { call, put, select }) {
      const token = store.get('token', '');
      const { locationPathname } = yield select((state: IConnectState) => state.app);
      const layout = queryLayout(config.layouts, window.location.pathname);

      setDefaultTimezone();

      if (layout !== 'public') {
        if (token === '') {
          router.push({
            pathname: '/login',
            search: stringify({
              from: locationPathname === '' ? location.pathname : locationPathname,
            }),
          });
          return;
        }
        var value = parseFromUrl(location?.search);
        if (value?.from) {
          // @ts-ignore
          router.push(value?.from);
          return;
        }

        if (pathMatchRegexp('/', location.pathname)) {
          router.push('/dashboard');
          return;
        }
        return;
      }
      router.push({
        pathname: '/login',
        search: stringify({
          from: locationPathname === '' ? location.pathname : locationPathname,
        }),
      });
      return;
    },
    *getAppConstants({ payload }, { call, put, select }) {
      const { success, data } = yield call(api.getAppConstants);

      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            appConstants: data,
          },
        });
      } else {
        throw data;
      }
    },
    *signOut({ payload }, { call, select }) {
      const { locationPathname } = yield select((state: IConnectState) => state.app);
      store.clearAll();
      router.push({
        pathname: '/login',
        search: stringify({
          from: locationPathname === '' ? location.pathname : locationPathname,
        }),
      });
    },

    *sessionTimeout({ payload }, { call, select }) {
      const { locationPathname } = yield select((state: IConnectState) => state.app);
      store.clearAll();
      router.push({
        pathname: '/login',
        search: stringify({
          from: locationPathname === '' ? location.pathname : locationPathname,
        }),
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload);
      state.theme = payload;
      return state;
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload);
      state.collapsed = payload;
      return state;
    },

    allNotificationsRead(state) {
      state.notifications = [];
      return state;
    },

    appendWebsocketMessage(state, { payload }) {
      if (state.websocketMessages?.length > 200) {
        state.websocketMessages = [];
      }
      state.websocketMessages?.unshift(payload);
      return state;
    },
    setNotificationKey(state, { payload }) {
      const index = state.notificationKeys?.indexOf(payload);
      if (index === -1) {
        state.notificationKeys.unshift(payload);
      }
      return state;
    },

    clearWebsocketMessage(state, { payload }) {
      state.websocketMessages = [];
      return state;
    },

    changeWebsocketState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default AppModel;
