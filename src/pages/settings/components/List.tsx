import React from 'react';
import { Table, Card } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IPriceSetting } from 'types';
import styles from './List.less';
import { formatMoneyCurrency } from 'utils/money';

interface IListProps extends TableProps<IPriceSetting> {
  onEditItem: (record: IPriceSetting) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IPriceSetting, e: any) => {
    const { onEditItem } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    }
  };

  render() {
    const { ...tableProps } = this.props;
    const columns: Array<ColumnProps<IPriceSetting>> = [
      {
        title: 'Country',
        key: 'country',
        width: 200,
        render: (text, record) => <span>{record.country}</span>,
      },
      {
        title: 'Currency',
        key: 'currency',
        width: 200,
        render: (text, record) => <span>{record.currency}</span>,
      },
      {
        title: 'Delivery Per Km',
        key: 'delivery_per_km',
        width: 200,
        render: (text, record) => (
          <span>{formatMoneyCurrency(record.delivery_per_km, record.currency)}</span>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          let menuOptions = [{ key: '1', name: 'Update' }];

          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
            />
          );
        },
      },
    ];

    return (
      <Card title="Price Settings">
        <Table
          {...tableProps}
          pagination={false}
          className={styles.table}
          bordered={true}
          columns={columns}
          rowKey={(record) => `${record?.country_code}`}
        />
      </Card>
    );
  }
}

export default List;
