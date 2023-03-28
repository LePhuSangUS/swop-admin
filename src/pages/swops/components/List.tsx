import React from 'react';
import { Table, Tooltip, Modal, Tag, Carousel } from 'antd';
import { IConstants, ISwop } from 'types';
import { DropOption } from 'components';
import { getSwopStatusDisplay } from 'utils/mapping';
import theme, { getAccountStatusColor, getSwopStatusColor } from 'utils/theme';
import { IColumnProps, ITableProps } from 'types';
import { Link } from 'umi';
import styles from './List.less';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';

const { confirm } = Modal;

interface IListProps extends ITableProps<ISwop> {
  constants: IConstants;
  onDeleteItem: (recordId: string) => void;
  onEditItem: (record: ISwop) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ISwop, e: any) => {
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
    const { constants, onDeleteItem, onEditItem, ...tableProps } = this.props;

    const columns: Array<IColumnProps<ISwop>> = [
      {
        title: 'Photo',
        key: 'photo',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
          <Link to={`/swops/${record?.id}`}>
            <Carousel
              style={{ backgroundColor: theme.colors.background, height: 120, width: 140 }}
              autoplay
            >
              {record?.dress?.photos?.map((item) => (
                <div key={item} className={styles.imgWrap}>
                  <a target="__blank" href={item}>
                    <img className={styles.img} src={item} />
                  </a>
                </div>
              ))}
            </Carousel>
          </Link>
        ),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 180,
        render: (text, record) => {
          const value = constants?.dress_categories?.find(
            (item) => item?.alias === record?.dress?.category,
          );
          return <Tooltip title={value?.alias}>{value?.title}</Tooltip>;
        },
      },
      {
        title: 'Owner Name',
        dataIndex: 'owner_id',
        key: 'owner_id',
        width: 200,
        render: (text, record) => (
          <Link to={`/users/${record.user_id}`}>
            <Ellipsis tooltip>{record.user?.name}</Ellipsis>
          </Link>
        ),
      },
      {
        title: 'Owner Location City',
        dataIndex: 'owner_location_city',
        key: 'owner_location_city',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record?.user?.coordinate?.city}</Ellipsis>,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record.user?.phone}</Ellipsis>,
      },
      {
        title: 'Swop Location City',
        dataIndex: 'location_city',
        key: 'location_city',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record.coordinate?.city}</Ellipsis>,
      },
      {
        title: 'Swop Code',
        dataIndex: 'reference_code',
        key: 'reference_code',
        width: 200,
        render: (text, record) => (
          <Link to={`/matchings/${record.matching_id}`}>{record.reference_code}</Link>
        ),
      },
      {
        title: 'Swop Since',
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
        title: 'Swop Status',
        key: 'swop_status',
        width: 190,
        render: (text, record) => (
          <Tag color={getSwopStatusColor(record.status)}>{getSwopStatusDisplay(record.status)}</Tag>
        ),
      },
      {
        title: 'Admin Status',
        key: 'admin_status',
        width: 120,
        render: (text, record) => (
          <Tag color={getAccountStatusColor(record?.deleted_at)}>
            {record.deleted_at ? 'Banned' : 'Permitted'}
          </Tag>
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
              { key: '1', name: 'Update' },
              { key: '2', name: record.deleted_at ? 'Un-Archive' : 'Archive' },
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
        scroll={{ x: 1900 }}
        columns={columns}
        rowKey={(record) => `${record.id}`}
      />
    );
  }
}

export default List;
