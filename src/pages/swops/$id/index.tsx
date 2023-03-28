import React from 'react';
import { Col, Row } from 'antd';
import { Coordinate, Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import SwopDetails from './components/SwopDetails';
import Header from './components/Header';
import SwopTracking from './components/SwopTracking';
import DressDetails from 'components/DressDetails';
import Transactions from './components/Transactions';
import styles from './index.less';

class SwopDetail extends React.PureComponent<IConnectState> {
  handleRefreshSwopTracking = (swopID: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'swopDetails/getSwopTracking',
      payload: {
        id: swopID,
      },
    });
  };

  render() {
    const { swopDetails, dispatch, loading, app } = this.props;

    const fetching = loading.effects['swopDetails/getSwop'];

    return (
      <Page inner={true} loading={fetching}>
        <Header swop={swopDetails?.swop} />
        <br />
        <Row>
          <Col lg={{ offset: 0, span: 8 }}>
            <SwopDetails swop={swopDetails?.swop} />
          </Col>

          <Col lg={{ offset: 1, span: 15 }}>
            <Coordinate title="Location" coordinate={swopDetails?.swop?.coordinate} />
            <br />

            <SwopTracking
              loading={loading.effects['swopDetails/getSwopTracking']}
              swop={swopDetails?.swop}
              swopTrackings={swopDetails?.swopTrackings}
              onRefreshData={this.handleRefreshSwopTracking}
            />
            <br />
            <br />
            <DressDetails
              title="Dress Details"
              constants={app?.appConstants}
              dress={swopDetails?.swop?.dress}
            />
            <br />
            <br />
            <Transactions
              constants={app?.appConstants}
              dataSource={swopDetails?.transactions?.list}
              pagination={swopDetails?.transactions?.pagination}
              onChange={(page) => {
                dispatch({
                  type: 'swopDetails/getTransactions',
                  payload: {
                    swop_id: swopDetails?.swop?.id,
                    page: page.current,
                    limit: page.pageSize,
                  },
                });
              }}
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default connect(({ app, swopDetails, loading }: IConnectState) => ({
  app,
  swopDetails,
  loading,
}))(SwopDetail);
