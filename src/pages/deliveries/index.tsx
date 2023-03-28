import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { Row, Col } from 'antd';
import { config, router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import ModalAssignDelivery from './components/ModalAssignDelivery';
import ModalFilter from './components/ModalFilter';
import NumberCard from 'components/NumberCard';
import ModalUpdateDelivery from './components/ModalUpdateDelivery';

class Matchings extends PureComponent<IConnectState> {
  handleRefresh = (newQuery?: any) => {
    const { location } = this.props;
    const { query, pathname } = location;

    router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' },
      ),
    });
  };

  renderFilter() {
    const { location, deliveries, dispatch } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(deliveries?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilter={() => {
          dispatch({
            type: 'deliveries/showModalFilter',
          });
        }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: deliveries?.pagination?.current || 1,
            limit: deliveries?.pagination?.pageSize || 10,
          });
        }}
      />
    );
  }

  renderModalUpdateDelivery() {
    const { dispatch, deliveries, loading } = this.props;

    return (
      <ModalUpdateDelivery
        item={deliveries?.currentItem}
        visible={deliveries?.modalUpdateDeliveryVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`deliveries/updateDelivery`]}
        title="Update Delivery"
        onAccept={(data) => {
          dispatch({
            type: 'deliveries/updateDelivery',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'deliveries/hideModalUpdateDelivery',
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, app, deliveries, loading } = this.props;

    return (
      <ModalFilter
        filter={deliveries?.filter}
        constants={app?.appConstants}
        visible={deliveries?.modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`deliveries/filterDelivery`]}
        title={'Filter Deliveries'}
        onAccept={(data) => {
          dispatch({
            type: `deliveries/filterDelivery`,
            payload: {
              ...data,
              limit: deliveries?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'deliveries/hideModalFilter',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'deliveries/filterDelivery',
            payload: {
              isClear: true,
              page: deliveries?.pagination?.current,
              limit: deliveries?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, deliveries, loading } = this.props;

    return (
      <ModalAssignDelivery
        item={deliveries?.currentItem}
        visible={deliveries?.modalAssignDeliveryVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`deliveries/assignDelivery`]}
        title="Assign Delivery"
        onAccept={(data) => {
          dispatch({
            type: 'deliveries/assignDelivery',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'deliveries/hideModalAssignDelivery',
          });
        }}
      />
    );
  }

  renderList() {
    const { deliveries, app, loading, dispatch } = this.props;

    return (
      <List
        constants={app?.appConstants}
        dataSource={deliveries?.list}
        loading={loading.effects['deliveries/getListDelivery']}
        pagination={deliveries?.pagination}
        rowSelection={null}
        onUpdate={(record) => {
          dispatch({
            type: 'deliveries/showModalUpdateDelivery',
            payload: { currentItem: record },
          });
        }}
        onAssign={(record) => {
          dispatch({
            type: 'deliveries/showModalAssignDelivery',
            payload: { currentItem: record },
          });
        }}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
      />
    );
  }

  renderStats() {
    const { deliveries, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['deliveries/getDeliveryStats']}
            subTitle="Deliveries Today"
            number={deliveries?.deliveryStats?.total_delivery_today || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['deliveries/getDeliveryStats']}
            subTitle="Deliveries Due Tomorrow"
            number={deliveries?.deliveryStats?.total_delivery_due_tomorrow || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['deliveries/getDeliveryStats']}
            subTitle="Tomorrow Deliveries Unassigned"
            number={deliveries?.deliveryStats?.total_tomorrow_delivery_unassigned || 0}
          />
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Page inner={true}>
        {this.renderStats()}
        {this.renderFilter()}
        {this.renderList()}
        {this.renderModal()}
        {this.renderModalFilter()}
        {this.renderModalUpdateDelivery()}
      </Page>
    );
  }
}

export default connect(({ app, deliveries, loading }: IConnectState) => ({
  app,
  deliveries,
  loading,
}))(Matchings);
