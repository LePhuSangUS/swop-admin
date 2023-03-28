import React from 'react';
import { Table, Card, Modal, Tag, Tooltip, Button } from 'antd';
import { IColumnProps, ITableProps } from 'types';
import { IUserCredit } from 'types';
import { getCreditSourceColor, getCreditStatusColor } from 'utils/theme';
import { formatDate } from 'utils/date';
import { getUserCreditSourceDisplay, getUserCreditStatusDisplay } from 'utils/mapping';
import { DropOption } from 'components';
import styles from './List.less';
import { Link } from 'umi';

const { confirm } = Modal;

interface IListCreditProps extends ITableProps<IUserCredit> {
  onDeleteItem?: (recordId: string | number) => void;
  onEditItem?: (record: IUserCredit) => void;
  onAdd?: () => void;
}

class ListCredit extends React.PureComponent<IListCreditProps> {
  handleMenuClick = (record: IUserCredit, e: any) => {
    const { onDeleteItem, onEditItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure archive this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  render() {
    const { onDeleteItem, onAdd, onEditItem, ...tableProps } = this.props;

    const columns: Array<IColumnProps<IUserCredit>> = [
      {
        title: 'ID',
        key: 'id',
        width: 200,
        render: (text, record) => <span>{record.id}</span>,
      },
      {
        title: 'Status',
        key: 'status',
        width: 100,
        render: (text, record) => (
          <Tag color={getCreditStatusColor(record.deleted_at, record.status)}>
            {getUserCreditStatusDisplay(record.deleted_at, record.status)}
          </Tag>
        ),
      },
      {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
        width: 200,
        render: (text, record) => (
          <Tag color={getCreditSourceColor(record.source)}>
            {getUserCreditSourceDisplay(record.source)}
          </Tag>
        ),
      },
      {
        title: 'Swop Code',
        dataIndex: 'swop_code',
        key: 'swop_code',
        width: 160,
        render: (text, record) => (
          <>
            {typeof record.swop_code === 'string' && record.swop_code !== '' ? (
              <Link to={`/swops/${record.swop_id}`}>{record.swop_code}</Link>
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Expired At',
        dataIndex: 'expired_at',
        key: 'expired_at',
        width: 200,
        render: (_, record) => (
          <Tooltip title={record.expired_at}>
            <span>{formatDate(record.expired_at)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        render: (_, record) => (
          <Tooltip title={record.created_at}>
            <span>{formatDate(record.created_at)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text: string, record: any) => {
          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: 'Update' },
                { key: '2', name: 'Delete' },
              ]}
            />
          );
        },
      },
    ];

    return (
      <Card title="Swop Tokens" extra={<Button onClick={onAdd}>Add Swop Token</Button>}>
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `Total ${total} Items`,
          }}
          className={styles.table}
          bordered={true}
          scroll={{ x: 1200, y: 240 }}
          columns={columns}
          rowKey={(record) => `${record.id}`}
        />
      </Card>
    );
  }
}

export default ListCredit;
