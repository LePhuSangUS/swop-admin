import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Row, Col } from 'antd';
import { IConnectState } from 'types';
import { config, router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import Modal from './components/Modal';
import ModalFilter from './components/ModalFilter';
import NumberCard from 'components/NumberCard';

class Dresses extends PureComponent<IConnectState> {
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
    const { location, dispatch, dresses } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(dresses?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: dresses?.pagination?.current || 1,
            limit: dresses?.pagination?.pageSize || 10,
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'dresses/showModalFilter',
            payload: {
              filter: dresses?.filter,
            },
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, app, dresses, loading } = this.props;
    const fetching =
      loading.effects['dresses/getListDress'] ||
      loading.effects['dresses/activateDress'] ||
      loading.effects['dresses/deactivateDress'] ||
      loading.effects['dresses/archiveDress'] ||
      loading.effects['dresses/unArchiveDress'];
    return (
      <List
        dataSource={dresses?.list}
        constants={app?.appConstants}
        loading={fetching}
        pagination={dresses?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onActivate={(id) => {
          dispatch({
            type: 'dresses/activateDress',
            payload: { id },
          });
        }}
        onDeactivate={(id) => {
          dispatch({
            type: 'dresses/deactivateDress',
            payload: { id },
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'dresses/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onArchive={(id) => {
          dispatch({
            type: 'dresses/archiveDress',
            payload: { id },
          });
        }}
        onUnArchive={(id) => {
          dispatch({
            type: 'dresses/unArchiveDress',
            payload: { id },
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, app, dresses, loading } = this.props;

    return (
      <Modal
        item={dresses?.modalType === 'create' ? null : dresses?.currentItem}
        constants={app?.appConstants}
        visible={dresses?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`dresses/${dresses?.modalType}Dress`]}
        title={`${dresses?.modalType === 'create' ? 'Create Dress' : 'Update Dress'}`}
        onAccept={(data) => {
          dispatch({
            type: `dresses/${dresses?.modalType}Dress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'dresses/hideModal',
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, app, dresses, loading } = this.props;

    return (
      <ModalFilter
        filter={dresses?.filter}
        constants={app?.appConstants}
        visible={dresses?.modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`dresses/filterDress`]}
        title={'Filter Dresses'}
        onAccept={(data) => {
          dispatch({
            type: `dresses/filterDress`,
            payload: {
              ...data,
              limit: dresses?.pagination?.pageSize || config.defaultPageSizeSmall,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'dresses/hideModalFilter',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'dresses/filterDress',
            payload: {
              isClear: true,
              page: dresses?.pagination?.current,
              limit: dresses?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderStats() {
    const { dresses, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['dresses/getDressStats']}
            subTitle="New Clothes Added Yesterday"
            number={dresses?.dressStats?.total_new_added || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['dresses/getDressStats']}
            subTitle="New Swipes Yesterday"
            number={dresses?.dressStats?.total_new_swipes || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['dresses/getDressStats']}
            subTitle="New Swop Proposed Yesterday"
            number={dresses?.dressStats?.total_new_proposed || 0}
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

export default connect(({ dresses, app, loading }: IConnectState) => ({ dresses, app, loading }))(
  Dresses,
);
