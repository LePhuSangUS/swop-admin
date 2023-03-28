import React from 'react';
import { Table, Card } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { getCumulativeKeyDisplay } from 'utils/mapping';
import styles from './CumulativeChart.less';
import { IStatsCumulative } from 'types';

interface Props extends TableProps<object> {
  statsCumulative: IStatsCumulative;
}
const CumulativeChart = (props: Props) => {
  const { statsCumulative } = props;

  const data = Object.keys(statsCumulative || {})
    .filter((key) => key !== 'currency')
    .map((key: any) => ({
      name: getCumulativeKeyDisplay(key),
      value: statsCumulative[key],
    }));

  const columns: Array<ColumnProps<any>> = [
    {
      title: '',
      dataIndex: 'status',
      className: styles.name,
      render: (text, record) => (
        <strong>
          <span>{record.name}</span>
        </strong>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      className: styles.name,
      render: (text, record) => <span>{record.value}</span>,
    },
  ];

  const renderTitle = () => <strong>Cumulative</strong>;

  return (
    <Card>
      <Table
        className={styles.table}
        title={renderTitle}
        pagination={false}
        showHeader={false}
        columns={columns}
        rowKey="status"
        bordered={false}
        dataSource={data}
        {...props}
      />
    </Card>
  );
};

export default CumulativeChart;
