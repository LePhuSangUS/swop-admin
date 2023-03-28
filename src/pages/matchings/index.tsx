import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { config, router } from 'utils';
import Filter from './components/Filter';
import List from './components/List';
import ModalFilter from './components/ModalFilter';
import NumberCard from 'components/NumberCard';

class Matchings extends PureComponent<IConnectState> {
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
    const { location, matchings, dispatch } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(matchings?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilterChange={(value) => {
          this.handleRefresh({
            ...value,
            page: matchings?.pagination?.current || 1,
            limit: matchings?.pagination?.pageSize || config.defaultPageSizeSmall,
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'matchings/showModalFilter',
          });
        }}
      />
    );
  }

  renderList() {
    const { matchings, loading } = this.props;

    return (
      <List
        dataSource={matchings?.list}
        loading={loading.effects['matchings/getListMatching']}
        pagination={matchings?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, app, matchings, loading } = this.props;

    return (
      <ModalFilter
        item={matchings?.currentItem}
        filter={matchings?.filter}
        constants={app?.appConstants}
        visible={matchings?.modalFilterVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`matchings/filterMatching`]}
        title={'Filter Matchings'}
        onAccept={(data) => {
          dispatch({
            type: `matchings/filterMatching`,
            payload: {
              ...data,
              limit: matchings?.pagination?.pageSize || config.defaultPageSizeSmall,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'matchings/hideModalFilter',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: 'matchings/filterMatching',
            payload: {
              isClear: true,
              page: matchings?.pagination?.current,
              limit: matchings?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderStats() {
    const { matchings, loading } = this.props;
    return (
      <Row gutter={[48, 48]}>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['matchings/getMatchingStats']}
            subTitle="New Matching Accepted Yesterday"
            number={matchings?.matchingStats?.total_matching_accepted_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['matchings/getMatchingStats']}
            subTitle="New Matching Defaulted Yesterday"
            number={matchings?.matchingStats?.total_matching_defaulted_yesterday || 0}
          />
        </Col>
        <Col lg={8} md={24}>
          <NumberCard
            bordered
            loading={loading.effects['matchings/getMatchingStats']}
            subTitle="New Matching Completed Yesterday"
            number={matchings?.matchingStats?.total_matching_completed_yesterday || 0}
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
        {this.renderModalFilter()}
      </Page>
    );
  }
}

export default connect(({ app, matchings, loading }: IConnectState) => ({
  app,
  matchings,
  loading,
}))(Matchings);
