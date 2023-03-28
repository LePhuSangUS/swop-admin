import React from 'react';
import Link from 'umi/link';
import { Modal, Table, Checkbox, Tag } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IReportDressCount } from 'types';
import { getStatusColor } from 'utils/theme';
import styles from './List.less';

const { confirm } = Modal;
interface IListProps extends TableProps<IReportDressCount> {
  onDeactivateDress: (dressID: string) => void;
  onActivateDress: (dressID: string) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IReportDressCount, e: any) => {
    const { onDeactivateDress, onActivateDress } = this.props;

    if (e.key === '2') {
      if (record.has_available_swop) {
        confirm({
          title:
            'Are you sure deactivate this record?\nIf you deactivate this dress, It will lose all the Likes (and well, also Dislike) it has received so far.',
          onOk() {
            onDeactivateDress(record.dress_id);
          },
        });
      } else {
        confirm({
          title: 'Are you sure deactivate  this record?',
          onOk() {
            onDeactivateDress(record.dress_id);
          },
        });
      }
    } else if (e.key === '3') {
      onActivateDress(record.dress_id);
    }
  };

  render() {
    const { ...tableProps } = this.props;
    const columns: Array<ColumnProps<IReportDressCount>> = [
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        width: 120,
        render: (text, record) => (
          <Tag color={getStatusColor(record?.is_inactive)}>
            {record.is_inactive ? 'Inactive' : 'Active'}
          </Tag>
        ),
      },
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 120,
        render: (text, record, index) => (
          <Link to={`/reports/${record.dress_id}`}>{index + 1}</Link>
        ),
      },
      {
        title: 'Dress ID',
        key: 'dress_id',
        dataIndex: 'dress_id',
        width: 200,
        render: (text, record) => <Link to={`/dresses/${record.dress_id}`}>{record.dress_id}</Link>,
      },
      {
        title: 'Dress Owner ID',
        key: 'dress_owner_id',
        dataIndex: 'dress_owner_id',
        width: 200,
        render: (text, record) => (
          <Link to={`/users/${record.dress_owner_id}`}>{record.dress_owner_id}</Link>
        ),
      },
      {
        title: 'Text Offensive',
        key: 'report_text_count',
        dataIndex: 'report_text_count',
        width: 140,
        render: (text, record) => <span>{record.report_text_count}</span>,
      },
      {
        title: 'Photo Offensive',
        key: 'report_photo_count',
        dataIndex: 'report_photo_count',
        width: 140,
        render: (text, record) => <span>{record.report_photo_count}</span>,
      },
      {
        title: 'Has Active Swop',
        key: 'has_active_swop',
        dataIndex: 'has_active_swop',
        width: 160,
        render: (text, record) => <Checkbox disabled checked={record.has_active_swop} />,
      },
      {
        title: 'Has Available Swop',
        key: 'has_available_swop',
        dataIndex: 'has_available_swop',
        width: 160,
        render: (text, record) => <Checkbox disabled checked={record.has_available_swop} />,
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          let menuOptions = [
            // { key: '2', name: record.deleted_at ? 'Re-activate' : 'Delete' },
          ];
          if (record.has_active_swop === false) {
            if (record.is_inactive) {
              menuOptions.push({ key: '3', name: 'Activate' });
            } else {
              menuOptions.push({ key: '2', name: 'Deactivate' });
            }
          }

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
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `Total ${total} Items`,
        }}
        className={styles.table}
        bordered={true}
        scroll={{ x: 1350 }}
        columns={columns}
        rowKey={(record) => `${record?.dress_id}`}
      />
    );
  }
}

export default List;
