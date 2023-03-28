import React from 'react';
import { Col, Row, Card } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import NumberCard from './components/NumberCard';
import styles from './index.less';
import theme from 'utils/theme';
import SwopStats from './components/SwopStats';
import MatchingStats from './components/MatchingStats';
import RevenueStats from './components/RevenueStats';
import CumulativeChart from './components/CumulativeChart';

class Dashboard extends React.PureComponent<IConnectState> {
  render() {
    const { dashboard, loading, dispatch } = this.props;
    const {
      totalUser,
      totalLaundry,
      totalDress,
      swopStats,
      matchingStats,
      statsRevenue,
      statsCumulative,
    } = dashboard;

    return (
      <Page className={styles.dashboard}>
        <Row gutter={24}>
          <Col key={0} lg={8} md={24}>
            <NumberCard
              loading={loading.effects['dashboard/countUser']}
              icon="user"
              color={theme.colors.blue}
              title={'Total Users'}
              number={totalUser}
            />
          </Col>
          <Col key={1} lg={8} md={24}>
            <NumberCard
              loading={loading.effects['dashboard/countLaundry']}
              icon="shop"
              color={theme.colors.blue}
              title={'Total Laundries'}
              number={totalLaundry}
            />
          </Col>

          <Col key={2} lg={8} md={24}>
            <NumberCard
              loading={loading.effects['dashboard/countDress']}
              icon="skin"
              color={theme.colors.blue}
              title={'Total Dresses'}
              number={totalDress}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <SwopStats dataSource={swopStats?.records} />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false}>
              <MatchingStats dataSource={matchingStats?.records} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col>
            <CumulativeChart statsCumulative={statsCumulative} />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col>
            <RevenueStats
              loading={loading.effects['dashboard/statsRevenue']}
              onDateChanged={(from, to) => {
                dispatch({
                  type: 'dashboard/statsRevenue',
                  payload: {
                    from_time: from,
                    to_time: to,
                  },
                });
              }}
              records={statsRevenue?.records}
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default connect(({ app, dashboard, loading }: IConnectState) => ({
  app,
  dashboard,
  loading,
}))(Dashboard);
