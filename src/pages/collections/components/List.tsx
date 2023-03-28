import React from 'react';
import Link from 'umi/link';
import { Modal, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { ICollection, IConstants } from 'types';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';

const { confirm } = Modal;
interface IListProps extends TableProps<ICollection> {
  onRemoveItem: (recordID: string) => void;
  onEditItem: (record: ICollection) => void;
  onAddLook: (record: ICollection) => void;
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ICollection, e: any) => {
    const { onRemoveItem, onEditItem, onAddLook } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      onAddLook(record);
    } else if (e.key === '3') {
      confirm({
        title: (
          <div>
            <span>
              if you delete this collection, all looks of this collection will be removed.{' '}
            </span>
            <span>
              Are you sure <strong>delete</strong> this record?
            </span>
          </div>
        ),
        onOk() {
          onRemoveItem(record.id);
        },
      });
    }
  };

  render() {
    const { constants, onEditItem, ...tableProps } = this.props;
    const columns: Array<ColumnProps<ICollection>> = [
      {
        title: 'Photo',
        key: 'photo',
        fixed: 'left',
        width: 160,
        render: (text, record) => (
          <img
            style={{ backgroundImage: 'linear-gradient(#fdfdfd, #f2f2f2)' }}
            width={120}
            src={record.photo}
          />
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Link to={`/collections/${record.id}`}>
            <Ellipsis tooltip lines={1}>
              {record?.name}
            </Ellipsis>
          </Link>
        ),
      },
      {
        title: 'Total Looks',
        dataIndex: 'total_looks',
        key: 'total_looks',
        // width: 180,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record?.total_looks}
          </Ellipsis>
        ),
      },

      {
        title: 'Listed / Last Modified',
        key: 'status',
        dataIndex: 'status',
        // width: 200,
        render: (text, record) => <span>{formatDate(record.updated_at)}</span>,
      },

      {
        title: 'Instagram',
        dataIndex: 'instagram_url',
        key: 'instagram_url',
        // width: 320,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            <Link to={record?.instagram_url}>{record?.instagram_url}</Link>
          </Ellipsis>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        width: 120,
        fixed: 'right',
        render: (text, record) => {
          const menuOptions = [
            { key: '1', name: 'Update' },
            { key: '2', name: 'Add Look' },
            { key: '3', name: 'Delete' },
          ];
          return (
            <DropOption
              style={{ height: (120 * 16) / 9 }}
              buttonStyle={{ height: (120 * 16) / 9 }}
              disabled={menuOptions?.length === 0}
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
        scroll={{ x: 1300 }}
        columns={columns}
        rowKey={(record) => `${record?.id}`}
      />
    );
  }
}

export default List;
