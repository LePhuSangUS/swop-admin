import React from 'react';
import { Modal, Table, Tooltip, Tag, Carousel, Row } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IConstants, ILookDress } from 'types';
import theme from 'utils/theme';
import { Ellipsis } from 'ant-design-pro';
import styles from './ListLookDress.less';

const { confirm } = Modal;

interface IListProps extends TableProps<ILookDress> {
  onRemoveItem: (recordID: string) => void;
  onEditItem: (record: ILookDress) => void;
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ILookDress, e: any) => {
    const { onRemoveItem, onEditItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: (
          <span>
            Are you sure <strong>delete</strong> this record?
          </span>
        ),
        onOk() {
          onRemoveItem(record.id);
        },
      });
    }
  };

  render() {
    const { constants, onEditItem, ...tableProps } = this.props;
    const columns: Array<ColumnProps<ILookDress>> = [
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
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        width: 100,
        render: (text, record) => <Ellipsis tooltip>{record.size}</Ellipsis>,
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
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          const menuOptions = [
            { key: '1', name: 'Update' },
            { key: '2', name: 'Delete' },
          ];
          return (
            <DropOption
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
        scroll={{ x: 2000 }}
        columns={columns}
        rowKey={(record) => `${record?.id}`}
      />
    );
  }
}

export default List;
