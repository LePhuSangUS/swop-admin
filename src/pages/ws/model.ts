import modelExtend from 'dva-model-extend';
import { IConnectState, IEffect, IModel, IReducer } from 'types';
import { updateModel } from 'utils/models';

export interface IWebsocketModelState {}

export interface IWebsocketModelType extends IModel<IWebsocketModelState> {
  namespace: 'ws';
  effects: {};
  reducers: {};
}

const _UserModel: IWebsocketModelType = {
  namespace: 'ws',
  state: {},

  subscriptions: {},

  effects: {},

  reducers: {},
};

const UserModel: IWebsocketModelType = modelExtend(updateModel, _UserModel);
export default UserModel;
