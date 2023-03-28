import React from 'react';
import Link from 'umi/link';
import { Modal, Table, Tooltip, Tag, Col, Row, Divider } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { ILook, IConstants } from 'types';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import styles from './List.less';
import { Color, getDressInfo } from 'utils';

const { confirm } = Modal;
interface IListProps extends TableProps<ILook> {
  onRemoveItem: (recordID: string) => void;
  onEditItem: (record: ILook) => void;
  onAddLookDress: (record: ILook) => void;
  constants: IConstants;
}

class List extends React.PureComponent<IListProps> {
  handleMenuClick = (record: ILook, e: any) => {
    const { onRemoveItem, onEditItem, onAddLookDress } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      onAddLookDress(record);
    } else if (e.key === '3') {
      confirm({
        title: (
          <div>
            <span>if you delete this look, all dresses of this look will be removed. </span>
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
    const columns: Array<ColumnProps<ILook>> = [
      {
        title: 'Photo',
        key: 'photo',
        width: 200,
        render: (text, record) => (
          <Link to={`looks/${record.id}`}>
            <img
              style={{ backgroundImage: 'linear-gradient(#fdfdfd, #f2f2f2)' }}
              width={120}
              src={record.photo}
            />
          </Link>
        ),
      },
      {
        title: 'Listed / Last Modified',
        key: 'status',
        dataIndex: 'status',
        width: 200,
        render: (text, record) => <span>{formatDate(record.updated_at)}</span>,
      },
      {
        title: 'Instagram',
        dataIndex: 'instagram_url',
        key: 'instagram_url',
        width: 260,
        render: (text, record) => (
          <Ellipsis tooltip lines={1}>
            <Link to={record?.instagram_url}>{record?.instagram_url}</Link>
          </Ellipsis>
        ),
      },
      {
        title: 'Dresses',
        dataIndex: 'dresses',
        key: 'dresses',
        width: 400,
        render: (text, record) => (
          <Col>
            {record?.dresses?.map((item, index) => {
              const dressInfo = getDressInfo(constants, item);
              return (
                <>
                  <Row type="flex">
                    <Tooltip title={dressInfo?.category?.alias}>
                      <Tag className={styles.marginBottom} color={Color.colors.pink}>
                        {dressInfo?.category?.title}
                      </Tag>
                    </Tooltip>
                    <Tooltip title={dressInfo?.type?.alias}>
                      <Tag className={styles.marginBottom} color={Color.colors.pink}>
                        {dressInfo?.type?.title}
                      </Tag>
                    </Tooltip>

                    {dressInfo?.colors?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.styles?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.legs?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.lengths?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.fabrics?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.fits?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.necklines?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                  </Row>
                  {index !== record?.dresses?.length - 1 && <Divider className={styles.divider} />}
                </>
              );
            })}
          </Col>
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
            { key: '2', name: 'Add Dress' },
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
