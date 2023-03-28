import React from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Col, Row } from 'antd';
import { IConnectState } from 'types';
import { config, router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import Modal from './components/Modal';
import ModalFilter from './components/ModalFilter';
import NumberCard from 'components/NumberCard';

class Swops extends React.PureComponent<IConnectState> {
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
    const { location, dispatch, swops } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(swops?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'swops/showModalFilter',
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, swops, loading, app } = this.props;

    return (
      <List
        constants={app?.appConstants}
        dataSource={swops?.list}
        loading={loading.effects['swops/getListSwop']}
        pagination={swops?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'swops/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onDeleteItem={(id) => {
          dispatch({
            type: 'swops/deleteSwop',
            payload: {
              id: id,
            },
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, swops, loading } = this.props;

    return (
      <Modal
        item={swops?.currentItem}
        visible={swops?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`swops/updateSwop`]}
        title="Update Swop"
        onAccept={(data) => {
          dispatch({
            type: 'swops/updateSwop',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'swops/hideModal',
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, swops, loading, app } = this.props;

    return (
      <ModalFilter
        filter={swops?.filter}
        constants={app?.appConstants}
        item={swops?.currentItem}
        visible={swops?.modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`swops/filterSwop`]}
        title="Filter Swops"
        onAccept={(data) => {
          dispatch({
            type: 'swops/filterSwop',
            payload: {
              ...data,
              limit: swops?.pagination?.pageSize || config.defaultPageSizeSmall,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'swops/hideModalFilter',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'swops/filterSwop',
            payload: {
              isClear: true,
              page: swops?.pagination?.current,
              limit: swops?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderStats() {
    const { swops, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['swops/getSwopStats']}
            subTitle="New Swops Accepted Yesterday"
            number={swops?.swopStats?.total_swop_accepted_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['swops/getSwopStats']}
            subTitle="New Swops Defaulted Yesterday"
            number={swops?.swopStats?.total_swop_defaulted_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['swops/getSwopStats']}
            subTitle="New UnSwop Finished Yesterday"
            number={swops?.swopStats?.total_swop_completed_yesterday || 0}
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
      </Page>
    );
  }
}

export default connect(({ swops, app, loading }: IConnectState) => ({ swops, app, loading }))(
  Swops,
);
