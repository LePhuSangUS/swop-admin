import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { router } from 'utils';
import List from './components/List';
import Modal from './components/Modal';
import ModalAddLookDress from './components/ModalAddLookDress';

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

  renderList() {
    const { dispatch, app, looks, loading } = this.props;
    const fetching = loading.effects['looks/getListLook'];
    return (
      <List
        dataSource={looks?.list}
        constants={app?.appConstants}
        loading={fetching}
        pagination={looks?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'looks/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onRemoveItem={(id) => {
          dispatch({
            type: 'looks/removeLook',
            payload: {
              id,
            },
          });
        }}
        onAddLookDress={(record) => {
          dispatch({
            type: 'looks/showModalAddLookDress',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
      />
    );
  }

  renderModalAddLook() {
    const { dispatch, app, looks, loading } = this.props;

    return (
      <ModalAddLookDress
        look={looks?.currentItem}
        constants={app?.appConstants}
        visible={looks?.modalAddLookDressVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`looks/addLookDress`]}
        title="Add Dress"
        onAccept={(data) => {
          dispatch({
            type: `looks/addLookDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'looks/hideModalAddLookDress',
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, app, looks, loading } = this.props;

    return (
      <Modal
        item={looks?.currentItem}
        constants={app?.appConstants}
        visible={looks?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`looks/updateLook`]}
        title="Update Look"
        onAccept={(data) => {
          dispatch({
            type: `looks/updateLook`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'looks/hideModal',
          });
        }}
      />
    );
  }

  render() {
    return (
      <Page inner={true}>
        {this.renderList()}
        {this.renderModal()}
        {this.renderModalAddLook()}
      </Page>
    );
  }
}

export default connect(({ looks, app, loading }: IConnectState) => ({
  looks,
  app,
  loading,
}))(Collections);
