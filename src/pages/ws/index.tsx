import React from 'react';
import { connect } from 'dva';
import { Page } from 'components';
import { List, Input, Row, Col, Button } from 'antd';
import { IConnectState } from 'types';
import { IWebsocketMessage } from 'types';
import styles from './index.less';

interface IState {
  messages: IWebsocketMessage[];
  connected: boolean;
}

@connect(({ app, loading }: IConnectState) => ({ app, loading }))
class WebSocket extends React.PureComponent<IConnectState, IState> {
  ws: any;
  input: any;

  state: IState = {
    messages: [],
    connected: false,
  };

  onSend = () => {
    const data = this.input?.state?.value;
    window.ws?.sendMessage(JSON.stringify(JSON.parse(data)));
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <div>{this.props.app?.websocketConnected ? 'Connected' : 'Connecting ...'}</div>
        <Button
          onClick={() => {
            this.props.dispatch({
              type: 'app/clearWebsocketMessage',
            });
          }}
        >
          Clear Logs
        </Button>
      </div>
    );
  };

  renderContent() {
    return (
      <List
        header={this.renderHeader()}
        bordered
        dataSource={this.props.app?.websocketMessages}
        className={styles.list}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={
                <div className={styles.header}>
                  <a
                    target="__blank"
                    href={`/users/${item.user_id}`}
                  >{`User ID: ${item.user_id}`}</a>
                  <span>{item.event_type}</span>
                </div>
              }
              description={
                <ul>
                  <li>{`Data    : ${JSON.stringify(item.data)}`}</li>
                  <li>{`Metadata: ${JSON.stringify(item.metadata)}`}</li>
                </ul>
              }
            />
          </List.Item>
        )}
      />
    );
  }

  render() {
    return (
      <Page inner={true}>
        {this.renderContent()}
        <br />
      </Page>
    );
  }
}

export default WebSocket;
