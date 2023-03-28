import React from 'react';
import { Col, Row, Card } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import ListSwopDropOff from './components/ListSwopDropOff';
import ListSwopReturnPickUpScheduled from './components/ListSwopReturnPickUpScheduled';
import ListMatchingRetentionProposed from './components/ListMatchingRetentionProposed';
import ListMatchingEarlyReturnProposed from './components/ListMatchingEarlyReturnProposed';
import ListMatchingReturnInitiated from './components/ListMatchingReturnInitiated';
import ListSwopPickUp from './components/ListSwopPickUp';
import ListSwopReturnDropOff from './components/ListSwopReturnDropOff';
import ListSwopReturnPickUp from './components/ListSwopReturnPickUp';
import ListMatchingExtensionProposed from './components/ListMatchingExtensionProposed';
import ListMatchingExtensionConfirmed from './components/ListMatchingExtensionConfirmed';
import ListMatchingEarlyReturnConfirmed from './components/ListMatchingEarlyReturnConfirmed';
import ModalTimeElapsed from './components/ModalTimeElapsed';
import ListSwopPicked from './components/ListSwopPicked';
import ListSwopDelivered from './components/ListSwopDelivered';
import ListSwopReturnDelivered from './components/ListSwopReturnDelivered';
import styles from './index.less';
import ListMatchingExpiry from './components/ListMatchingExpiry';
import ListSwopReady from './components/ListSwopReady';
import ListMatchingFinished from './components/ListMatchingFinished';
import ListSwopReturnReady from './components/ListSwopReturnReady';
import ListSwopReadyIfOtherDifferent from './components/ListSwopReadyIfOtherDifferent';
import ListSwopPickUpScheduledIfOtherDifferent from './components/ListSwopPickUpScheduledIfOtherDifferent';
import ListSwopReturnReadyIfOtherDifferent from './components/ListSwopReturnReadyIfOtherDifferent';
import ListMatchingReturnInitiatedForChat from './components/ListMatchingReturnInitiatedForChat';
import ListMatchingCompletedForChat from './components/ListMatchingCompletedForChat';
import ListMatchingCompleted from './components/ListMatchingCompleted';

class CronJobs extends React.PureComponent<IConnectState> {
  handleDispatchTask = (name: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cron/showModalTimeElapsed',
      payload: {
        currentTaskName: name,
      },
    });
  };

  handleDispatchTaskDelay = (name: string, timeElapsed: number) => {
    const { dispatch } = this.props;

    let type = '';
    switch (name) {
      case 'track_swop_return_ready':
        type = 'getListSwopReturnReady';
        break;
      case 'track_swop_pick_up_scheduled_if_other_different':
        type = 'getListSwopPickUpScheduledIfOtherDifferent';
        break;
      case 'track_swop_return_ready_if_other_different':
        type = 'getListSwopReturnReadyScheduledIfOtherDifferent';
        break;
      case 'track_swop_ready_if_other_different':
        type = 'getListSwopReadyIfOtherDifferent';
        break;
      case 'track_swop_ready':
        type = 'getListSwopReady';
        break;
      case 'track_swop_completed':
        type = 'getListSwopCompleted';
        break;
      case 'track_swop_missing_laundry':
        type = 'getListSwopMissingLaundry';
        break;
      case 'track_swop_drop_off':
        type = 'getListSwopDropOff';
        break;
      case 'track_swop_delivery_scheduled':
        type = 'getListSwopDeliveryScheduled';
        break;
      case 'track_swop_pick_up':
        type = 'getListSwopPickUp';
        break;
      case 'track_swop_picked':
        type = 'getListSwopPicked';
        break;
      case 'track_swop_return_pick_up_scheduled':
        type = 'getListSwopReturnPickUpScheduled';
        break;
      case 'track_swop_return_drop_off':
        type = 'getListSwopReturnDropOff';
        break;
      case 'track_swop_return_pick_up':
        type = 'getListSwopReturnPickUp';
        break;
      case 'track_swop_return_delivered':
        type = 'getListSwopReturnDelivered';
        break;
      case 'track_swop_delivered':
        type = 'getListSwopDelivered';
        break;
      case 'track_swop_delivery_scheduled_for_different':
        type = 'getListSwopDeliveryScheduledForDifferent';
        break;
      case 'track_swop_return_delivery_scheduled_for_different':
        type = 'getListSwopReturnDeliveryScheduledForDifferent';
        break;
      case 'track_matching_finished':
        type = 'getListMatchingFinished';
        break;
      case 'track_matching_expiry':
        type = 'getListMatchingExpiry';
        break;
      case 'track_matching_early_return_proposed':
        type = 'getListMatchingEarlyReturnProposed';
        break;
      case 'track_matching_retention_proposed':
        type = 'getListMatchingRetentionProposed';
        break;
      case 'track_matching_extension_proposed':
        type = 'getListMatchingExtensionProposed';
        break;
      case 'track_matching_extension_confirmed':
        type = 'getListMatchingExtensionConfirmed';
        break;
      case 'track_matching_return_initiated':
        type = 'getListMatchingReturnInitiated';
        break;
      case 'track_matching_return_initiated_for_chat':
        type = 'getListMatchingReturnInitiatedForChat';
        break;
      case 'track_matching_completed_for_chat':
        type = 'getListMatchingCompletedForChat';
        break;
      case 'track_matching_completed':
        type = 'getListMatchingCompleted';
        break;
      case 'track_matching_early_return_confirmed':
        type = 'getListMatchingEarlyReturnConfirmed';
        break;
    }

    if (type !== '') {
      dispatch({
        type: 'cron/dispatchTaskStart',
        payload: {
          name,
        },
      });
      dispatch({
        type: 'cron/dispatchTask',
        payload: {
          name,
          data: {
            time_elapsed: timeElapsed,
          },
        },
      })?.then(() => {
        setTimeout(() => {
          dispatch({
            type: `cron/${type}`,
            payload: {
              name,
            },
          });
          dispatch({
            type: 'cron/dispatchTaskEnd',
            payload: {
              name,
            },
          });
        }, 3000);
      });
    }
  };

  render() {
    const { cron, loading, dispatch } = this.props;
    const {
      listSwopReady,
      listSwopReturnReady,
      listSwopReadyIfOtherDifferent,
      listSwopPickUpScheduledIfOtherDifferent,
      listSwopReturnReadyIfOtherDifferent,
      listSwopDropOff,
      listSwopPickUp,
      listSwopReturnDropOff,
      listSwopReturnPickUp,
      listSwopPicked,
      listSwopDelivered,
      listSwopReturnDelivered,
      listMatchingCompleted,
      listMatchingExpiry,
      listMatchingFinished,
      listSwopReturnPickUpScheduled,
      listMatchingRetentionProposed,
      listMatchingEarlyReturnProposed,
      listMatchingEarlyReturnConfirmed,
      listMatchingExtensionProposed,
      listMatchingExtensionConfirmed,
      listMatchingReturnInitiated,
      listMatchingReturnInitiatedForChat,
      listMatchingCompletedForChat,
    } = cron;

    return (
      <Page className={styles.dashboard}>
        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopDropOff
                loading={
                  loading.effects['cron/getListSwopDropOff'] ||
                  cron?.dispatching['track_swop_drop_off']
                }
                dispatching={cron?.dispatching['track_swop_drop_off']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopDropOff?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnDelivered
                loading={
                  loading.effects['cron/getListSwopReturnDelivered'] ||
                  cron?.dispatching['track_swop_return_delivered']
                }
                dispatching={cron?.dispatching['track_swop_return_delivered']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnDelivered?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopPickUp
                loading={
                  loading.effects['cron/getListSwopPickUp'] ||
                  cron?.dispatching['track_swop_pick_up']
                }
                dispatching={cron?.dispatching['track_swop_pick_up']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopPickUp?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnPickUpScheduled
                loading={
                  loading.effects['cron/getListSwopReturnPickUpScheduled'] ||
                  cron?.dispatching['track_swop_return_pick_up_scheduled']
                }
                dispatching={cron?.dispatching['track_swop_return_pick_up_scheduled']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnPickUpScheduled?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnDropOff
                loading={
                  loading.effects['cron/getListSwopReturnDropOff'] ||
                  cron?.dispatching['track_swop_return_drop_off']
                }
                dispatching={cron?.dispatching['track_swop_return_drop_off']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnDropOff?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnPickUp
                loading={
                  loading.effects['cron/getListSwopReturnPickUp'] ||
                  cron?.dispatching['track_swop_return_pick_up']
                }
                dispatching={cron?.dispatching['track_swop_return_pick_up']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnPickUp?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopPicked
                loading={
                  loading.effects['cron/getListSwopPicked'] ||
                  cron?.dispatching['track_swop_picked']
                }
                dispatching={cron?.dispatching['track_swop_picked']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopPicked?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopDelivered
                loading={
                  loading.effects['cron/getListSwopDelivered'] ||
                  cron?.dispatching['track_swop_delivered']
                }
                dispatching={cron?.dispatching['track_swop_delivered']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopDelivered?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReady
                loading={
                  loading.effects['cron/getListSwopReady'] || cron?.dispatching['track_swop_ready']
                }
                dispatching={cron?.dispatching['track_swop_ready']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReady?.records}
              />
            </Card>
          </Col>

          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReadyIfOtherDifferent
                loading={
                  loading.effects['cron/getListSwopReadyIfOtherDifferent'] ||
                  cron?.dispatching['track_swop_ready_if_other_different']
                }
                dispatching={cron?.dispatching['track_swop_ready_if_other_different']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReadyIfOtherDifferent?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnReady
                loading={
                  loading.effects['cron/getListSwopReturnReady'] ||
                  cron?.dispatching['track_swop_return_ready']
                }
                dispatching={cron?.dispatching['track_swop_return_ready']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnReady?.records}
              />
            </Card>
          </Col>

          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopReturnReadyIfOtherDifferent
                loading={
                  loading.effects['cron/getListSwopReturnReadyIfOtherDifferent'] ||
                  cron?.dispatching['track_swop_return_ready_if_other_different']
                }
                dispatching={cron?.dispatching['track_swop_return_ready_if_other_different']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopReturnReadyIfOtherDifferent?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingCompleted
                loading={
                  loading.effects['cron/getListMatchingCompleted'] ||
                  cron?.dispatching['track_matching_completed']
                }
                dispatching={cron?.dispatching['track_matching_completed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingCompleted?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListSwopPickUpScheduledIfOtherDifferent
                loading={
                  loading.effects['cron/getListSwopPickUpScheduledIfOtherDifferent'] ||
                  cron?.dispatching['track_swop_pick_up_scheduled_if_other_different']
                }
                dispatching={cron?.dispatching['track_swop_pick_up_scheduled_if_other_different']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listSwopPickUpScheduledIfOtherDifferent?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingEarlyReturnProposed
                loading={
                  loading.effects['cron/getListMatchingEarlyReturnProposed'] ||
                  cron?.dispatching['track_matching_early_return_proposed']
                }
                dispatching={cron?.dispatching['track_matching_early_return_proposed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingEarlyReturnProposed?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingRetentionProposed
                loading={
                  loading.effects['cron/getListMatchingRetentionProposed'] ||
                  cron?.dispatching['track_matching_retention_proposed']
                }
                dispatching={cron?.dispatching['track_matching_retention_proposed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingRetentionProposed?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingExtensionProposed
                loading={
                  loading.effects['cron/getListMatchingExtensionProposed'] ||
                  cron?.dispatching['track_matching_extension_proposed']
                }
                dispatching={cron?.dispatching['track_matching_extension_proposed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingExtensionProposed?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingExtensionConfirmed
                loading={
                  loading.effects['cron/getListMatchingExtensionConfirmed'] ||
                  cron?.dispatching['track_matching_extension_confirmed']
                }
                dispatching={cron?.dispatching['track_matching_extension_confirmed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingExtensionConfirmed?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingReturnInitiated
                loading={
                  loading.effects['cron/getListMatchingReturnInitiated'] ||
                  cron?.dispatching['track_matching_return_initiated']
                }
                dispatching={cron?.dispatching['track_matching_return_initiated']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingReturnInitiated?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingEarlyReturnConfirmed
                loading={
                  loading.effects['cron/getListMatchingEarlyReturnConfirmed'] ||
                  cron?.dispatching['track_matching_early_return_confirmed']
                }
                dispatching={cron?.dispatching['track_matching_early_return_confirmed']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingEarlyReturnConfirmed?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingExpiry
                loading={
                  loading.effects['cron/getListMatchingExpiry'] ||
                  cron?.dispatching['track_matching_expiry']
                }
                dispatching={cron?.dispatching['track_matching_expiry']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingExpiry?.records}
              />
            </Card>
          </Col>

          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingFinished
                loading={
                  loading.effects['cron/getListMatchingFinished'] ||
                  cron?.dispatching['track_matching_finished']
                }
                dispatching={cron?.dispatching['track_matching_finished']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingFinished?.records}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingReturnInitiatedForChat
                loading={
                  loading.effects['cron/getListMatchingReturnInitiatedForChat'] ||
                  cron?.dispatching['track_matching_return_initiated_for_chat']
                }
                dispatching={cron?.dispatching['track_matching_return_initiated_for_chat']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingReturnInitiatedForChat?.records}
              />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <ListMatchingCompletedForChat
                loading={
                  loading.effects['cron/getListMatchingCompletedForChat'] ||
                  cron?.dispatching['track_matching_completed_for_chat']
                }
                dispatching={cron?.dispatching['track_matching_completed_for_chat']}
                onDispatchJob={this.handleDispatchTask}
                dataSource={listMatchingCompletedForChat?.records}
              />
            </Card>
          </Col>
        </Row>

        <ModalTimeElapsed
          visible={cron?.modalTimeElapsedVisible}
          destroyOnClose={true}
          centered={true}
          maskClosable={false}
          title={'Set Time Elapsed'}
          taskName={cron?.currentTaskName}
          onRequest={this.handleDispatchTaskDelay}
          confirmLoading={
            loading.effects['cron/dispatchTaskStart'] ||
            loading.effects['cron/dispatchTask'] ||
            Object.values(cron?.dispatching).filter((item) => !!item)?.length > 0
          }
          onCancel={() => {
            dispatch({
              type: 'cron/hideModalTimeElapsed',
            });
          }}
        />
      </Page>
    );
  }
}

export default connect(({ app, cron, loading }: IConnectState) => ({ app, cron, loading }))(
  CronJobs,
);
