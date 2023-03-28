import React from 'react';
import { Table, Tooltip, Modal } from 'antd';
import { IConstants, ITransaction } from 'types';
import { IColumnProps, ITableProps } from 'types';
import { Link } from 'umi';
import styles from './Transactions.less';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import { formatMoneyCurrency } from 'utils/money';
import SyntaxHighlight from 'components/SyntaxHighlight';
import { Icon } from '@ant-design/compatible';

const { confirm } = Modal;

interface IListProps extends ITableProps<ITransaction> {
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  render() {
    const { constants, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ITransaction>> = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 180,
        render: (text, record) => {
          return <Tooltip title={record?.id}>{record?.type}</Tooltip>;
        },
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 200,
        render: (text, record) => (
          <Ellipsis tooltip>{formatMoneyCurrency(record?.amount, record?.currency)}</Ellipsis>
        ),
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        width: 200,
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
          <Tooltip title={<SyntaxHighlight object={record?.metadata} />}>
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
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `Total ${total} Items`,
        }}
        className={styles.table}
        bordered={true}
        scroll={{ x: 1100 }}
        columns={columns}
        rowKey={(record) => `${record.id}`}
      />
    );
  }
}

export default List;
