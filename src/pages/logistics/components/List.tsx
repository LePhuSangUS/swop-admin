import React from 'react';
import { Table } from 'antd';
import { IColumnProps, ITableProps, IConstants, IDeliveryExprotCSV } from 'types';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';

interface IListProps extends ITableProps<IDeliveryExprotCSV> {
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  renderSlice(text: string) {
    const parts = text.split(',');
    if (parts?.length > 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {parts?.map((item) => (
            <span>{item}</span>
          ))}
        </div>
      );
    }

    return (
      <Ellipsis tooltip lines={1}>
        {parts?.join(', ')}
      </Ellipsis>
    );
  }
  render() {
    const { constants, ...tableProps } = this.props;

    const columns: Array<IColumnProps<IDeliveryExprotCSV>> = [
      {
        title: 'Address',
        key: 'address',
        width: 300,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record?.address}
          </Ellipsis>
        ),
      },
      {
        title: 'City',
        key: 'city',
        width: 200,
        render: (text, record) => this.renderSlice(record.city),
      },
      {
        title: 'Notes',
        key: 'notes',
        width: 240,
        render: (text, record) => this.renderSlice(record.notes),
      },
      {
        title: 'Date',
        key: 'date',
        width: 130,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.date}
          </Ellipsis>
        ),
      },
      {
        title: 'Earliest Time',
        key: 'earliest_time',
        width: 130,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.earliest_time}
          </Ellipsis>
        ),
      },
      {
        title: 'Latest Time',
        key: 'latest_time',
        width: 130,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.latest_time}
          </Ellipsis>
        ),
      },
      {
        title: 'Time At Stop',
        key: 'time_at_stop',
        width: 130,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.time_at_stop}
          </Ellipsis>
        ),
      },
      {
        title: 'Products',
        key: 'products',
        width: 100,
        render: (text, record) => this.renderSlice(record.products),
      },
      {
        title: 'Recipient Name',
        key: 'recipient_name',
        width: 160,
        render: (text, record) => this.renderSlice(record.recipient_name),
      },
      {
        title: 'Recipient Phone Number',
        key: 'recipient_phone_number',
        width: 200,
        render: (text, record) => this.renderSlice(record.recipient_phone_number),
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
        rowKey={(record) => `${record.id}`}
      />
    );
  }
}

export default List;
