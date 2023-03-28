import React from 'react';
import { Table, Tooltip, Tag, Row, Button } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { ISwopPicked } from 'types';
import { getSwopLogisticMethodColor, getSwopStatusColor } from 'utils/theme';
import { getSwopLogisticMethodDisplay, getSwopStatusDisplay } from 'utils/mapping';
import { secondsToMoment } from 'utils/date';
import { Link } from 'umi';
import styles from './ListSwopReturnShipped.less';

interface Props extends TableProps<ISwopPicked> {
  onDispatchJob: (name: string) => void;
  dispatching: boolean;
}

const ListSwopReturnShipped = (props: Props) => {
  const { onDispatchJob, dispatching } = props;
  const columns: Array<ColumnProps<ISwopPicked>> = [
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
      <Tooltip title="track_swop_return_shipped">
        <strong>Swops Shipped End Of Day</strong>
      </Tooltip>
      <Button
        loading={dispatching}
        onClick={() => onDispatchJob && onDispatchJob('track_swop_return_shipped')}
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
          <Tag color={getSwopLogisticMethodColor('laundry')}>
            {getSwopLogisticMethodDisplay('laundry')}
          </Tag>
        </div>
        <div className={styles.footerTag}>
          <span>
            <strong>Note: </strong> if the driver shipped cloth by end of day pick up
            <ul>
              <li>YES: Mark as return shipped</li>
              <li>
                NO: Attempts to ship in the next day with same timeslot of ReturnDeliveryScheduled
              </li>
            </ul>
          </span>
        </div>
        <div>
          <strong>Condition: </strong>
          Swop's status is{' '}
          <Tag color={getSwopStatusColor('pick_up_assigned')}>
            {getSwopStatusDisplay('pick_up_assigned')}
          </Tag>
        </div>
      </div>
    </>
  );
};

export default ListSwopReturnShipped;
