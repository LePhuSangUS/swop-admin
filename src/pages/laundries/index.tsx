import React, { PureComponent } from 'react';
import { Page } from 'components';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import Modal from './components/Modal';
import ModalActivateLaundry from './components/ModalActivateLaundry';
import NumberCard from 'components/NumberCard';
import { formatMoney } from 'utils/money';

class Laundry extends PureComponent<IConnectState> {
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
    const { location, dispatch, laundries } = this.props;
    const { query } = location;

    return (
      <Filter
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: laundries?.pagination?.current || 1,
            limit: laundries?.pagination?.pageSize || 10,
          });
        }}
        onAdd={() => {
          dispatch({
            type: 'laundries/showModal',
            payload: {
              modalType: 'create',
            },
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, laundries, loading } = this.props;
    return (
      <List
        dataSource={laundries?.list}
        loading={loading.effects['laundries/getListLaundry']}
        pagination={laundries?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onActivate={(record) => {
          dispatch({
            type: 'laundries/showModalActivateLaundry',
            payload: {
              currentItem: record,
            },
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'laundries/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onDeleteItem={(id) => {
          dispatch({
            type: 'laundries/deleteLaundry',
            payload: id,
          });
        }}
      />
    );
  }

  renderModalActivateLaundry() {
    const { dispatch, laundries, loading } = this.props;

    return (
      <ModalActivateLaundry
        item={laundries?.currentItem}
        visible={laundries?.modalActivateVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects['laundries/activateLaundry']}
        title={`Re-activate Laundry`}
        onAccept={(data) => {
          dispatch({
            type: 'laundries/activateLaundry',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'laundries/hideModalActivateLaundry',
          });
        }}
      />
    );
  }

  renderModal() {
    const { app, dispatch, laundries, loading } = this.props;

    return (
      <Modal
        constant={app?.appConstants}
        item={laundries?.modalType === 'create' ? null : laundries?.currentItem}
        visible={laundries?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`laundries/${laundries?.modalType}Laundry`]}
        title={`${laundries?.modalType === 'create' ? 'Create Laundry' : 'Update Laundry'}`}
        onAccept={(data) => {
          dispatch({
            type: `laundries/${laundries?.modalType}Laundry`,
            payload: data,
          }).then(() => {
            dispatch({
              type: 'laundries/hideModal',
            });
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'laundries/hideModal',
          });
        }}
      />
    );
  }

  renderStats() {
    const { laundries, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['laundries/getLaundryStats']}
            subTitle="New Laundries Added Yesterday"
            number={laundries?.laundryStats?.total_new_added || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['laundries/getLaundryStats']}
            subTitle="Clothes Sent To Laundries Yesterday"
            number={laundries?.laundryStats?.total_received_dress || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['laundries/getLaundryStats']}
            subTitle="Laundries' Revenues Yesterday"
            number={laundries?.laundryStats?.total_revenue}
            formattingFn={(value) => (value ? formatMoney(value) : '$0')}
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
        {this.renderModalActivateLaundry()}
      </Page>
    );
  }
}

export default connect(({ app, laundries, loading }: IConnectState) => ({
  app,
  laundries,
  loading,
}))(Laundry);
