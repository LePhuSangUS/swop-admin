import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { Card, Row, Col, Button } from 'antd';
import { IConnectState } from 'types';
import List from './components/List';
import ModalFilter from './components/ModalFilter';

class Logistics extends PureComponent<IConnectState> {
  renderDropStops() {
    const { logistics, app, loading, dispatch } = this.props;

    return (
      <List
        constants={app?.appConstants}
        dataSource={logistics?.dropStops}
        loading={loading.effects['logistics/getDropStops']}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={null}
        onChange={(page) => {
          dispatch({
            type: 'logistics/getDropStops',
            payload: { page: page.current, limit: page.pageSize },
          });
        }}
      />
    );
  }

  renderPickStops() {
    const { logistics, app, loading, dispatch } = this.props;

    return (
      <List
        constants={app?.appConstants}
        dataSource={logistics?.pickStops}
        loading={loading.effects['logistics/getPickStops']}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={null}
        onChange={(page) => {
          dispatch({
            type: 'logistics/getPickStops',
            payload: { page: page.current, limit: page.pageSize },
          });
        }}
      />
    );
  }

  renderModalExportDropStops() {
    const { dispatch, app, logistics, loading } = this.props;

    return (
      <ModalFilter
        filter={logistics?.dropStopsFilter}
        constants={app?.appConstants}
        visible={logistics?.modalExportDropStopsVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`logistics/exportDropStops`]}
        title={'Export Drop Stops'}
        onAccept={(data) => {
          dispatch({
            type: 'logistics/exportDropStops',
            payload: data,
          })?.then(() => {
            dispatch({
              type: 'logistics/hideModalExportDropStops',
            });
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'logistics/hideModalExportDropStops',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'logistics/filterDropStops',
            payload: null,
          });
        }}
      />
    );
  }

  renderModalExportPickStops() {
    const { dispatch, app, logistics, loading } = this.props;

    return (
      <ModalFilter
        constants={app?.appConstants}
        filter={logistics?.pickStopsFilter}
        visible={logistics?.modalExportPickStopsVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`logistics/exportPickStops`]}
        title={'Export Pick Stops'}
        onClearFilter={() => {
          dispatch({
            type: 'logistics/filterPickStops',
            payload: null,
          });
        }}
        onAccept={(data) => {
          dispatch({
            type: 'logistics/exportPickStops',
            payload: data,
          })?.then(() => {
            dispatch({
              type: 'logistics/hideModalExportPickStops',
            });
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'logistics/hideModalExportPickStops',
          });
        }}
      />
    );
  }

  renderModalFilterDropStops() {
    const { dispatch, app, logistics, loading } = this.props;

    return (
      <ModalFilter
        filter={logistics?.dropStopsFilter}
        constants={app?.appConstants}
        visible={logistics?.modalFilterDropStopsVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`logistics/getDropStops`]}
        title={'Filter Drop Stops'}
        onAccept={(data) => {
          dispatch({
            type: 'logistics/getDropStops',
            payload: data,
          })?.then(() => {
            dispatch({
              type: 'logistics/hideModalFilterDropStops',
            });
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'logistics/hideModalFilterDropStops',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'logistics/filterDropStops',
            payload: null,
          });
        }}
      />
    );
  }

  renderModalFilterPickStops() {
    const { dispatch, app, logistics, loading } = this.props;

    return (
      <ModalFilter
        constants={app?.appConstants}
        filter={logistics?.pickStopsFilter}
        visible={logistics?.modalFilterPickStopsVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`logistics/getPickStops`]}
        title={'Filter Pick Stops'}
        onClearFilter={() => {
          dispatch({
            type: 'logistics/filterPickStops',
            payload: null,
          });
        }}
        onAccept={(data) => {
          dispatch({
            type: 'logistics/filterPickStops',
            payload: data,
          })?.then(() => {
            dispatch({
              type: 'logistics/hideModalFilterPickStops',
            });
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'logistics/hideModalFilterPickStops',
          });
        }}
      />
    );
  }

  render() {
    const { dispatch, logistics } = this.props;
    return (
      <Page inner={true}>
        <Row gutter={[24, 24]}>
          <Col>
            <Card
              title="Pick - Stops"
              extra={
                <Row type="flex" gutter={[24, 24]}>
                  <Col>
                    <Button
                      type={
                        Object.values(logistics?.pickStopsFilter || {})?.length
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() => {
                        dispatch({
                          type: 'logistics/showModalFilterPickStops',
                        });
                      }}
                    >
                      Filter
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        dispatch({
                          type: 'logistics/showModalExportPickStops',
                        });
                      }}
                    >
                      Export Pick Stops
                    </Button>
                  </Col>
                </Row>
              }
            >
              {this.renderPickStops()}
            </Card>
          </Col>

          <Col>
            <Card
              title="Drop - Stops"
              extra={
                <Row type="flex" gutter={[24, 24]}>
                  <Col>
                    <Button
                      type={
                        Object.values(logistics?.dropStopsFilter || {})?.length
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() => {
                        dispatch({
                          type: 'logistics/showModalFilterDropStops',
                        });
                      }}
                    >
                      Filter
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      style={{ marginLeft: 12 }}
                      onClick={() => {
                        dispatch({
                          type: 'logistics/showModalExportDropStops',
                        });
                      }}
                    >
                      Export Drop Stops
                    </Button>
                  </Col>
                </Row>
              }
            >
              {this.renderDropStops()}
            </Card>
          </Col>
        </Row>

        {this.renderModalExportPickStops()}
        {this.renderModalExportDropStops()}
        {this.renderModalFilterPickStops()}
        {this.renderModalFilterDropStops()}
      </Page>
    );
  }
}

export default connect(({ app, logistics, loading }: IConnectState) => ({
  app,
  logistics,
  loading,
}))(Logistics);
