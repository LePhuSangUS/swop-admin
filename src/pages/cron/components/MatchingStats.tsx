import React from 'react';
import { Tag, Table, Tooltip } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IMatchingStats } from 'types';
import { getMatchingStatusDisplay } from 'utils/mapping';
import { getMatchingStatusColor } from 'utils/theme';
import styles from './MatchingStats.less';

interface Props extends TableProps<IMatchingStats> {}
const MatchingStats = (props: Props) => {
  const columns: Array<ColumnProps<IMatchingStats>> = [
    {
      title: 'Status',
      dataIndex: 'status',
      className: styles.name,
      render: (text, record) => (
        <Tooltip title={record.status}>
          <Tag color={getMatchingStatusColor(record.status)}>
            {getMatchingStatusDisplay(record.status)}
          </Tag>
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

  const renderTitle = () => <strong>Matching Statistics</strong>;

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

export default MatchingStats;
