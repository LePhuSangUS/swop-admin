import React from 'react';
import Link from 'umi/link';
import { Table, Tooltip, Tag, Checkbox, Row, Card } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { IConstants, IDress } from 'types';
import { formatDate } from 'utils/date';
import theme, { getAccountStatusColor, getUserDressStatusColor } from 'utils/theme';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';
import { getUserDressStatusDisplay } from 'utils/mapping';
import { DropOption } from 'components';

interface IListProps extends TableProps<IDress> {
  constants: IConstants;
  onEdit: (dress: IDress) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IDress, e: any) => {
    const { onEdit } = this.props;

    if (e.key === '1') {
      onEdit(record);
    }
  };

  render() {
    const { constants, ...tableProps } = this.props;
    const columns: Array<ColumnProps<IDress>> = [
      {
        title: 'Photo',
        key: 'photo',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
          <Link to={`/dresses/${record.id}`}>
            <img height={120} src={record.photos?.[0]} />
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
            (item) => item?.alias === record.category,
          );
          return <Tooltip title={value?.alias}>{value?.title}</Tooltip>;
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 180,
        render: (text, record) => {
          const value = constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.types?.find((item) => item?.alias === record.type);
          return <Tooltip title={value?.alias}>{value?.title}</Tooltip>;
        },
      },
      {
        title: 'Listed / Last Modified',
        key: 'status',
        dataIndex: 'status',
        width: 200,
        render: (text, record) => <span>{formatDate(record.updated_at)}</span>,
      },
      {
        title: 'Swipes Received',
        key: 'total_swipes',
        dataIndex: 'total_swipes',
        width: 150,
        render: (text, record) => <span>{record.total_swipes}</span>,
      },
      {
        title: 'Like % Swipes',
        key: 'total_likes',
        dataIndex: 'total_likes',
        width: 150,
        render: (text, record) => (
          <span>
            {record.total_swipes ? Math.round(record.total_likes / record.total_swipes) * 100 : 0}%
          </span>
        ),
      },
      {
        title: 'Reports Received',
        key: 'report_received',
        dataIndex: 'report_received',
        width: 150,
        render: (text, record) => <span>{record.report_count}</span>,
      },
      {
        title: 'Available Swops',
        key: 'total_available_swop',
        dataIndex: 'total_available_swop',
        width: 150,
        render: (text, record) => <span>{record.total_available_swop || 0}</span>,
      },
      {
        title: 'Active Swops',
        key: 'total_active_swop',
        dataIndex: 'total_active_swop',
        width: 150,
        render: (text, record) => <span>{record.total_active_swop || 0}</span>,
      },

      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: (text, record) => <Ellipsis tooltip>{record.title}</Ellipsis>,
      },
      {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        width: 100,
        render: (text, record) => <Ellipsis tooltip>{record.size}</Ellipsis>,
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        width: 180,
        render: (text, record) => <Ellipsis tooltip>{record.note}</Ellipsis>,
      },
      {
        title: 'Is Delist',
        dataIndex: 'is_delist',
        key: 'is_delist',
        width: 180,
        render: (text, record) => <Checkbox disabled checked={record.is_delist} />,
      },

      {
        title: 'Necklines',
        dataIndex: 'necklines',
        key: 'necklines',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.necklines?.filter((item) => record.necklines?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Sleeves',
        dataIndex: 'sleeves',
        key: 'sleeves',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.sleeves?.filter((item) => record.sleeves?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Fits',
        dataIndex: 'fits',
        key: 'fits',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.fits?.filter((item) => record.fits?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Fabrics',
        dataIndex: 'fabrics',
        key: 'fabrics',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.fabrics?.filter((item) => record.fabrics?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Patterns',
        dataIndex: 'patterns',
        key: 'patterns',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.patterns?.filter((item) => record.patterns?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Styles',
        dataIndex: 'styles',
        key: 'styles',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.styles?.filter((item) => record.styles?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Colors',
        dataIndex: 'colors',
        key: 'colors',
        width: 180,
        render: (text, record) =>
          constants?.dress_categories
            ?.find((item) => item?.alias === record.category)
            ?.necklines?.filter((item) => record.necklines?.includes(item?.alias))
            .map((item) => (
              <Row>
                <Tooltip title={item?.alias}>
                  <Tag color={theme.colors.pink} key={`${item?.alias}`}>
                    {item.title}
                  </Tag>
                </Tooltip>
              </Row>
            )),
      },
      {
        title: 'Swop Status',
        key: 'swop_status',
        width: 200,
        render: (text, record) => {
          let status = getUserDressStatusDisplay(record.is_delist, record.is_publish);
          if (record.has_active_swop) {
            status = 'In a swop';
          } else if (record.is_delist || record?.user?.is_delist_dresses) {
            status = 'Delisted';
          } else if (record.is_inactive) {
            status = 'Deactivated';
          } else if (!record.is_publish) {
            status = 'Save Draft';
          }
          return (
            <Tag color={getUserDressStatusColor(record.is_delist, record.is_publish)}>{status}</Tag>
          );
        },
      },
      {
        title: 'Admin Set Status',
        key: 'admin_status',
        width: 180,
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
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={[{ key: '1', name: 'Update' }]}
            />
          );
        },
      },
    ];

    return (
      <Card title="Wardrobe">
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `Total ${total} Items`,
          }}
          className={styles.table}
          bordered={true}
          scroll={{ x: 3800, y: 480 }}
          columns={columns}
          rowKey={(record) => `${record?.id}`}
        />
      </Card>
    );
  }
}

export default List;
