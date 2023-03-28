import React from 'react';
import Link from 'umi/link';
import { Table, Tooltip, Tag, Divider } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IMatching } from 'types';
import {
  getMatchingStatusDisplay,
  getSwopLogisticMethodDisplay,
  getSwopStatusDisplay,
} from 'utils/mapping';
import {
  getMatchingStatusColor,
  getSwopLogisticMethodColor,
  getSwopStatusColor,
} from 'utils/theme';
import styles from './List.less';
import { Ellipsis } from 'ant-design-pro';
import { formatMoneyCurrency } from 'utils/money';

interface IListProps extends TableProps<IMatching> {}

class List extends React.PureComponent<IListProps> {
  render() {
    const { ...tableProps } = this.props;
    const columns: Array<ColumnProps<IMatching>> = [
      {
        title: 'Swop Code',
        key: 'swop_code',
        width: 120,
        render: (text, record) => (
          <Link to={`matchings/${record.id}`}>{record.reference_code}</Link>
        ),
      },
      {
        title: 'Matchong Status',
        key: 'matching_status',
        width: 180,
        render: (text, record) => (
          <Tooltip title={record.status}>
            <Tag color={getMatchingStatusColor(record.status)}>
              {getMatchingStatusDisplay(record.status)}
            </Tag>
          </Tooltip>
        ),
      },
      {
        title: 'Swop Type',
        key: 'swop_type',
        width: 250,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              <Tooltip title={record.swop?.logistic_method}>
                <Tag color={getSwopLogisticMethodColor(record?.swop?.logistic_method)}>
                  {getSwopLogisticMethodDisplay(record?.swop?.logistic_method)}
                </Tag>
              </Tooltip>
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              <Tooltip title={record?.counter_swop?.logistic_method}>
                <Tag color={getSwopLogisticMethodColor(record?.counter_swop?.logistic_method)}>
                  {getSwopLogisticMethodDisplay(record?.counter_swop?.logistic_method)}
                </Tag>
              </Tooltip>
            </div>
          </>
        ),
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
        width: 260,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              <Link to={`/users/${record.user?.id}`}>
                <Ellipsis style={{ textAlign: 'left' }} tooltip lines={1}>
                  {record.user?.name}
                </Ellipsis>
              </Link>
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              <Link to={`/users/${record.counter?.id}`}>
                <Ellipsis style={{ textAlign: 'left' }} tooltip lines={1}>
                  {record.counter?.name}
                </Ellipsis>
              </Link>
            </div>
          </>
        ),
      },
      {
        title: 'Phone Number',
        key: 'phone_number',
        width: 260,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              <div>
                <Ellipsis tooltip lines={1}>
                  {record.user?.phone}
                </Ellipsis>
              </div>
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              <div>
                <Ellipsis tooltip lines={1}>
                  {record.counter?.phone}
                </Ellipsis>
              </div>
            </div>
          </>
        ),
      },
      {
        title: 'Swop Status',
        key: 'swop_status',
        width: 280,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              <Tooltip title={record?.swop?.status}>
                <Tag color={getSwopStatusColor(record?.swop?.status)}>
                  {getSwopStatusDisplay(record?.swop?.status)}
                </Tag>
              </Tooltip>
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              <Tooltip title={record?.counter_swop?.status}>
                <Tag color={getSwopStatusColor(record?.counter_swop?.status)}>
                  {getSwopStatusDisplay(record?.counter_swop?.status)}
                </Tag>
              </Tooltip>
            </div>
          </>
        ),
      },
      {
        title: 'Laundry',
        key: 'laundry',
        width: 250,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              <Link to={`/laundries/${record.swop?.laundry?.id}`}>
                <span>{record.swop?.laundry?.name}</span>
              </Link>
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              <Link to={`/laundries/${record.counter_swop?.laundry?.id}`}>
                <span>{record.counter_swop?.laundry?.name}</span>
              </Link>
            </div>
          </>
        ),
      },
      {
        title: 'Cleaning Charges Till Now',
        key: 'cleaning_charges',
        width: 250,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              {formatMoneyCurrency(record?.swop?.cleaning_fee_deduct, record?.swop?.currency)}
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              {formatMoneyCurrency(
                record?.counter_swop?.cleaning_fee_deduct,
                record?.counter_swop?.currency,
              )}
            </div>
          </>
        ),
      },
      {
        title: 'Delivery Charges Till Now',
        key: 'delivery_charges',
        width: 250,
        render: (text, record) => (
          <>
            <div className={styles.row}>
              <span className={styles.leftLabel}>Swopper</span>
              {formatMoneyCurrency(record?.swop?.delivery_fee_deduct, record?.swop?.currency)}
            </div>
            <Divider type="horizontal" />
            <div className={styles.row}>
              <span className={styles.leftLabel}>C.Swopper</span>
              {formatMoneyCurrency(
                record?.counter_swop?.delivery_fee_deduct,
                record?.counter_swop?.currency,
              )}
            </div>
          </>
        ),
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
        scroll={{ x: 1000 }}
        columns={columns}
        rowKey={(record) => `${record?.id}`}
      />
    );
  }
}

export default List;
