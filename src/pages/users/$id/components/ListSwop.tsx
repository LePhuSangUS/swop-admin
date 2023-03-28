import React from 'react';
import { Table, Card, Tooltip, Tag } from 'antd';
import { IConstants, ISwop } from 'types';
import { getSwopStatusDisplay } from 'utils/mapping';
import { getAccountStatusColor, getSwopStatusColor } from 'utils/theme';
import { IColumnProps, ITableProps } from 'types';
import { Link } from 'umi';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';

interface IListProps extends ITableProps<ISwop> {
  constants: IConstants;
}

class ListSwop extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ISwop, e: any) => {};

  render() {
    const { constants, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ISwop>> = [
      {
        title: 'Photo',
        key: 'photo',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
          <Link to={`/swops/${record.id}`}>
            {record?.dress?.photos?.map((item, index) => (
              <img height={120} src={item} />
            ))}
          </Link>
        ),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 180,
        render: (text, record) => {
          const value = constants?.dress_categories?.find(
            (item) => item?.alias === record?.dress?.category,
          );
          return <Tooltip title={value?.alias}>{value?.title}</Tooltip>;
        },
      },
      {
        title: 'Owner Location City',
        dataIndex: 'owner_location_city',
        key: 'owner_location_city',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record?.user?.coordinate?.city}</Ellipsis>,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record.user?.phone}</Ellipsis>,
      },
      {
        title: 'Swop Location City',
        dataIndex: 'location_city',
        key: 'location_city',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record.coordinate?.city}</Ellipsis>,
      },
      {
        title: 'Swop Code',
        dataIndex: 'reference_code',
        key: 'reference_code',
        width: 200,
        render: (text, record) => (
          <Link to={`/matchings/${record.matching_id}`}>{record.reference_code}</Link>
        ),
      },
      {
        title: 'Swop Since',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        render: (_, record) => (
          <Tooltip title={record.created_at}>
            <span>{formatDate(record.created_at)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Swop Status',
        key: 'swop_status',
        width: 190,
        render: (text, record) => (
          <Tag color={getSwopStatusColor(record.status)}>{getSwopStatusDisplay(record.status)}</Tag>
        ),
      },
      {
        title: 'Admin Status',
        key: 'admin_status',
        width: 120,
        render: (text, record) => (
          <Tag color={getAccountStatusColor(record?.deleted_at)}>
            {record.deleted_at ? 'Banned' : 'Permitted'}
          </Tag>
        ),
      },
    ];

    return (
      <Card title="In Swops">
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `Total ${total} Items`,
          }}
          className={styles.table}
          bordered={true}
          scroll={{ x: 1900, y: 480 }}
          columns={columns}
          rowKey={(record) => `${record.id}`}
        />
      </Card>
    );
  }
}

export default ListSwop;
