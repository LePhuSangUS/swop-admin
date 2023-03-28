import React from 'react';
import { Table, Tooltip, Tag, Row, Button } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IMatchingEarlyReturnProposed } from 'types';
import { getMatchingStatusColor } from 'utils/theme';
import { getMatchingStatusDisplay } from 'utils/mapping';
import { secondsToMoment } from 'utils/date';
import { Link } from 'umi';
import styles from './ListMatchingEarlyReturnProposed.less';

interface Props extends TableProps<IMatchingEarlyReturnProposed> {
  onDispatchJob: (name: string) => void;
  dispatching: boolean;
}

const ListMatchingEarlyReturnProposed = (props: Props) => {
  const { onDispatchJob, dispatching } = props;
  const columns: Array<ColumnProps<IMatchingEarlyReturnProposed>> = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: styles.name,
      width: 200,
      render: (text, record) => (
        <Link to={`/matchings/${record.id}`}>
          <span>{record.id}</span>
        </Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 180,
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
      title: 'Swop Code',
      dataIndex: 'reference_code',
      className: styles.name,
      width: 120,
      render: (text, record) => <span>{record.reference_code}</span>,
    },
    {
      title: 'Time Elapsed',
      width: 200,
      dataIndex: 'time_elapsed',
      className: styles.name,
      render: (text, record) => (
        <Tooltip title={record.time_elapsed}>
          <span>{secondsToMoment(record.time_elapsed)}</span>
        </Tooltip>
      ),
    },
  ];

  const renderTitle = () => (
    <Row type="flex" justify="space-between" align="middle">
      <Tooltip title="track_matching_early_return_proposed">
        <strong>Matchings Early Return Proposed In Future</strong>
      </Tooltip>
      <Button
        loading={dispatching}
        onClick={() => onDispatchJob && onDispatchJob('track_matching_early_return_proposed')}
      >
        Dispatch Job
      </Button>
    </Row>
  );

  return (
    <>
      <Table
        className={styles.table}
        title={renderTitle}
        pagination={false}
        columns={columns}
        rowKey="id"
        scroll={{ y: 240, x: 700 }}
        {...props}
      />
    </>
  );
};

export default ListMatchingEarlyReturnProposed;
