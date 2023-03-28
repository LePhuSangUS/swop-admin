import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import Modal from './components/Modal';
import ModalAddLook from './components/ModalAddLook';
import ListLook from './components/ListLook';

class Collections extends PureComponent<IConnectState> {
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
    const { location, dispatch, collections } = this.props;
    const { query } = location;

    return (
      <Filter
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: collections?.pagination?.current || 1,
            limit: collections?.pagination?.pageSize || 10,
          });
        }}
        onCreate={() => {
          dispatch({
            type: 'collections/showModal',
            payload: {
              modalType: 'create',
              currentItem: null,
            },
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, app, collections, loading } = this.props;
    const fetching = loading.effects['collections/getListCollection'];
    return (
      <List
        dataSource={collections?.list}
        constants={app?.appConstants}
        loading={fetching}
        pagination={collections?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'collections/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onRemoveItem={(id) => {
          dispatch({
            type: 'collections/removeCollection',
            payload: {
              id,
            },
          });
        }}
        onAddLook={(record) => {
          dispatch({
            type: 'collections/showModalAddLook',
            payload: {
              currentItem: record,
            },
          });
        }}
      />
    );
  }

  renderModalAddLook() {
    const { dispatch, app, collections, loading } = this.props;

    return (
      <ModalAddLook
        collection={collections?.currentItem}
        constants={app?.appConstants}
        visible={collections?.modalAddLookVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`collections/addLook`]}
        title="Add Look"
        onAccept={(data) => {
          dispatch({
            type: `collections/addLook`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'collections/hideModalAddLook',
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, app, collections, loading } = this.props;

    return (
      <Modal
        item={collections?.modalType === 'create' ? null : collections?.currentItem}
        constants={app?.appConstants}
        visible={collections?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`collections/${collections?.modalType}Collection`]}
        title={`${collections?.modalType === 'create' ? 'Create Collection' : 'Update Collection'}`}
        onAccept={(data) => {
          dispatch({
            type: `collections/${collections?.modalType}Collection`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'collections/hideModal',
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
        {this.renderModalAddLook()}
      </Page>
    );
  }
}

export default connect(({ collections, app, loading }: IConnectState) => ({
  collections,
  app,
  loading,
}))(Collections);
