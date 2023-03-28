import React from 'react';
import { Table, Card } from 'antd';
import { IColumnProps, ITableProps } from 'types';
import { ILaundryPrice } from 'types';
import styles from './List.less';
import DropOption from 'components/DropOption/DropOption';

interface ILaundryPriceProps extends ITableProps<ILaundryPrice> {
  onEditItem?: (record: ILaundryPrice) => void;
}

class LaundryPrice extends React.PureComponent<ILaundryPriceProps> {
  handleMenuClick = (record: ILaundryPrice, e: any) => {
    const { onEditItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
    }
  };
  render() {
    const { onEditItem, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ILaundryPrice>> = [
      {
        title: 'Category',
        key: 'status',
        dataIndex: 'status',
        width: 240,
        render: (text, record) => <span>{record.cloth_category}</span>,
      },

      {
        title: 'Unit Price',
        key: 'unit_price',
        dataIndex: 'unit_price',
        width: 200,
        render: (text, record) => <span>{record.unit_price}</span>,
      },
      {
        title: 'Currency',
        key: 'currency',
        dataIndex: 'currency',
        width: 140,
        render: (text, record) => <span>{record.currency}</span>,
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={[{ key: '1', name: 'Update' }]}
            />
          );
        },
      },
    ];

    return (
      <Card title="Pricing">
        <Table
          {...tableProps}
          pagination={false}
          className={styles.table}
          bordered={true}
          scroll={{ x: 600 }}
          columns={columns}
          rowKey={(record) => `${record.cloth_category}`}
        />
      </Card>
    );
  }
}

export default LaundryPrice;
