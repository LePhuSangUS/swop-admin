import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import Modal from './components/Modal';
import FilterModal from './components/FilterModal';

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
    const { location, dispatch, reports } = this.props;
    const { query } = location;

    return (
      <Filter
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: reports?.pagination?.current || 1,
            limit: reports?.pagination?.pageSize || 10,
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'dresses/showModalFilterDress',
            payload: {
              filter: reports?.filter,
            },
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, app, reports, loading } = this.props;
    const fetching = loading.effects['reports/getListReportCount'];
    return (
      <List
        dataSource={reports?.list}
        constants={app?.appConstants}
        loading={fetching}
        pagination={reports?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onActivate={(record) => {
          dispatch({
            type: 'dresses/activateDress',
            payload: {
              id: record.id,
            },
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
        onDeleteItem={(id) => {
          dispatch({
            type: 'dresses/deleteDress',
            payload: id,
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, app, reports, loading } = this.props;

    return (
      <Modal
        item={reports?.modalType === 'create' ? null : reports?.currentItem}
        constants={app?.appConstants}
        visible={reports?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`dresses/${reports?.modalType}Dress`]}
        title={`${reports?.modalType === 'create' ? 'Create Dress' : 'Update Dress'}`}
        onAccept={(data) => {
          dispatch({
            type: `dresses/${reports?.modalType}Dress`,
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
    const { dispatch, app, reports, loading } = this.props;

    return (
      <FilterModal
        filter={reports?.filter}
        constants={app?.appConstants}
        visible={reports?.modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`dresses/filterDress`]}
        title={'Filter Dresses'}
        onAccept={(data) => {
          dispatch({
            type: `dresses/filterDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'dresses/hideModalFilterDress',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'dresses/clearFilterDress',
          });
        }}
      />
    );
  }

  render() {
    return (
      <Page inner={true}>
        {this.renderFilter()}
        {this.renderList()}
        {this.renderModal()}
        {this.renderModalFilter()}
      </Page>
    );
  }
}

export default connect(({ reports, app, loading }: IConnectState) => ({ reports, app, loading }))(
  Dresses,
);
