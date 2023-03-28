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
  onUpdate: (record: IUser) => void;
  onDelete: (record: IUser) => void;
  onAdd: () => void;
}

class ListAdmin extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IUser, e: any) => {
    const { onUpdate, onDelete } = this.props;
    if (e.key === '1') {
      onUpdate(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this admin.',
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
          <Ellipsis lines={1} tooltip>
            {record.name}
          </Ellipsis>
        ),
      },
      {
        title: 'Email',
        key: 'email',
        width: 220,
        render: (text, record) => (
          <Ellipsis lines={1} tooltip>
            {record.email}
          </Ellipsis>
        ),
      },
      {
        title: 'Phone',
        key: 'phone',
        width: 200,
        render: (text, record) => (
          <Ellipsis lines={1} tooltip>
            {record.phone}
          </Ellipsis>
        ),
      },
      {
        title: 'Member Since',
        key: 'created_at',
        width: 240,
        render: (text, record) => (
          <Ellipsis lines={1} tooltip>
            {formatDate(record.created_at)}
          </Ellipsis>
        ),
      },
      {
        title: 'Permissions',
        key: 'permissions',
        width: 240,
        render: (text, record) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {record?.permissions?.map((item, index) => (
              <Tag
                style={{ marginBottom: index === record?.permissions?.length - 1 ? 0 : 10 }}
                color={getPermissionColor(item)}
              >
                {constant?.admin_member_permissions?.find((it) => it.alias === item)?.title}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          let menuOptions = [
            { key: '1', name: 'Update' },
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
      <Card title="Admins" extra={<Button onClick={onAdd}>Add Admin</Button>}>
        <Table
          {...tableProps}
          className={styles.table}
          bordered={true}
          columns={columns}
          scroll={{ x: 1200 }}
          rowKey={(record) => `${record?.id}`}
        />
      </Card>
    );
  }
}

export default ListAdmin;
