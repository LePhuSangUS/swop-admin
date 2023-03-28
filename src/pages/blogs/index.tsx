import React, { PureComponent } from 'react';
import { Row, Button } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { stringify } from 'qs';
import { IConnectState } from 'types';
import { router } from 'utils';
import List from './components/List';
import { Link } from 'umi';

class Blogs extends PureComponent<IConnectState> {
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

  renderList() {
    const { dispatch, app, blogs, loading } = this.props;
    const fetching = loading.effects['blogs/getListCollection'];
    return (
      <List
        dataSource={blogs?.list}
        constants={app?.appConstants}
        loading={fetching}
        pagination={blogs?.pagination}
        rowSelection={null}
        onChange={(page) => {
          this.handleRefresh({
            page: page.current,
            limit: page.pageSize,
          });
        }}
        onPublish={(id) => {
          dispatch({
            type: 'blogs/publishBlog',
            payload: {
              id,
            },
          });
        }}
        onDraft={(id) => {
          dispatch({
            type: 'blogs/draftBlog',
            payload: {
              id,
            },
          });
        }}
      />
    );
  }

  render() {
    return (
      <Page inner={true}>
        <Row type="flex" justify="end">
          <Button>
            <Link to="/blogs/create">Create Blog</Link>
          </Button>
        </Row>
        <br />
        {this.renderList()}
      </Page>
    );
  }
}

export default connect(({ blogs, app, loading }: IConnectState) => ({
  blogs,
  app,
  loading,
}))(Blogs);
