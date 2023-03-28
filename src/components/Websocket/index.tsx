import React from 'react';
import store from 'store';
import { message } from 'antd';
import useWebSocket from 'react-use-websocket';
import { IConnectState } from 'types';

const Websocket: React.FC<IConnectState> = (props) => {
  const token = store.get('token');
  const user = store.get('user');

  const { dispatch, app } = props;

  const { lastJsonMessage: msg, readyState } = useWebSocket(WS_URL, {
    share: true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    retryOnError: true,
    onError: (event) => {},
    onClose: (event) => {},
    onReconnectStop: (value) => {},
    queryParams: {
      token,
    },
    shouldReconnect: (event) => true,
  });

  React.useEffect(() => {
    dispatch({
      type: 'ws/changeWebsocketState',
      payload: {
        websocketState: readyState,
      },
    });
  }, [readyState]);

  React.useEffect(() => {
    if (!msg) {
      return;
    }
    const isOwner =
      typeof msg.to_user?.id === 'string' && msg.to_user?.id !== '' && msg.to_user?.id === user?.id;
    if (!isOwner) {
      return;
    }

    try {
      if (
        typeof msg?.to_user?.id === 'string' &&
        msg.data.message !== '' &&
        msg?.to_user?.id !== user?.id
      ) {
        return;
      }

      if (typeof msg?.data?.message === 'string' && msg.data.message !== '') {
        message.info(msg.data?.message);
      }

      dispatch({
        type: 'app/appendWebsocketMessage',
        payload: msg,
      });

      switch (msg?.type) {
        case 'pick_delivery_stops_exported':
        case 'drop_delivery_stops_exported':
          dispatch({
            type: 'app/removeNotificationKey',
            payload: msg.data?.key,
          });
          if (typeof msg?.data?.link === 'string' && msg?.data?.link !== '') {
            window.open(msg?.data?.link, '__blank');
          }
          break;
      }
    } catch (error) {}
  }, [msg]);

  return null;
};

export default Websocket;
