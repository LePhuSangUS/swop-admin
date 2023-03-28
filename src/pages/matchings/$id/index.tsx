import React from 'react';
import { Col, Row } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState, IOverdueBalance, ISwop, ISwopTracking, ITransaction } from 'types';
import Header from './components/Header';
import SwopDetails from './components/SwopDetails';
import ModalUpdateMatching from './components/ModalUpdateMatching';
import ModalSwopTracking from './components/ModalSwopTracking';
import ModalAssignDelivery from './components/ModalAssignDelivery';
import SwopTracking from './components/SwopTracking';
import SwopTransactions from './components/SwopTransactions';
import ModalTimeElapsed from './components/ModalTimeElapsed';

class MatchingDetails extends React.PureComponent<IConnectState> {
  renderSwop = (
    swop: ISwop,
    otherSwop: ISwop,
    trackings: ISwopTracking[],
    otherTrackings: ISwopTracking[],
    transactions: ITransaction[],
    overdueBalance: IOverdueBalance,
  ) => {
    const { app, loading, dispatch, matchingDetails } = this.props;
    const swopLoading =
      loading.effects['matchingDetails/fixSameReturnLaundry'] ||
      loading.effects['matchingDetails/fixSameLaundry'] ||
      loading.effects['matchingDetails/getMatching'];

    const trackingLoading =
      (swop?.is_counter
        ? loading.effects['matchingDetails/getCounterSwopTrackings']
        : loading.effects['matchingDetails/getSwopTrackings']) ||
      loading.effects['matchingDetails/markSwopStatus'];

    const transactionLoading =
      (swop?.is_counter
        ? loading.effects['matchingDetails/getCounterSwopTransactions']
        : loading.effects['matchingDetails/getSwopTransactions']) ||
      loading.effects['matchingDetails/markSwopStatus'];

    return (
      <>
        <SwopDetails
          loading={swopLoading || false}
          user={swop?.user}
          constants={app.appConstants}
          swop={swop}
          otherSwop={otherSwop}
          transactions={transactions}
          overdueBalance={overdueBalance}
        >
          <br />
          <SwopTransactions
            constants={app?.appConstants}
            loading={transactionLoading}
            dataSource={transactions}
          />

          <br />
          <SwopTracking
            loading={trackingLoading}
            swopTrackings={trackings}
            otherSwopTrackings={otherTrackings}
            swop={swop}
            otherSwop={otherSwop}
            matching={matchingDetails?.matching}
            onAssignDelivery={(swop) => {
              dispatch({
                type: 'matchingDetails/showModalAssignDelivery',
                payload: {
                  currentSwop: swop,
                  currentOtherSwop: otherSwop,
                  currentSwopUser: swop?.user,
                  currentOtherSwopUser: otherSwop?.user,
                },
              });
            }}
            onSimulateStatus={(matching_id, swop_id, name) => {
              dispatch({
                type: 'matchingDetails/showModalTimeElapsed',
                payload: {
                  currentTaskPayload: {
                    name,
                    data: {
                      swop_id,
                      matching_id,
                    },
                  },
                },
              });
            }}
            onDeleteTracking={(id) => {
              dispatch({
                type: 'matchingDetails/deleteSwopTracking',
                payload: { id, is_counter: true },
              });
            }}
            onUpdateTracking={(item) => {
              dispatch({
                type: 'matchingDetails/showModalSwopTracking',
                payload: {
                  currentSwopTracking: item,
                  currentSwopTrackingIsCounter: true,
                  modalSwopTrackingType: 'update',
                },
              });
            }}
            onRefreshData={(id) =>
              dispatch({
                type: swop?.is_counter
                  ? 'matchingDetails/getCounterSwopTrackings'
                  : 'matchingDetails/getSwopTrackings',
                payload: { id: swop?.id },
              })
            }
            onMarkStatus={(swop_id, other_swop_id, status, isSendBack) => {
              dispatch({
                type: 'matchingDetails/markSwopStatus',
                payload: {
                  swop_id,
                  other_swop_id,
                  status,
                  isSendBack,
                },
              });
            }}
          />
        </SwopDetails>
      </>
    );
  };
  render() {
    const { matchingDetails, app, loading, dispatch } = this.props;
    const pageLoading = loading.effects['matchingDetails/getMatching'];

    return (
      <Page inner={true} loading={pageLoading}>
        <Header
          onUpdateMatching={() => {
            dispatch({ type: 'matchingDetails/showModalUpdateMatching' });
          }}
          onMarkAsEarlyReturnConfirmed={(id) => {
            dispatch({ type: 'matchingDetails/markAsEarlyReturnConfirmed', payload: { id } });
          }}
          onMarkAsRetentionConfirmed={(id) => {
            dispatch({ type: 'matchingDetails/markAsRetentionConfirmed', payload: { id } });
          }}
          matching={matchingDetails?.matching}
        />
        <Row gutter={[24, 24]}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            {this.renderSwop(
              matchingDetails?.matching?.swop,
              matchingDetails?.matching?.counter_swop,
              matchingDetails?.swopTrackings,
              matchingDetails?.counterSwopTrackings,
              matchingDetails?.swopTransactions,
              matchingDetails?.userOverdueBalance,
            )}
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            {this.renderSwop(
              matchingDetails?.matching?.counter_swop,
              matchingDetails?.matching?.swop,
              matchingDetails?.counterSwopTrackings,
              matchingDetails?.swopTrackings,
              matchingDetails?.counterSwopTransactions,
              matchingDetails?.counterUserOverdueBalance,
            )}
          </Col>
        </Row>
        <ModalUpdateMatching
          constants={app?.appConstants}
          visible={matchingDetails?.modalUpdateMatchingVisible}
          onAccept={(item) => {
            dispatch({ type: 'matchingDetails/updateMatching', payload: item });
          }}
          item={matchingDetails?.matching}
          onCancel={() => {
            dispatch({ type: 'matchingDetails/hideModalUpdateMatching' });
          }}
        />
        {/* <ModalUpdateSwop
          constants={app?.appConstants}
          visible={matchingDetails?.modalUpdateSwopVisible}
          confirmLoading={loading.effects['matchingDetails/updateSwop']}
          onAccept={(item) => {
            dispatch({ type: 'matchingDetails/updateSwop', payload: item });
          }}
          item={matchingDetails?.currentSwop}
          onCancel={() => {
            dispatch({ type: 'matchingDetails/hideModalUpdateSwop' });
          }}
        /> */}
        <ModalSwopTracking
          title={
            matchingDetails?.modalSwopTrackingType === 'create'
              ? 'Create Tracking'
              : 'Update Tracking'
          }
          constants={app?.appConstants}
          visible={matchingDetails?.modalSwopTrackingVisible}
          onAccept={(item) => {
            dispatch({
              type: `matchingDetails/${matchingDetails?.modalSwopTrackingType}SwopTracking`,
              payload: {
                ...item,
                is_counter: matchingDetails?.currentSwopTrackingIsCounter,
                swop_id: matchingDetails?.currentSwopTrackingIsCounter
                  ? matchingDetails?.matching?.counter_swop_id
                  : matchingDetails?.matching?.swop_id,
              },
            });
          }}
          item={matchingDetails?.currentSwopTracking}
          onCancel={() => {
            dispatch({ type: 'matchingDetails/hideModalSwopTracking' });
          }}
        />
        <ModalAssignDelivery
          item={matchingDetails?.currentSwop}
          otherItem={matchingDetails?.currentOtherSwop}
          user={matchingDetails?.currentSwopUser}
          otherUser={matchingDetails?.currentOtherSwopUser}
          visible={matchingDetails?.modalAssignDeliveryVisible}
          destroyOnClose={true}
          centered={true}
          maskClosable={false}
          confirmLoading={loading.effects[`matchingDetails/assignDelivery`]}
          title="Assign Delivery"
          onAccept={(data) => {
            dispatch({
              type: 'matchingDetails/assignDelivery',
              payload: data,
            });
          }}
          onCancel={() => {
            dispatch({
              type: 'matchingDetails/hideModalAssignDelivery',
            });
          }}
        />
        <ModalTimeElapsed
          visible={matchingDetails?.modalTimeElapsedVisible}
          destroyOnClose={true}
          centered={true}
          maskClosable={false}
          title={'Set Time Elapsed'}
          taskName={matchingDetails?.currentTaskPayload?.name}
          onRequest={(taskName: string, timeElapsed: number) => {
            const { name, data = {} } = matchingDetails?.currentTaskPayload;
            dispatch({
              type: 'matchingDetails/simulateSwopStatus',
              payload: {
                name,
                data: {
                  ...data,
                  time_elapsed: timeElapsed,
                },
              },
            });
          }}
          confirmLoading={
            loading.effects['matchingDetails/simulateSwopStatus'] ||
            loading.effects['matchingDetails/dispatchTaskStart'] ||
            loading.effects['matchingDetails/dispatchTask'] ||
            Object.values(matchingDetails?.dispatching).filter((item) => !!item)?.length > 0
          }
          onCancel={() => {
            dispatch({
              type: 'matchingDetails/hideModalTimeElapsed',
            });
          }}
        />
      </Page>
    );
  }
}

export default connect(({ matchingDetails, app, loading }: IConnectState) => ({
  matchingDetails,
  app,
  loading,
}))(MatchingDetails);
