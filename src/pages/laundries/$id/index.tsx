import React from 'react';
import { Col, Row } from 'antd';
import { Coordinate, Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import LaundryDetails from './components/LaundryDetails';
import Header from './components/Header';
import ListSwop from './components/ListSwop';
import LaundryPrice from './components/LaundryPrice';
import ModalLaundryPrice from './components/ModalLaundryPrice';
import ListDelivery from './components/ListDelivery';
import ModalAssignDelivery from './components/ModalAssignDelivery';
import ModalUpdateDelivery from './components/ModalUpdateDelivery';

class Laundry extends React.PureComponent<IConnectState> {
  renderModalLaundryPrice() {
    const { dispatch, laundryDetails, loading } = this.props;

    return (
      <ModalLaundryPrice
        item={laundryDetails?.currentLaundryPrice}
        visible={laundryDetails?.modalLaundryPriceVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`laundryDetails/updateLaundryPrice`]}
        title="Update Laundry Price"
        onAccept={(data) => {
          dispatch({
            type: `laundryDetails/updateLaundryPrice`,
            payload: {
              id: laundryDetails?.laundry?.id,
              ...data,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'laundryDetails/hideModalLaundryPrice',
          });
        }}
      />
    );
  }

  renderModalAssignDelivery() {
    const { dispatch, laundryDetails, loading } = this.props;

    return (
      <ModalAssignDelivery
        item={laundryDetails?.currentDelivery}
        visible={laundryDetails?.modalAssignDeliveryVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`laundryDetails/assignDelivery`]}
        title="Assign Delivery"
        onAccept={(data) => {
          dispatch({
            type: 'laundryDetails/assignDelivery',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'laundryDetails/hideModalAssignDelivery',
          });
        }}
      />
    );
  }

  renderModalUpdateDelivery() {
    const { dispatch, laundryDetails, loading } = this.props;

    return (
      <ModalUpdateDelivery
        item={laundryDetails?.currentDelivery}
        visible={laundryDetails?.modalUpdateDeliveryVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`laundryDetails/updateDelivery`]}
        title="Update Delivery"
        onAccept={(data) => {
          dispatch({
            type: 'laundryDetails/updateDelivery',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'laundryDetails/hideModalUpdateDelivery',
          });
        }}
      />
    );
  }

  render() {
    const { app, laundryDetails, loading, dispatch } = this.props;

    return (
      <Page inner={true} loading={loading.effects['laundryDetails/getLaundry']}>
        <Header laundry={laundryDetails?.laundry} />
        <br />
        <Row gutter={[24, 24]}>
          <Col lg={{ offset: 0, span: 8 }}>
            <Coordinate
              activeKeys={['1']}
              title="Location"
              coordinate={laundryDetails?.laundry?.coordinate}
            />
            <br />

            <LaundryDetails laundry={laundryDetails?.laundry} />
          </Col>
          <Col lg={{ offset: 1, span: 15 }}>
            <ListDelivery
              onUpdate={(record) => {
                dispatch({
                  type: 'laundryDetails/showModalUpdateDelivery',
                  payload: { currentDelivery: record },
                });
              }}
              onAssign={(record) => {
                dispatch({
                  type: 'laundryDetails/showModalAssignDelivery',
                  payload: { currentDelivery: record },
                });
              }}
              constants={app?.appConstants}
              dataSource={laundryDetails?.deliveries?.list}
              loading={loading.effects['laundryDetails/getListDelivery']}
              pagination={laundryDetails?.deliveries?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'laundryDetails/getListDelivery',
                  payload: {
                    laundry_id: laundryDetails?.laundry?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
            />
            <br />

            <LaundryPrice
              dataSource={laundryDetails?.laundry?.prices}
              loading={loading.effects['laundryDetails/getLaundry']}
              onEditItem={(price) => {
                dispatch({
                  type: 'laundryDetails/showModalLaundryPrice',
                  payload: {
                    currentLaundryPrice: price,
                  },
                });
              }}
            />
            <br />

            <ListSwop
              constants={app?.appConstants}
              dataSource={laundryDetails?.swops?.list}
              loading={loading.effects['laundryDetails/getSwopAssignedToLaundry']}
              pagination={laundryDetails?.swops?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'laundryDetails/getSwopAssignedToLaundry',
                  payload: {
                    id: laundryDetails?.laundry?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
            />
            <br />
          </Col>
        </Row>
        {this.renderModalLaundryPrice()}
        {this.renderModalAssignDelivery()}
        {this.renderModalUpdateDelivery()}
      </Page>
    );
  }
}

export default connect(({ app, laundryDetails, loading }: IConnectState) => ({
  app,
  laundryDetails,
  loading,
}))(Laundry);
