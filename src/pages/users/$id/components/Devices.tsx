import React from 'react';
import { Card, Icon, Table, Modal } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IUserDevice } from 'types';
import { Ellipsis } from 'ant-design-pro';
import styles from './Devices.less';
import { SelectOption, DropOption } from 'components';
import { formatDate } from 'utils/date';

const { confirm } = Modal;
interface IProps extends TableProps<IUserDevice> {
  onSendAllNotification: () => void;
  onAddDevice: () => void;
  onDeleteAllDevice: () => void;

  onSendNotification: (device: IUserDevice) => void;
  onDeleteDevice: (device: IUserDevice) => void;
}

class Devices extends React.PureComponent<IProps> {
  handleClick = (event: any) => {
    const key = event.key;
    const { onSendAllNotification, onAddDevice, onDeleteAllDevice } = this.props;
    if (key === '1') {
      onAddDevice();
    } else if (key === '2') {
      confirm({
        title: 'This action will send push notification to all device of this user. Are you sure ?',
        onOk() {
          onSendAllNotification();
        },
      });
    } else if (key === '3') {
      confirm({
        title: 'Are you sure you want to delete all device?',
        onOk() {
          onDeleteAllDevice();
        },
      });
    }
  };

  handleRowClick = (key: string, record: any) => {
    const { onSendNotification, onDeleteDevice } = this.props;
    if (key === '1') {
      onSendNotification(record);
    } else if (key === '2') {
      confirm({
        title: 'Are you sure you want to delete this device?',
        onOk() {
          onDeleteDevice(record);
        },
      });
    }
  };
  renderOptions = () => {
    const { dataSource } = this.props;

    const menuOptions = [{ key: '1', name: 'Add Device' }];
    if (dataSource?.length > 0) {
      menuOptions.push(
        ...[
          { key: '2', name: 'Send Notification' },
          { key: '3', name: 'Remove All Device' },
        ],
      );
    }
    return (
      <SelectOption onMenuClick={this.handleClick} menuOptions={menuOptions}>
        Options
      </SelectOption>
    );
  };
  render() {
    const { onSendNotification, ...tableProps } = this.props;

    const columns: Array<ColumnProps<IUserDevice>> = [
      {
        title: 'Platform',
        key: 'platform',
        width: 100,
        render: (_, record) => (
          <Icon
            className={styles.icon}
            type={record.platform === 'ios' ? 'apple' : 'android'}
            theme="filled"
          />
        ),
      },
      {
        title: 'Token',
        key: 'token',
        width: 400,
        render: (_, record) => (
          <Ellipsis className={styles.token} tooltip={true} lines={1}>
            {record.token}
          </Ellipsis>
        ),
      },
      {
        title: 'Last Used',
        key: 'last_used',
        width: 200,
        render: (_, record) => <span>{formatDate(record.last_used)}</span>,
      },
      {
        title: 'Options',
        fixed: 'right',
        render: (_, record) => (
          <DropOption
            onMenuClick={(key) => this.handleRowClick(key.key, record)}
            menuOptions={[
              { key: '1', name: 'Send Notification' },
              { key: '2', name: 'Delete' },
            ]}
          >
            Options
          </DropOption>
        ),
      },
    ];

    return (
      <Card title="Devices" extra={this.renderOptions()}>
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `Total ${total} Items`,
          }}
          className={styles.table}
          bordered={true}
          columns={columns}
          rowKey={(record) => `${record.token}`}
          scroll={{ x: 850, y: 480 }}
        />
      </Card>
    );
  }
}
export default Devices;
