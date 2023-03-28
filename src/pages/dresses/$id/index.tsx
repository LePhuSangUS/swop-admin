import React from 'react';
import { Col, Row, Carousel, Card, Dropdown, Button, Icon, Menu } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import theme from 'utils/theme';
import ListSwop from './components/ListSwop';
import DressDetails from 'components/DressDetails';
import Modal from './components/Modal';

class Dress extends React.PureComponent<IConnectState> {
  handleMenuClick = (e: any) => {
    const { dispatch } = this.props;
    if (e.key === '1') {
      dispatch({
        type: 'dressDetails/showModal',
      });
    }
  };

  renderCover() {
    return (
      <Carousel
        style={{ width: '100%', height: 460, backgroundColor: theme.colors.background }}
        autoplay
      />
    );
  }
  renderModal() {
    const { dispatch, app, dressDetails, loading } = this.props;

    return (
      <Modal
        item={dressDetails?.dress}
        constants={app?.appConstants}
        visible={dressDetails?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`dressDetails/updateDress`]}
        title={'Update Dress'}
        onAccept={(data) => {
          dispatch({
            type: `dressDetails/updateDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'dressDetails/hideModal',
          });
        }}
      />
    );
  }

  render() {
    const { dressDetails, app, loading } = this.props;

    return (
      <Page inner={true} loading={loading.effects['dressDetails/getDress']}>
        <Row type="flex" justify="end">
          <Col>
            <Dropdown
              overlay={
                <Menu onClick={(e) => this.handleMenuClick(e)}>
                  <Menu.Item key="1">Update</Menu.Item>
                </Menu>
              }
            >
              <Button>
                Options <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <br />

        <Row type="flex" justify="center">
          <Col lg={{ span: 12 }} xs={{ span: 20 }}>
            <DressDetails constants={app?.appConstants} dress={dressDetails?.dress} />
          </Col>
        </Row>
        <br />
        <br />

        <Card title="Active Swops">
          <ListSwop
            constants={app.appConstants}
            dataSource={dressDetails?.activeSwops?.list}
            pagination={dressDetails?.activeSwops?.pagination}
          />
        </Card>
        <br />
        <br />

        <Card title="Available Swops">
          <ListSwop
            constants={app.appConstants}
            dataSource={dressDetails?.availableSwops?.list}
            pagination={dressDetails?.availableSwops?.pagination}
          />
        </Card>
        <br />
        <br />
        {this.renderModal()}
      </Page>
    );
  }
}

export default connect(({ dressDetails, app, loading }: IConnectState) => ({
  dressDetails,
  app,
  loading,
}))(Dress);
