import React from 'react';
import Link from 'umi/link';
import { Button, Card, List, Skeleton } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { ICollection, IConstants, ILook } from 'types';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';

interface IProps {
  loading: boolean;
  hasLoadMore: boolean;
  looks: ILook[];
}
class ListLook extends React.Component<IProps> {
  onLoadMore = () => {};

  render() {
    const { hasLoadMore, loading, looks } = this.props;
    return (
      <List
        loading={loading}
        itemLayout="horizontal"
        loadMore={
          hasLoadMore && (
            <div
              style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
              }}
            >
              <Button onClick={this.onLoadMore}>Loading More</Button>
            </div>
          )
        }
        dataSource={looks}
        renderItem={(item) => (
          <List.Item
            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
          >
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Card.Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default ListLook;
