import React from 'react';
import { Carousel } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import theme from 'utils/theme';
import Header from './components/Header';
import ListLook from './components/ListLook';
import ModalLook from './components/ModalLook';
import ModalLookDress from './components/ModalLookDress';
import config from 'utils/config';
import Filter from './components/Filter';
import styles from './index.less';

class Look extends React.PureComponent<IConnectState> {
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
    const { collectionDetails, dispatch } = this.props;
    return (
      <Header
        onAddLook={() => {
          dispatch({
            type: 'collectionDetails/showModalLook',
            payload: {
              modalLookType: 'add',
            },
          });
        }}
        collection={collectionDetails?.collection}
      />
    );
  }

  renderListLook() {
    const { collectionDetails, dispatch, app, loading } = this.props;
    return (
      <ListLook
        dataSource={collectionDetails?.looks?.list}
        constants={app?.appConstants}
        loading={
          loading.effects['collectionDetails/getListLook'] ||
          loading.effects['collectionDetails/addLookDressSuccess']
        }
        pagination={collectionDetails?.looks?.pagination}
        rowSelection={null}
        onChange={(page) => {
          dispatch({
            type: 'collectionDetails/getListLook',
            payload: {
              collection_id: collectionDetails?.collection?.id,
              limit: page.pageSize,
              page: page.current,
            },
          });
        }}
        onUpdateLookDress={(look, record) => {
          dispatch({
            type: 'collectionDetails/showModalLookDress',
            payload: {
              currentLook: look,
              currentLookDress: record,
              modalLookDressType: 'update',
            },
          });
        }}
        onRemoveLookDress={(look_id, id) => {
          dispatch({
            type: 'collectionDetails/removeLookDress',
            payload: {
              id,
              look_id,
            },
          });
        }}
        onAddDress={(record) => {
          dispatch({
            type: 'collectionDetails/showModalLookDress',
            payload: {
              currentLook: record,
              modalLookDressType: 'add',
            },
          });
        }}
        onEditLook={(record) => {
          dispatch({
            type: 'collectionDetails/showModalLook',
            payload: {
              modalLookType: 'update',
              currentLook: record,
            },
          });
        }}
        onRemoveLook={(id) => {
          dispatch({
            type: 'collectionDetails/removeLook',
            payload: {
              id,
            },
          });
        }}
      />
    );
  }

  renderModalLook() {
    const { dispatch, app, collectionDetails, loading } = this.props;

    if (!collectionDetails?.modalLookVisible) {
      return null;
    }

    return (
      <ModalLook
        collection={collectionDetails?.collection}
        item={collectionDetails?.modalLookType === 'add' ? null : collectionDetails?.currentLook}
        constants={app?.appConstants}
        visible={collectionDetails?.modalLookVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={
          loading.effects[`collectionDetails/${collectionDetails?.modalLookType}Look`]
        }
        title={`${collectionDetails?.modalLookType === 'add' ? 'Add Look' : 'Update Look'}`}
        onAccept={(data) => {
          dispatch({
            type: `collectionDetails/${collectionDetails?.modalLookType}Look`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'collectionDetails/hideModalLook',
          });
        }}
      />
    );
  }

  renderModalLookDress() {
    const { dispatch, app, collectionDetails, loading } = this.props;

    if (!collectionDetails?.modalLookDressVisible) {
      return null;
    }

    return (
      <ModalLookDress
        item={collectionDetails?.currentLookDress}
        look={collectionDetails?.currentLook}
        constants={app?.appConstants}
        visible={collectionDetails?.modalLookDressVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`collectionDetails/addLookDress`]}
        title={collectionDetails?.modalLookDressType === 'add' ? 'Add Dress' : 'Update Dress'}
        onAccept={(data) => {
          dispatch({
            type: `collectionDetails/${collectionDetails?.modalLookDressType}LookDress`,
            payload: data,
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'collectionDetails/hideModalLookDress',
          });
        }}
      />
    );
  }

  renderFilter() {
    const { location, dispatch, collectionDetails } = this.props;
    const { query } = location;

    return (
      <Filter
        hasDefaultFilter={Object.values(collectionDetails?.filter || {}).length > 0}
        filter={{ ...query }}
        onFilterChange={(value) => {
          dispatch({
            type: `collectionDetails/getListLook`,
            payload: {
              ...value,
              collection_id: collectionDetails?.collection?.id,
              limit: collectionDetails?.looks?.pagination?.current || config.defaultPageSize,
            },
          });
        }}
        onFilter={() => {
          dispatch({
            type: 'collectionDetails/showModalFilterLook',
          });
        }}
      />
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <Page inner={true} loading={loading.effects['collectionDetails/getCollection']}>
        {this.renderHeader()}
        <br />
        <br />
        {this.renderListLook()}
        {this.renderModalLook()}
        {this.renderModalLookDress()}
      </Page>
    );
  }
}

export default connect(({ collectionDetails, app, loading }: IConnectState) => ({
  collectionDetails,
  app,
  loading,
}))(Look);
