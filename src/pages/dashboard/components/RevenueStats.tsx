import React from 'react';
import { Tooltip, Calendar, Spin, Card } from 'antd';
import { CalendarMode } from 'antd/lib/calendar';
import { IStatsRevenue } from 'types';
import moment, { Moment } from 'moment';
import styles from './RevenueStats.less';
import { formatMoneyCurrency } from 'utils/money';

interface Props {
  loading: boolean;
  records: IStatsRevenue[];
  onDateChanged: (from: number, to: number) => void;
}
const RevenueStats = (props: Props) => {
  const { records, onDateChanged, loading } = props;
  const onPanelChanged = (date: Moment, mode: CalendarMode) => {
    onDateChanged(date.startOf('month').unix(), date.endOf('month').unix());
  };

  const onChanged = (date: Moment) => {};

  const dateCellRender = (value: Moment) => {
    const item = records?.find((item) => moment(item.date).date() === value.date());
    const totalDeliveryCharges = !!item
      ? formatMoneyCurrency(item?.total_delivery_charges || 0, item.currency)
      : 0;
    const totalLaundryEarnings = !!item
      ? formatMoneyCurrency(item?.total_laundry_earnings || 0, item.currency)
      : 0;
    const totalSwopFee = !!item ? formatMoneyCurrency(item?.total_swop_fee || 0, item.currency) : 0;
    return (
      <Tooltip
        title={
          <div className={styles.col}>
            <span
              className={styles.textSmall}
            >{`Total Delivery Charges: ${totalDeliveryCharges}`}</span>
            <span
              className={styles.textSmall}
            >{`Total Laundry Earning: ${totalLaundryEarnings}`}</span>
            <span className={styles.textSmall}>{`Total Swop Fee: ${totalSwopFee}`}</span>
          </div>
        }
      >
        <div className={styles.col}>
          <span>{totalDeliveryCharges}</span>
          <span>{totalLaundryEarnings}</span>
          <span>{totalSwopFee}</span>
        </div>
      </Tooltip>
    );
  };

  return (
    <Card title="Revenue">
      <Spin spinning={loading}>
        <Calendar
          dateCellRender={dateCellRender}
          onPanelChange={onPanelChanged}
          onChange={onChanged}
        />
      </Spin>
    </Card>
  );
};

export default RevenueStats;
