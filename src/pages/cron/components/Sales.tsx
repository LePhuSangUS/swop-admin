import React from 'react';
import Link from 'umi/link';
import { Ellipsis } from 'ant-design-pro';
import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { ISale } from 'types';
import { formatMoney } from 'utils/money';
import styles from './Sales.less';

interface IListProps extends TableProps<ISale> {}

class Sales extends React.PureComponent<IListProps> {
  render() {
    const { ...tableProps } = this.props;

    const columns: Array<ColumnProps<ISale>> = [
      {
        title: 'Name',
        key: 'name',
        width: 200,
        render: (_, record) => (
          <Link to={`locations/${record.id}`}>
            <Ellipsis tooltip lines={1}>
              {record?.name}
            </Ellipsis>
          </Link>
        ),
      },
      {
        title: 'Total Orders',
        key: 'total_order',
        width: 200,
        render: (_, record) => <span>{`${record.total_order}`}</span>,
      },
      {
        title: 'Total Items',
        key: 'total_item',
        width: 200,
        render: (_, record) => <span>{record?.total_item}</span>,
      },
      {
        title: 'Discount',
        key: 'discount',
        width: 200,
        render: (_, record) => <span>{formatMoney(record.discount)}</span>,
      },
      {
        title: 'Net',
        key: 'net',
        width: 200,
        render: (_, record) => <span>{formatMoney(record.net)}</span>,
      },
    ];

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `Total ${total} Items`,
        }}
        className={styles.table}
        bordered={true}
        columns={columns}
        rowKey={(record) => `${record.id}`}
        scroll={{ x: 'calc(700px + 50%)' }}
      />
    );
  }
}

export default Sales;
