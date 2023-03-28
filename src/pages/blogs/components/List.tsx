import React from 'react';
import Link from 'umi/link';
import { Modal, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IBlog, IConstants } from 'types';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';
import { htmlToString } from 'utils/parsing';

interface IListProps extends TableProps<IBlog> {
  constants: IConstants;
  onPublish: (id: string) => void;
  onDraft: (id: string) => void;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: IBlog, e: any) => {
    const { onPublish, onDraft } = this.props;

    if (e.key === '1') {
      onPublish(record?.id);
    } else if (e.key === '2') {
      onDraft(record?.id);
    }
  };

  render() {
    const { constants, ...tableProps } = this.props;
    const columns: Array<ColumnProps<IBlog>> = [
      {
        title: 'ID',
        key: 'id',
        fixed: 'left',
        width: 160,
        render: (text, record) => (
          <Link to={`/blogs/${record.id}`}>
            <Ellipsis tooltip lines={1}>
              {record?.id}
            </Ellipsis>
          </Link>
        ),
      },
      {
        title: 'Cover Photo',
        dataIndex: 'cover_photo_url',
        key: 'cover_photo_url',
        render: (text, record) => (
          <img height={96} style={{ aspectRatio: '9/16' }} src={record.cover_photo_url} />
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <Link to={`/blogs/${record.id}`}>
            <Ellipsis tooltip lines={1}>
              {htmlToString(record?.title)?.blocks?.[0].text}
            </Ellipsis>
          </Link>
        ),
      },
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        render: (text, record) => (
          <Link to={`/blogs/${record.id}`}>
            <Ellipsis tooltip lines={1}>
              {htmlToString(record?.content)?.blocks?.[0].text} ...
            </Ellipsis>
          </Link>
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
        title: 'Operation',
        key: 'operation',
        width: 120,
        fixed: 'right',
        render: (text, record) => {
          const menuOptions = [];
          if (record.status === 'draft') {
            menuOptions.push({ key: '1', name: 'Publish' });
          } else if (record.status === 'published') {
            menuOptions.push({ key: '2', name: 'Draft' });
          }
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
        scroll={{ x: 1300 }}
        columns={columns}
        rowKey={(record) => `${record?.id}`}
      />
    );
  }
}

export default List;
