import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import List from './components/List';
import ModalPriceSetting from './components/ModalPriceSetting';
import ListAdmin from './components/ListAdmin';
import ModalAddAdmin from './components/ModalAddAdmin';
import ListShipper from './components/ListShipper';
import ModalAddShipper from './components/ModalAddShipper';
import ModalUpdate from './components/ModalUpdate';

class Settings extends PureComponent<IConnectState> {
  renderPriceSetting = () => {
    const { settings, dispatch } = this.props;
    return (
      <List
        dataSource={settings?.settings?.list}
        pagination={settings?.admins?.pagination}
        rowSelection={null}
        onEditItem={(record) => {
          dispatch({
            type: 'settings/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
      />
    );
  };

  renderAdmins = () => {
    const { app, settings, dispatch } = this.props;
    return (
      <ListAdmin
        constant={app?.appConstants}
        dataSource={settings?.admins?.list}
        pagination={settings?.admins?.pagination}
        rowSelection={null}
        onAdd={() => {
          dispatch({
            type: 'settings/showModalAddAdmin',
          });
        }}
        onUpdate={(record) => {
          dispatch({
            type: 'settings/showModalUpdateUser',
            payload: {
              currentUpdatingUser: record,
            },
          });
        }}
        onDelete={(record) => {
          dispatch({
            type: 'settings/deleteAdmin',
            payload: {
              id: record.id,
            },
          });
        }}
        onChange={(page) => {
          dispatch({
            type: 'settings/getListAdmin',
            payload: {
              page: page.current,
              limit: page.pageSize,
            },
          });
        }}
      />
    );
  };

  renderShippers = () => {
    const { app, settings, dispatch } = this.props;
    return (
      <ListShipper
        constant={app?.appConstants}
        dataSource={settings?.shippers?.list}
        pagination={settings?.shippers?.pagination}
        rowSelection={null}
        onAdd={() => {
          dispatch({
            type: 'settings/showModalAddShipper',
          });
        }}
        onUpdate={(record) => {
          dispatch({
            type: 'settings/showModalUpdateUser',
            payload: {
              currentUpdatingUser: record,
            },
          });
        }}
        onDelete={(record) => {
          dispatch({
            type: 'settings/deleteShipper',
            payload: {
              id: record.id,
            },
          });
        }}
        onChange={(page) => {
          dispatch({
            type: 'settings/getListShipper',
            payload: {
              page: page.current,
              limit: page.pageSize,
            },
          });
        }}
      />
    );
  };

  renderModalSetting() {
    const { dispatch, settings, loading } = this.props;

    return (
      <ModalPriceSetting
        item={settings.currentSetting}
        visible={settings?.modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`settings/updatePriceSetting`]}
        title="Update Price Setting"
        onAccept={(data) => {
          dispatch({
            type: `settings/updatePriceSetting`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'settings/hideModal',
          });
        }}
      />
    );
  }

  renderModalAddAdmin() {
    const { dispatch, settings, loading, app } = this.props;

    return (
      <ModalAddAdmin
        item={settings.currentAdmin}
        visible={settings?.modalAddAdminVisible}
        constant={app?.appConstants}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`settings/addAdmin`]}
        title="Add Admin"
        onAdd={(data) => {
          dispatch({
            type: `settings/addAdmin`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'settings/hideModalAddAdmin',
          });
        }}
      />
    );
  }

  renderModalAddShipper() {
    const { dispatch, settings, loading, app } = this.props;

    return (
      <ModalAddShipper
        constant={app?.appConstants}
        item={settings.currentShipper}
        visible={settings?.modalAddShipperVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`settings/addShipper`]}
        title="Add Shipper"
        onAdd={(data) => {
          dispatch({
            type: `settings/addShipper`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'settings/hideModalAddShipper',
          });
        }}
      />
    );
  }

  renderModalUpdate() {
    const { dispatch, app, settings, loading } = this.props;

    return (
      <ModalUpdate
        item={settings?.currentUpdatingUser}
        constant={app?.appConstants}
        visible={settings?.modalUpdateUserVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`settings/updateUser`]}
        title={'Update User'}
        onAccept={(data) => {
          dispatch({
            type: `settings/updateUser`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'settings/hideModalUpdateUser',
          });
        }}
      />
    );
  }

  render() {
    return (
      <Page inner={true}>
        {this.renderPriceSetting()}
        <br />
        <br />

        {this.renderAdmins()}
        <br />
        <br />

        {this.renderShippers()}

        {this.renderModalSetting()}
        {this.renderModalAddAdmin()}
        {this.renderModalAddShipper()}
        {this.renderModalUpdate()}
      </Page>
    );
  }
}

export default connect(({ settings, app, loading }: IConnectState) => ({ settings, app, loading }))(
  Settings,
);
