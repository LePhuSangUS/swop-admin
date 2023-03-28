import modelExtend from 'dva-model-extend';
import api from 'services/api';
import { IEffect, IModel, IBlog, IReducer } from 'types';
import { pathMatchRegexp } from 'utils';
import { updateModel } from 'utils/models';

export interface IBlogDetailsModelState {
  blog: IBlog;
}

export interface IBlogDetailsModelType extends IModel<IBlogDetailsModelState> {
  effects: {
    getBlog: IEffect;
    updateBlog: IEffect;
    publishBlog: IEffect;
    draftBlog: IEffect;
  };
  reducers: {
    updateBlogSuccess: IReducer<IBlogDetailsModelState>;
    publishBlogSuccess: IReducer<IBlogDetailsModelState>;
    draftBlogSuccess: IReducer<IBlogDetailsModelState>;
  };
}

export const namespace = 'blogDetails';

const _Model: IBlogDetailsModelType = {
  namespace: namespace,

  state: {
    blog: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/blogs/:id', pathname);
        if (match && match[1] !== 'create') {
          dispatch({
            type: 'getBlog',
            payload: {
              id: match[1],
            },
          });
        }
      });
    },
  },

  effects: {
    *getBlog({ payload }, { call, put }) {
      const response = yield call(api.getBlog, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            blog: data,
          },
        });
      } else {
        throw data;
      }
    },
    *updateBlog({ payload }, { call, put }) {
      const response = yield call(api.updateBlog, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'updateBlogSuccess',
          payload: data,
        });
      } else {
        throw data;
      }
    },
    *publishBlog({ payload }, { call, put }) {
      const response = yield call(api.publishBlog, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'publishBlogSuccess',
          payload,
        });
      } else {
        throw data;
      }
    },
    *draftBlog({ payload }, { call, put }) {
      const response = yield call(api.draftBlog, payload);
      const { success, data } = response;
      if (success) {
        yield put({
          type: 'draftBlogSuccess',
          payload,
        });
      } else {
        throw data;
      }
    },
  },
  reducers: {
    updateBlogSuccess(state, { payload }) {
      state.blog.content = payload.content;
      return state;
    },
    publishBlogSuccess(state, { payload }) {
      state.blog.status = 'published';
      return state;
    },
    draftBlogSuccess(state, { payload }) {
      state.blog.status = 'draft';
      return state;
    },
  },
};

const Model: IBlogDetailsModelType = modelExtend(updateModel, _Model);
export default Model;
