import React from 'react';
import { Table, Card, Button, Modal, Tag } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IConstants, IUser } from 'types';
import styles from './List.less';
import { DropOption } from 'components';
import { formatDate } from 'utils/date';
import { getPermissionColor } from 'utils/theme';
import { Ellipsis } from 'ant-design-pro';

const { confirm } = Modal;

interface IListProps extends TableProps<IUser> {
  constant: IConstants;
  onDelete: (record: IUser) => void;
  onUpdate: (record: IUser) => void;
  onAdd: () => void;
}

class ListShipper extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IUser, e: any) => {
    const { onUpdate, onDelete } = this.props;
    if (e.key === '1') {
      onUpdate(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this shipper.',
        onOk() {
          onDelete(record);
        },
      });
    }
  };

  render() {
    const { constant, onAdd, onDelete, ...tableProps } = this.props;
    const columns: Array<ColumnProps<IUser>> = [
      {
        title: 'Name',
        key: 'name',
        width: 200,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.name}
          </Ellipsis>
        ),
      },
      {
        title: 'Email',
        key: 'email',
        width: 220,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.email}
          </Ellipsis>
        ),
      },
      {
        title: 'Phone',
        key: 'phone',
        width: 200,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {record.phone}
          </Ellipsis>
        ),
      },
      {
        title: 'Member Since',
        key: 'created_at',
        width: 240,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            {formatDate(record.created_at)}
          </Ellipsis>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          let menuOptions = [
            // { key: '1', name: 'Update' },
            { key: '2', name: 'Delete' },
          ];

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
      <Card title="Shippers" extra={<Button onClick={onAdd}>Add Shipper</Button>}>
        <Table
          {...tableProps}
          className={styles.table}
          bordered={true}
          columns={columns}
          rowKey={(record) => `${record?.id}`}
        />
      </Card>
    );
  }
}

export default ListShipper;
