import modelExtend from 'dva-model-extend';
import store from 'store';
import { IEffect, IModel, IReducer, IPaginationParam } from 'types';
import { IBlog } from 'types';
import { config, getPagination, pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';
import api from 'services/api';

export interface IBlogsModelState {
  currentItem: IBlog;
  filter: {};
  list: IBlog[];
  pagination: IPaginationParam;
}

const filterKey = 'blogs_filter';

export const namespace = 'blogs';

export interface IBlogsModelType extends IModel<IBlogsModelState> {
  namespace: string;
  effects: {
    getListBlog: IEffect;
    publishBlog: IEffect;
    draftBlog: IEffect;
  };
  reducers: {
    publishBlogSuccess: IReducer<IBlogsModelState>;
    draftBlogSuccess: IReducer<IBlogsModelState>;
  };
}

const _Model: IBlogsModelType = {
  namespace: namespace,
  state: {
    currentItem: null,
    filter: {},
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: config.defaultPageSizeSmall,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/blogs', location.pathname)) {
          // @ts-ignore
          const payload = location.query;
          const defaultFilter = store.get(filterKey) || {};
          dispatch({
            type: 'getListBlog',
            payload: {
              page: 1,
              limit: config.defaultPageSizeSmall,
              ...payload,
              filter: defaultFilter,
            },
          });
        }
      });
    },
  },

  effects: {
    *getListBlog({ payload }, { call, put }) {
      const { success, data } = yield call(api.getListBlog, payload);
      if (success && data) {
        const pagination = getPagination(data);
        yield put({
          type: 'updateState',
          payload: {
            list: data.records,
            pagination,
            filter: payload,
            modalFilterVisible: false,
          },
        });
      }
    },
    *publishBlog({ payload = {} }, { call, put, select }) {
      const { success, data } = yield call(api.publishBlog, payload);
      if (success && data) {
        yield put({
          type: 'publishBlogSuccess',
          payload,
        });
      }
    },
    *draftBlog({ payload = {} }, { call, put }) {
      const { success, data } = yield call(api.draftBlog, payload);
      if (success && data) {
        yield put({
          type: 'draftBlogSuccess',
          payload,
        });
      }
    },
  },

  reducers: {
    publishBlogSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].status = 'published';
      }
      return state;
    },
    draftBlogSuccess(state, { payload }) {
      const index = state.list?.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.list[index].status = 'draft';
      }
      return state;
    },
  },
};

const Model: IBlogsModelType = modelExtend(updateModel, _Model);
export default Model;
