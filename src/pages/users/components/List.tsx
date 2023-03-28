import React from 'react';
import Link from 'umi/link';
import { Avatar, Modal, Table, Tag, Tooltip } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IUser } from 'types';
import { formatDate } from 'utils/date';
import { getUserStatusColor, getAdminStatusColor, getAccountRoleColor } from 'utils/theme';
import { Ellipsis } from 'ant-design-pro';
import { getAccountRoleDisplay, getAdminStatusDisplay, getUserStatusDisplay } from 'utils/mapping';
import { formatMoneyCurrency } from 'utils/money';
import styles from './List.less';

const { confirm } = Modal;
interface IListProps extends TableProps<IUser> {
  onDeleteItem: (recordID: string) => void;
  onDeactivateItem: (recordID: string) => void;
  onPermit: (record: IUser) => void;
  onActivate: (recordID: string) => void;
  onEditItem: (record: IUser) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IUser, e: any) => {
    const { onDeleteItem, onEditItem, onPermit, onActivate, onDeactivateItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      if (record.deleted_at) {
        onPermit(record);
      } else {
        confirm({
          title: 'Are you sure ban this user?',
          onOk() {
            onDeleteItem(record.id);
          },
        });
      }
    } else if (e.key === '3') {
      // if (record.is_inactive) {
      //   onActivate(record.id);
      // } else {
      //   confirm({
      //     title: 'Are you sure deactivate this user?',
      //     onOk() {
      //       onDeactivateItem(record.id);
      //     },
      //   });
      // }
    }
  };

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props;
    const columns: Array<ColumnProps<IUser>> = [
      {
        title: 'Avatar',
        key: 'avatar',
        dataIndex: 'avatar',
        width: 80,
        fixed: 'left',
        render: (text) => <Avatar src={text} />,
      },
      {
        title: 'App Version',
        key: 'name',
        width: 120,
        render: (text, record) => (
          <Tooltip title={record?.expo_version}>{record?.app_version}</Tooltip>
        ),
      },
      // {
      //   title: 'Name',
      //   key: 'name',
      //   width: 200,
      //   render: (text, record) => (
      //     <Ellipsis tooltip>
      //       <Link to={`users/${record.id}`}>
      //         {record.name && record.name !== '' ? record.name : 'Empty'}
      //       </Link>
      //     </Ellipsis>
      //   ),
      // },
      {
        title: 'Location City',
        key: 'location',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record?.coordinate?.city}</Ellipsis>,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
        key: 'phone',
        width: 180,
        render: (text, record) => (
          <Link to={`users/${record.id}`}>
            {typeof record.phone === 'string' && record.phone !== '' ? (
              <Ellipsis tooltip>{record.phone}</Ellipsis>
            ) : (
              'N/A'
            )}
          </Link>
        ),
      },
      {
        title: 'Member Since',
        key: 'created_at',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{formatDate(record.created_at)}</Ellipsis>,
      },
      {
        title: 'Dress Pages',
        key: 'total_dresses',
        width: 150,
        render: (text, record) => <span>{record.total_dresses || 0}</span>,
      },
      {
        title: 'Swipes Given',
        key: 'total_swipes',
        width: 150,
        render: (text, record) => <span>{record.total_swipes || 0}</span>,
      },
      {
        title: 'Like % Swipes',
        key: 'total_likes',
        width: 150,
        render: (text, record) => (
          <span>
            {record.total_swipes ? Math.round(record.total_likes / record.total_swipes) * 100 : 0}%
          </span>
        ),
      },
      {
        title: 'Active Swops',
        key: 'total_active_swops',
        width: 150,
        render: (text, record) => <span>{record.total_active_swops || 0}</span>,
      },
      {
        title: 'Swop Balances',
        key: 'swop_balances',
        width: 160,
        render: (text, record) => (
          <Ellipsis tooltip>{record?.credits?.total - record?.credits?.used || 0}</Ellipsis>
        ),
      },
      {
        title: 'Overdue Balance',
        key: 'overdue_balance',
        width: 160,
        render: (text, record) => (
          <Ellipsis tooltip>
            {formatMoneyCurrency(record?.overdue_balance, record?.currency)}
          </Ellipsis>
        ),
      },
      {
        title: 'Role',
        key: 'role',
        width: 100,
        render: (text, record) => (
          <Tag color={getAccountRoleColor(record.role)}>{getAccountRoleDisplay(record.role)}</Tag>
        ),
      },
      {
        title: 'User Status',
        key: 'user_status',
        width: 150,
        render: (text, record) => (
          <Tag color={getUserStatusColor(record.is_defaulting, !record.is_delist_dresses)}>
            {getUserStatusDisplay(record.is_defaulting, !record.is_delist_dresses)}
          </Tag>
        ),
      },
      {
        title: 'Admin Status',
        key: 'admin_status',
        width: 140,
        render: (text, record) => (
          <Tag color={getAdminStatusColor(record?.deleted_at, !record.is_inactive)}>
            {getAdminStatusDisplay(record?.deleted_at, !record.is_inactive)}
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
                // { key: '2', name: record.deleted_at ? 'Permit' : 'Ban' },
                // { key: '3', name: record.is_inactive ? 'Activate' : 'Deactivate' },
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
