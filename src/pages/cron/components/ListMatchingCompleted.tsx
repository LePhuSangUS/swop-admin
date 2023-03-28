import React from 'react';
import { Table, Tooltip, Tag, Row, Button } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IMatchingCompleted } from 'types';
import {
  getSwopLogisticMethodColor,
  getMatchingStatusColor,
  getSwopStatusColor,
} from 'utils/theme';
import {
  getSwopLogisticMethodDisplay,
  getMatchingStatusDisplay,
  getSwopStatusDisplay,
} from 'utils/mapping';
import { secondsToMoment } from 'utils/date';
import { Link } from 'umi';
import styles from './ListMatchingCompleted.less';

interface Props extends TableProps<IMatchingCompleted> {
  onDispatchJob: (name: string) => void;
  dispatching: boolean;
}

const ListMatchingCompleted = (props: Props) => {
  const { onDispatchJob, dispatching } = props;
  const columns: Array<ColumnProps<IMatchingCompleted>> = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: styles.name,
      width: 200,
      render: (text, record) => (
        <Link to={`/swops/${record.id}`}>
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
      render: (text, record) => (
        <Link to={`/matchings/${record?.id}`}>{record.reference_code}</Link>
      ),
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
      <Tooltip title="track_matching_completed">
        <strong>Matching Completed In Future</strong>
      </Tooltip>
      <Button
        loading={dispatching}
        onClick={() => onDispatchJob && onDispatchJob('track_matching_completed')}
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
      <div className={styles.footer}>
        <div className={styles.footerTag}>
          <strong>Logistic Methods: </strong>
          <Tag color={getSwopLogisticMethodColor('self')}>
            {getSwopLogisticMethodDisplay('self')}
          </Tag>
          <Tag color={getSwopLogisticMethodColor('laundry')}>
            {getSwopLogisticMethodDisplay('laundry')}
          </Tag>
        </div>
        <div className={styles.footerTag}>
          <span>
            <strong>Note: </strong>Delay 3 days{' '}
          </span>
        </div>
        <div>
          <strong>Condition: </strong>
          Swop's status is{' '}
          <Tag color={getSwopStatusColor('return_delivered')}>
            {getSwopStatusDisplay('return_delivered')}
          </Tag>
        </div>
      </div>
    </>
  );
};

export default ListMatchingCompleted;
