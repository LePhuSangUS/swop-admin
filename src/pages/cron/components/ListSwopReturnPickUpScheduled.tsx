import React from 'react';
import { Table, Tooltip, Tag, Button, Row } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { ISwopReturnPickUpScheduled } from 'types';
import { getSwopLogisticMethodColor, getSwopStatusColor } from 'utils/theme';
import { getSwopLogisticMethodDisplay, getSwopStatusDisplay } from 'utils/mapping';
import { secondsToMoment } from 'utils/date';
import { Link } from 'umi';
import styles from './ListSwopReturnPickUpScheduled.less';

interface Props extends TableProps<ISwopReturnPickUpScheduled> {
  onDispatchJob: (name: string) => void;
  dispatching: boolean;
}

const ListSwopReturnPickUpScheduled = (props: Props) => {
  const { onDispatchJob, dispatching } = props;
  const columns: Array<ColumnProps<ISwopReturnPickUpScheduled>> = [
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
          <Tag color={getSwopStatusColor(record.status)}>{getSwopStatusDisplay(record.status)}</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Swop Code',
      dataIndex: 'reference_code',
      className: styles.name,
      width: 120,
      render: (text, record) => (
        <Link to={`/matchings/${record?.matching_id}`}>{record.reference_code}</Link>
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
      <Tooltip title="track_swop_return_pick_up_scheduled">
        <strong>Swops Return Pick Up Scheduled In Future</strong>
      </Tooltip>
      <Button
        loading={dispatching}
        onClick={() => onDispatchJob && onDispatchJob('track_swop_return_pick_up_scheduled')}
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
          </Tag>{' '}
          <Tag color={getSwopLogisticMethodColor('laundry')}>
            {getSwopLogisticMethodDisplay('laundry')}
          </Tag>{' '}
        </div>
        <div className={styles.footerTag}>
          <span>
            <strong>Note:</strong> Auto scheduled after 2 days of time
          </span>{' '}
          <Tag color={getSwopStatusColor('pick_up_scheduled')}>
            {getSwopStatusDisplay('pick_up_scheduled')}
          </Tag>
          and shared the same time slot
        </div>
        <div>
          <span>
            <strong>Condition: </strong>
            <span>Swop's status </span>
            <Tag color={getSwopStatusColor('return_ready')}>
              {getSwopStatusDisplay('return_ready')}
            </Tag>
            <strong> AND </strong>
            <span>
              Counter Swop's status is <strong>one of </strong>
            </span>
            <Tag color={getSwopStatusColor('return_ready')}>
              {getSwopStatusDisplay('return_ready')}
            </Tag>
            <Tag color={getSwopStatusColor('return_received')}>
              {getSwopStatusDisplay('return_received')}
            </Tag>
          </span>
        </div>
      </div>
    </>
  );
};

export default ListSwopReturnPickUpScheduled;
