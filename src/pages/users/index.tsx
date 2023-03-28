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
import ModalActivateAccount from './components/ModalActivateAccount';
import ModalFilter from './components/ModalFilter';
import NumberCard from 'components/NumberCard';

class Users extends PureComponent<IConnectState> {
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
    const { location, dispatch, users } = this.props;
    const { query } = location;

    return (
      <Filter
        filter={{ ...query }}
        hasDefaultFilter={Object.values(users?.filter || {}).length > 0}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: users?.pagination?.current || 1,
            limit: users?.pagination?.pageSize || 10,
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'users/showModalFilter',
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, users, loading } = this.props;
    const { list, pagination } = users;
    return (
      <List
        dataSource={list}
        loading={loading.effects['users/getListUser']}
        pagination={pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onPermit={(record) => {
          dispatch({
            type: 'users/showModalActivateAccount',
            payload: {
              currentUser: record,
            },
          });
        }}
        onActivate={(id) => {
          dispatch({
            type: 'users/activateAccount',
            payload: {
              id,
            },
          });
        }}
        onDeactivateItem={(id) => {
          dispatch({
            type: 'users/deactivateAccount',
            payload: {
              id,
            },
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'users/showModal',
            payload: {
              modalType: 'update',
              currentUser: record,
            },
          });
        }}
        onDeleteItem={(id) => {
          dispatch({
            type: 'users/deleteUser',
            payload: id,
          });
        }}
      />
    );
  }

  renderModalActivateAccount() {
    const { dispatch, users, loading } = this.props;
    const { currentUser, modalActivateVisible } = users;

    return (
      <ModalActivateAccount
        item={currentUser}
        visible={modalActivateVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects['users/activateAccount']}
        title={`Re-activate Account`}
        onAccept={(data) => {
          dispatch({
            type: 'users/activateAccount',
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'users/hideModalActivateAccount',
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, users, loading, app } = this.props;
    const { currentUser, modalFilterVisible } = users;

    return (
      <ModalFilter
        filter={users?.filter}
        constants={app?.appConstants}
        item={currentUser}
        visible={modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects['users/filterUser']}
        title={`Filter Users`}
        onAccept={(data) => {
          dispatch({
            type: 'users/filterUser',
            payload: {
              ...data,
              limit: users?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'users/hideModalFilter',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: `users/filterUser`,
            payload: {
              isClear: true,
              page: users?.pagination?.current,
              limit: users?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, app, users, loading } = this.props;
    const { currentUser, modalVisible, modalType } = users;

    return (
      <Modal
        item={modalType === 'create' ? null : currentUser}
        constant={app?.appConstants}
        visible={modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`users/${modalType}User`]}
        title={`${modalType === 'create' ? 'Create User' : 'Update User'}`}
        onAccept={(data) => {
          dispatch({
            type: `users/${modalType}User`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'users/hideModal',
          });
        }}
      />
    );
  }

  renderStats() {
    const { users, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['users/getUserStats']}
            subTitle="New Users Welcomed Yesterday"
            number={users?.userStats?.total_new_user_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['users/getUserStats']}
            subTitle="Daily Active Users Yesterday"
            number={users?.userStats?.total_daily_active_user_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['users/getUserStats']}
            subTitle="Total Users"
            number={users?.userStats?.total_user || 0}
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
        {this.renderModalActivateAccount()}
      </Page>
    );
  }
}

export default connect(({ app, users, loading }: IConnectState) => ({ app, users, loading }))(
  Users,
);
