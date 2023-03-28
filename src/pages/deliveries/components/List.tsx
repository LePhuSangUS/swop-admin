import React from 'react';
import { Table, Tag } from 'antd';
import { DropOption, Location } from 'components';
import { getSwopStatusDisplay } from 'utils/mapping';
import { getSwopStatusColor } from 'utils/theme';
import { IColumnProps, ITableProps, ISwop, IConstants } from 'types';
import { Link } from 'umi';
import { getDeliveryDate, getDeliveryTimeSlot } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';
import { generateSwopCode } from 'utils';

interface IListProps extends ITableProps<ISwop> {
  constants: IConstants;
  onAssign: (record: ISwop) => void;
  onUpdate: (record: ISwop) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ISwop, e: any) => {
    const { onAssign, onUpdate } = this.props;

    if (e.key === '1') {
      onAssign(record);
    } else if (e.key === '2') {
      onUpdate(record);
    }
  };

  render() {
    const { constants, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ISwop>> = [
      {
        title: 'Delivery Date',
        key: 'delivery_date',
        width: 150,
        render: (text, record) => <span>{getDeliveryDate(record)}</span>,
      },
      {
        title: 'Time Slot',
        key: 'time_slot',
        width: 200,
        render: (text, record) => <span>{getDeliveryTimeSlot(record)}</span>,
      },
      {
        title: 'Swop Code',
        key: 'reference_code',
        width: 150,
        render: (text, record) => (
          <Link to={`/matchings/${record?.matching_id}`}>
            {generateSwopCode(record?.reference_code, record?.user?.phone)}
          </Link>
        ),
      },
      {
        title: 'Swop Location',
        key: 'swop_location',
        width: 300,
        render: (text, record) => (
          <Location
            location={{
              address: record?.coordinate?.formatted_address,
              google_place_id: record.coordinate?.google_place_id,
              lat: record.coordinate?.lat,
              lng: record.coordinate?.lng,
            }}
          />
        ),
      },
      {
        title: 'Laundry Name',
        key: 'laundry_name',
        width: 160,
        render: (text, record) => {
          const laundry = record.laundry;

          return (
            <Ellipsis lines={1} tooltip>
              <Link to={`/laundries/${laundry?.id}`}>{laundry?.name}</Link>
            </Ellipsis>
          );
        },
      },
      {
        title: 'Laundry Location',
        key: 'laundry_location',
        width: 300,
        render: (text, record) => {
          const laundry = record.laundry;
          return (
            <Location
              location={{
                address: laundry?.coordinate?.formatted_address,
                google_place_id: laundry?.coordinate?.google_place_id,
                lat: laundry?.coordinate?.lat,
                lng: laundry?.coordinate?.lng,
              }}
            />
          );
        },
      },
      {
        title: 'User Name',
        key: 'user_name',
        width: 200,
        render: (text, record) => (
          <Link to={`/user/${record.user_id}`}>
            <Ellipsis tooltip>{record?.user?.name}</Ellipsis>
          </Link>
        ),
      },
      {
        title: "User's Phone",
        key: 'user_phone',
        width: 150,
        render: (text, record) => <span>{record?.user?.phone}</span>,
      },
      {
        title: 'Cloth Category Type',
        key: 'cloth_category',
        width: 220,
        render: (text, record) => {
          const category = constants?.dress_categories?.find(
            (item) => item?.alias === record?.dress?.category,
          );
          const type = category?.types?.find((item) => item?.alias === record?.dress?.type);
          return <Ellipsis tooltip lines={1}>{`${category?.title} • ${type?.title}`}</Ellipsis>;
        },
      },
      {
        title: 'Swop Status',
        key: 'swop_status',
        width: 220,
        render: (text, record) => (
          <Tag color={getSwopStatusColor(record.status)}>{getSwopStatusDisplay(record.status)}</Tag>
        ),
      },

      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => (
          <DropOption
            onMenuClick={(e) => this.handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Assign' },
              { key: '2', name: 'Update' },
            ]}
          />
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
        scroll={{ x: 2150 }}
        columns={columns}
        rowKey={(record) => `${record.id}`}
      />
    );
  }
}

export default List;
