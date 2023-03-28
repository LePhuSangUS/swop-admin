import React from 'react';
import Link from 'umi/link';
import { Modal, Table, Tag } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { Coordinate, DropOption, Location } from 'components';
import { ILaundry } from 'types';
import { formatDate } from 'utils/date';
import { getLaundryStatusColor, getAdminLaundryStatusColor } from 'utils/theme';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';
import {
  getLaundryStatusDisplay,
  getAdminLaundryStatusDisplay,
  getFormattedAddress,
} from 'utils/mapping';

const { confirm } = Modal;
interface IListProps extends TableProps<ILaundry> {
  onDeleteItem: (recordID: string) => void;
  onActivate: (record: ILaundry) => void;
  onEditItem: (record: ILaundry) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ILaundry, e: any) => {
    const { onDeleteItem, onEditItem, onActivate } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      if (record.deleted_at) {
        onActivate(record);
      } else {
        confirm({
          title: 'Are you sure archive this record?',
          onOk() {
            onDeleteItem(record.id);
          },
        });
      }
    }
  };

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props;
    const columns: Array<ColumnProps<ILaundry>> = [
      {
        title: 'Laundry Name',
        key: 'id',
        width: 200,
        fixed: 'left',
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            <Link to={`laundries/${record.id}`}>{record.name}</Link>
          </Ellipsis>
        ),
      },
      {
        title: 'Location City',
        key: 'city',
        width: 320,
        render: (text, record) => (
          <Location
            location={{
              address: getFormattedAddress(record?.coordinate),
              google_place_id: record?.coordinate?.google_place_id,
              lat: record?.coordinate?.lat,
              lng: record?.coordinate?.lng,
            }}
          />
        ),
      },
      {
        title: 'Phone Number',
        key: 'phone',
        width: 160,
        render: (text, record) => <Ellipsis tooltip>{record.phone}</Ellipsis>,
      },
      {
        title: 'Member Since',
        key: 'phone',
        width: 180,
        render: (text, record) => <span>{formatDate(record.created_at)}</span>,
      },
      {
        title: 'Laundry Manager Name',
        dataIndex: 'manager_name',
        key: 'manager_name',
        width: 220,
        render: (text, record) => (
          <Ellipsis tooltip>
            <Link to={`/users/${record.manager?.id}`}>{`${record.manager?.name}`}</Link>
          </Ellipsis>
        ),
      },
      {
        title: 'Laundry Manager Phone',
        dataIndex: 'manager_phone',
        key: 'manager_phone',
        width: 220,
        render: (text, record) => <Ellipsis tooltip>{record.manager?.phone}</Ellipsis>,
      },
      {
        title: 'Relationship Manager Name',
        dataIndex: 'relationship_manager_id',
        key: 'relationship_manager_id',
        width: 220,
        render: (text, record) => (
          <Ellipsis tooltip>
            <Link
              to={`/users/${record.relationship_manager?.id}`}
            >{`${record.relationship_manager?.name}`}</Link>
          </Ellipsis>
        ),
      },
      {
        title: 'Relationship Manager Phone',
        dataIndex: 'relationship_manager_phone',
        key: 'relationship_manager_phone',
        width: 220,
        render: (text, record) => <Ellipsis tooltip>{record.relationship_manager?.phone}</Ellipsis>,
      },

      {
        title: 'Laundry Status',
        key: 'laundry_status',
        width: 150,
        render: (text, record) => (
          <Tag color={getLaundryStatusColor(!record?.is_laundry_stop_ordering)}>
            {getLaundryStatusDisplay(!record?.is_laundry_stop_ordering)}
          </Tag>
        ),
      },
      {
        title: 'Admin Status',
        key: 'admin_status',
        width: 150,
        render: (text, record) => (
          <Tag
            color={getAdminLaundryStatusColor(record.deleted_at, !record?.is_laundry_stop_ordering)}
          >
            {getAdminLaundryStatusDisplay(record.deleted_at, !record?.is_laundry_stop_ordering)}
          </Tag>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: 'Update' },
                // { key: '2', name: record.deleted_at ? 'Re-activate' : 'Delete' },
              ]}
            />
          );
        },
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
        scroll={{ x: 2200 }}
        columns={columns}
        rowKey={(record) => `${record?.id}`}
      />
    );
  }
}

export default List;
