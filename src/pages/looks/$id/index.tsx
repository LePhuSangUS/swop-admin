import React from 'react';
import { Carousel, Card } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import theme from 'utils/theme';
import Header from './components/Header';
import ListLookDress from './components/ListLookDress';
import ModalFilterLook from './components/ModalFilterLook';
import config from 'utils/config';
import Filter from './components/Filter';
import ModalLookDress from './components/ModalLookDress';
import styles from './index.less';

class LookDetails extends React.PureComponent<IConnectState> {
  renderCover() {
    return (
      <Carousel
        style={{ width: '100%', height: 460, backgroundColor: theme.colors.background }}
        autoplay
      >
        {}
      </Carousel>
    );
  }

  renderHeader() {
    const { lookDetails, dispatch } = this.props;
    return (
      <Header
        onAddLookDress={() => {
          dispatch({
            type: 'lookDetails/showModalLookDress',
            payload: {
              modalLookType: 'add',
            },
          });
        }}
        look={lookDetails?.look}
      />
    );
  }

  renderListLook() {
    const { lookDetails, dispatch, app, loading } = this.props;
    return (
      <ListLookDress
        dataSource={lookDetails?.lookDresses?.list}
        constants={app?.appConstants}
        loading={loading.effects['lookDetails/getListLookDress']}
        pagination={lookDetails?.lookDresses?.pagination}
        rowSelection={null}
        onChange={(page) => {
          dispatch({
            type: 'lookDetails/getListLookDress',
            payload: {
              look_id: lookDetails?.look?.id,
              limit: page.pageSize,
              page: page.current,
            },
          });
        }}
        onEditItem={(record) => {
          dispatch({
            type: 'lookDetails/showModalLookDress',
            payload: {
              modalLookDressType: 'update',
              currentLookDress: record,
            },
          });
        }}
        onRemoveItem={(id) => {
          dispatch({
            type: 'lookDetails/removeLookDress',
            payload: {
              id,
            },
          });
        }}
      />
    );
  }
  renderModalLook() {
    const { dispatch, app, lookDetails, loading } = this.props;

    return (
      <ModalLookDress
        look={lookDetails?.look}
        item={lookDetails?.modalLookDressType === 'add' ? null : lookDetails?.currentLookDress}
        constants={app?.appConstants}
        visible={lookDetails?.modalLookDressVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`lookDetails/${lookDetails?.modalLookDressType}LookDress`]}
        title={`${lookDetails?.modalLookDressType === 'add' ? 'Add Dress' : 'Update Dress'}`}
        onAccept={(data) => {
          dispatch({
            type: `lookDetails/${lookDetails?.modalLookDressType}LookDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'lookDetails/hideModalLookDress',
          });
        }}
      />
    );
  }

  renderModalFilter() {
    const { dispatch, app, lookDetails, loading } = this.props;

    return (
      <ModalFilterLook
        filter={lookDetails?.filter}
        constants={app?.appConstants}
        visible={lookDetails?.modalFilterLookVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`lookDetails/filterLook`]}
        title={'Filter Looks'}
        onAccept={(data) => {
          dispatch({
            type: `lookDetails/filterLook`,
            payload: {
              ...data,
              look_id: lookDetails?.look?.id,
              limit: lookDetails?.lookDresses?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'lookDetails/hideModalFilterLook',
          });
        }}
        onClearFilter={() => {
          dispatch({
            type: `lookDetails/filterLook`,
            payload: {
              isClear: true,
              collection_id: lookDetails?.look?.id,
              page: lookDetails?.lookDresses?.pagination?.current,
              limit: lookDetails?.lookDresses?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
      />
    );
  }

  renderFilter() {
    const { location, dispatch, lookDetails } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(lookDetails?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilterChange={(value) => {
          dispatch({
            type: `lookDetails/getListLook`,
            payload: {
              ...value,
              look_id: lookDetails?.look?.id,
              limit: lookDetails?.lookDresses?.pagination?.pageSize || config.defaultPageSize,
            },
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'lookDetails/showModalFilterLook',
          });
        }}
      />
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <Page inner={true} loading={loading.effects['lookDetails/getCollection']}>
        {this.renderHeader()}
        <br />
        <br />
        {/* <Card>{this.renderFilter()} </Card> */}
        {this.renderListLook()}
        {this.renderModalLook()}
        {this.renderModalFilter()}
      </Page>
    );
  }
}

export default connect(({ lookDetails, app, loading }: IConnectState) => ({
  lookDetails,
  app,
  loading,
}))(LookDetails);
