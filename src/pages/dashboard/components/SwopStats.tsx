import React from 'react';
import { Tag, Table, Tooltip } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import styles from './SwopStats.less';
import { ISwopStats } from 'types';
import { getSwopStatusDisplay } from 'utils/mapping';
import { getSwopStatusColor } from 'utils/theme';

interface Props extends TableProps<ISwopStats> {}
const SwopStats = (props: Props) => {
  const columns: Array<ColumnProps<ISwopStats>> = [
    {
      title: 'Status',
      dataIndex: 'status',
      className: styles.name,
      render: (text, record) => (
        <Tooltip title={record.status}>
          <Tag color={getSwopStatusColor(record.status)}>{getSwopStatusDisplay(record.status)}</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      className: styles.name,
      render: (text, record) => <span>{record.total}</span>,
    },
  ];

  const renderTitle = () => <strong>Swop Statistics</strong>;
  return (
    <Table
      className={styles.table}
      title={renderTitle}
      pagination={false}
      showHeader={false}
      columns={columns}
      rowKey="status"
      bordered={false}
      {...props}
    />
  );
};

export default SwopStats;
