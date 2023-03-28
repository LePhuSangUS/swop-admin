import React from 'react';
import { Col, Row } from 'antd';
import { Coordinate, Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import { stringify } from 'qs';
import router from 'umi/router';
import UserDetails from './components/UserDetails';
import Header from './components/Header';
import ListDress from './components/ListDress';
import ModalRequestToken from './components/ModalRequestToken';
import Devices from './components/Devices';
import ListCredit from './components/ListCredits';
import ModalCredit from './components/ModalCredit';
import ModalPushNotification from './components/ModalPushNotification';
import ModalAddDevice from './components/ModalAddDevice';
import ListSwop from './components/ListSwop';
import ListOtherDress from './components/ListOtherDress';
import Transactions from './components/Transactions';
import ModalUpdateDress from './components/ModalUpdateDress';
import ModalFilterDresses from './components/ModalFilterDresses';
import ModalTransaction from './components/ModalTransaction';

class UserDetail extends React.PureComponent<IConnectState> {
  handleRefresh = (newQuery?: any) => {
    const { location } = this.props;
    // @ts-ignore
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

  renderModalUpdateDress() {
    const { dispatch, app, userDetails, loading } = this.props;

    return (
      <ModalUpdateDress
        item={userDetails?.currentDress}
        constants={app?.appConstants}
        visible={userDetails?.modalUpdateDressVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`userDetails/updateDress`]}
        title={'Update Dress'}
        onAccept={(data) => {
          dispatch({
            type: `userDetails/updateDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'userDetails/hideModalUpdateDress',
          });
        }}
      />
    );
  }

  renderModalFilterDress() {
    const { dispatch, app, userDetails, loading } = this.props;

    return (
      <ModalFilterDresses
        constants={app?.appConstants}
        visible={userDetails?.modalFilterDressVisible}
        filter={userDetails?.filterDress}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`userDetails/getListOtherDress`]}
        title={'Filter Dress'}
        onFilter={(data) => {
          dispatch({
            type: `userDetails/getListOtherDress`,
            payload: {
              limit: userDetails?.otherDresses?.pagination?.pageSize,
              user_coordinate_id: userDetails?.user?.coordinate_id,
              id: userDetails?.user?.id,
              is_admin: false,
              filter: data,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'userDetails/hideModalFilterDress',
          });
        }}
      />
    );
  }

  renderModalTransaction() {
    const { dispatch, app, userDetails, loading } = this.props;

    return (
      <ModalTransaction
        constants={app?.appConstants}
        visible={userDetails?.modalTransactionVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`userDetails/createTransaction`]}
        title={'Create Transaction'}
        onAccept={(data) => {
          dispatch({
            type: `userDetails/createTransaction`,
            payload: {
              ...data,
              user_id: userDetails?.user?.id,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'userDetails/hideModalTransaction',
          });
        }}
      />
    );
  }

  render() {
    const { userDetails, app, loading, dispatch } = this.props;

    const loadingDevice =
      loading.effects['userDetails/getListDevice'] ||
      loading.effects['userDetails/addDevice'] ||
      loading.effects['userDetails/removeDevice'] ||
      loading.effects['userDetails/removeAllDevice'];

    return (
      <Page inner={true} loading={loading.effects['userDetails/getUser']}>
        <Header
          onRequestAccessToken={() => {
            dispatch({
              type: 'userDetails/showModalRequestToken',
            });
          }}
          user={userDetails?.user}
        />
        <br />
        <Row gutter={[24, 12]}>
          <Col lg={{ offset: 0, span: 7 }}>
            <UserDetails user={userDetails?.user} />
            <br />

            <Coordinate title="Location" coordinate={userDetails?.user?.coordinate} />
          </Col>
          <Col lg={{ offset: 0, span: 17 }}>
            <Devices
              dataSource={userDetails?.devices?.list}
              pagination={userDetails?.devices?.pagination}
              loading={loadingDevice}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getListDevice',
                  payload: {
                    id: userDetails?.user?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
              onSendNotification={(record) => {
                dispatch({
                  type: 'userDetails/showModalNotification',
                  payload: {
                    id: userDetails?.user.id,
                    currentDevice: record,
                  },
                });
              }}
              onSendAllNotification={() => {
                dispatch({
                  type: 'userDetails/showModalNotification',
                  payload: {
                    sendAllDevicesOfUser: true,
                    currentDevice: null,
                  },
                });
              }}
              onAddDevice={() => {
                dispatch({
                  type: 'userDetails/showModalAddDevice',
                });
              }}
              onDeleteAllDevice={() => {
                dispatch({
                  type: 'userDetails/removeAllDevice',
                  payload: {
                    id: userDetails?.user.id,
                  },
                });
              }}
              onDeleteDevice={(record) => {
                dispatch({
                  type: 'userDetails/removeDevice',
                  payload: {
                    id: userDetails?.user.id,
                    device_token: record.token,
                  },
                });
              }}
            />
            <br />

            <Transactions
              constants={app?.appConstants}
              dataSource={userDetails?.transactions?.list}
              pagination={userDetails?.transactions?.pagination}
              onAdd={() => {
                dispatch({
                  type: 'userDetails/showModalTransaction',
                });
              }}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getTransactions',
                  payload: {
                    user_id: userDetails?.user?.id,
                    page: page.current,
                    limit: page.pageSize,
                  },
                });
              }}
            />
            <br />

            <ListCredit
              dataSource={userDetails?.credits?.list}
              loading={loading.effects['userDetails/getListCredit']}
              pagination={userDetails?.credits?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getListCredit',
                  payload: {
                    user_id: userDetails?.user?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
              onDeleteItem={(data) => {
                dispatch({
                  type: 'userDetails/deleteCredit',
                  payload: data,
                });
              }}
              onEditItem={(data) => {
                dispatch({
                  type: 'userDetails/showModalCredit',
                  payload: {
                    modalCreditType: 'update',
                    currentCredit: data,
                  },
                });
              }}
              onAdd={() => {
                dispatch({
                  type: 'userDetails/showModalCredit',
                  payload: {
                    modalCreditType: 'create',
                    currentCredit: null,
                  },
                });
              }}
            />
            <br />

            <ListDress
              constants={app.appConstants}
              dataSource={userDetails?.dresses?.list}
              loading={loading.effects['userDetails/getListDress']}
              pagination={userDetails?.dresses?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getListDress',
                  payload: {
                    user_id: userDetails?.user?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
              onEdit={(dress) => {
                dispatch({
                  type: 'userDetails/showModalUpdateDress',
                  payload: {
                    currentDress: dress,
                  },
                });
              }}
            />
            <br />
            <ListSwop
              constants={app.appConstants}
              dataSource={userDetails?.swops?.list}
              loading={loading.effects['userDetails/getListSwop']}
              pagination={userDetails?.swops?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getListSwop',
                  payload: {
                    user_id: userDetails?.user?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
            />
            <br />

            <ListOtherDress
              constants={app.appConstants}
              filter={userDetails?.filterDress}
              onFilter={() =>
                dispatch({
                  type: 'userDetails/showModalFilterDress',
                })
              }
              dataSource={userDetails?.otherDresses?.list}
              loading={loading.effects['userDetails/getListOtherDress']}
              pagination={userDetails?.otherDresses?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'userDetails/getListOtherDress',
                  payload: {
                    id: userDetails?.user?.id,
                    limit: page.pageSize,
                    page: page.current,
                  },
                });
              }}
            />
            <br />
          </Col>
        </Row>

        <ModalRequestToken
          visible={userDetails?.modalRequestTokenVisible}
          user={userDetails?.user}
          confirmLoading={loading.effects['userDetails/requestToken']}
          onRequest={(data) => {
            dispatch({
              type: 'userDetails/requestToken',
              payload: data,
            });
          }}
          onCancel={() => {
            dispatch({
              type: 'userDetails/hideModalRequestToken',
            });
          }}
        />

        <ModalPushNotification
          user={userDetails?.user}
          sendAllDevicesOfUser={userDetails?.sendAllDevicesOfUser}
          devices={userDetails?.devices?.list}
          currentDevice={userDetails?.currentDevice}
          visible={userDetails?.modalNotificationVisible}
          confirmLoading={loading.effects['userDetails/sendPushNotification']}
          onCancel={() => {
            dispatch({
              type: 'userDetails/hideModalNotification',
            });
          }}
          onSend={(payload) => {
            dispatch({
              type: 'userDetails/sendPushNotification',
              payload,
            });
          }}
        />

        <ModalCredit
          constants={app?.appConstants}
          user={userDetails?.user}
          item={userDetails?.modalCreditType === 'create' ? null : userDetails?.currentCredit}
          visible={userDetails?.modalCreditVisible}
          destroyOnClose={true}
          centered={true}
          maskClosable={false}
          confirmLoading={loading.effects[`userDetails/${userDetails?.modalCreditType}Credit`]}
          title={`${userDetails?.modalCreditType === 'create' ? 'Add Credit' : 'Update Credit'}`}
          onAccept={(data) => {
            dispatch({
              type: `userDetails/${userDetails?.modalCreditType}Credit`,
              payload: {
                user_id: userDetails?.user?.id,
                ...data,
              },
            });
          }}
          onCancel={() => {
            dispatch({
              type: 'userDetails/hideModalCredit',
            });
          }}
        />
        <ModalAddDevice
          visible={userDetails?.modalAddDeviceVisible}
          confirmLoading={loading.effects['userDetails/addDevice']}
          onAddDevice={(data) => {
            dispatch({
              type: 'userDetails/addDevice',
              payload: {
                id: userDetails?.user?.id,
                ...data,
              },
            });
          }}
          onCancel={() => {
            dispatch({
              type: 'userDetails/hideModalAddDevice',
            });
          }}
        />
        {this.renderModalUpdateDress()}
        {this.renderModalFilterDress()}
        {this.renderModalTransaction()}
      </Page>
    );
  }
}

export default connect(({ app, userDetails, loading }: IConnectState) => ({
  app,
  userDetails,
  loading,
}))(UserDetail);
