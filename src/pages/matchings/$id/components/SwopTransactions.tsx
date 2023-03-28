import React from 'react';
import { Table, Tooltip, Card } from 'antd';
import { IConstants, ITransaction } from 'types';
import { IColumnProps, ITableProps } from 'types';
import { Link } from 'umi';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import { formatMoneyCurrency } from 'utils/money';
import SyntaxHighlight from 'components/SyntaxHighlight';
import { Icon } from '@ant-design/compatible';

interface IListProps extends ITableProps<ITransaction> {
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  render() {
    const { constants, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ITransaction>> = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: (text, record) => {
          return (
            <Ellipsis lines={1} tooltip>
              {record?.title}
            </Ellipsis>
          );
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        render: (text, record) => {
          return (
            <Ellipsis lines={1} tooltip>
              {record?.description}
            </Ellipsis>
          );
        },
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        render: (text, record) => (
          <Ellipsis tooltip>{formatMoneyCurrency(record?.amount, record?.currency)}</Ellipsis>
        ),
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        width: 120,
        render: (text, record) => (
          <Ellipsis tooltip>{formatMoneyCurrency(record?.balance, record?.currency)}</Ellipsis>
        ),
      },
      {
        title: 'Other Swop ID',
        dataIndex: 'other_swop_id',
        key: 'other_swop_id',
        width: 200,
        render: (text, record) => (
          <Link to={`/swops/${record.other_swop_id}`}>{record.other_swop_id}</Link>
        ),
      },
      {
        title: 'Metadata',
        dataIndex: 'metadata',
        key: 'metadata',
        width: 100,
        render: (text, record) => (
          <Tooltip
            title={<SyntaxHighlight collapsed={false} theme="bright" object={record?.metadata} />}
          >
            <Icon type="info-circle" />
          </Tooltip>
        ),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 240,
        render: (text, record) => <span>{formatDate(record.created_at)}</span>,
      },
    ];

    return (
      <Card title="Transactions">
        <Table
          style={{ height: 480 }}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `Total ${total} Items`,
          }}
          bordered={true}
          scroll={{ x: 1100, y: 400 }}
          columns={columns}
          rowKey={(record) => `${record.id}`}
        />
      </Card>
    );
  }
}

export default List;
