import React from 'react';
import Link from 'umi/link';
import { Divider, Card, Table, Modal, Row, Col, Popconfirm, Button, Tooltip, Tag } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { DropOption } from 'components';
import { IConstants, ILook, ILookDress } from 'types';
import { formatDate } from 'utils/date';
import { Ellipsis } from 'ant-design-pro';
import { Color, getDressInfo } from 'utils';
import ImageTag from 'components/ImageTag';
import styles from './ListLook.less';

const { confirm } = Modal;

interface IProps extends TableProps<ILook> {
  constants: IConstants;
  onRemoveLook: (id: string) => void;
  onEditLook: (record: ILook) => void;
  onAddDress: (record: ILook) => void;
  onRemoveLookDress: (look_id: string, id: string) => void;
  onUpdateLookDress: (look: ILook, lookDress: ILookDress) => void;
}
class ListLook extends React.Component<IProps> {
  handleMenuClick = (record: ILook, e: any) => {
    const { onRemoveLook, onEditLook, onAddDress } = this.props;

    if (e.key === '1') {
      onEditLook(record);
    } else if (e.key === '2') {
      onAddDress(record);
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
          onRemoveLook(record.id);
        },
      });
    }
  };

  removeLookDress = (look_id: string, id: string) => {
    const { onRemoveLookDress } = this.props;
    onRemoveLookDress(look_id, id);
  };

  updateLookDress = (look: ILook, lookDress: ILookDress) => {
    const { onUpdateLookDress } = this.props;
    onUpdateLookDress(look, lookDress);
  };
  render() {
    const { constants, ...tableProps } = this.props;
    const columns: Array<ColumnProps<ILook>> = [
      {
        title: 'Photo',
        key: 'photo',
        width: 160,
        render: (text, record) => <img width={120} src={record.photo} />,
      },
      {
        title: 'Listed / Last Modified',
        key: 'status',
        dataIndex: 'status',
        width: 180,
        render: (text, record) => <span>{formatDate(record.updated_at)}</span>,
      },
      {
        title: 'Instagram',
        dataIndex: 'instagram_url',
        key: 'instagram_url',
        width: 240,
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
        width: 320,
        render: (text, record) => (
          <Col>
            {record?.dresses?.map((item, index) => {
              const dressInfo = getDressInfo(constants, item);
              return (
                <>
                  <Row type="flex" align="middle">
                    {/* <ImageTag className={styles.marginBottom} item={dressInfo?.category} />
                    <ImageTag className={styles.marginBottom} item={dressInfo?.type} />

                    {dressInfo?.colors?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.styles?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.legs?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.lengths?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.fabrics?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.fits?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))}
                    {dressInfo?.necklines?.map((v) => (
                      <ImageTag className={styles.marginBottom} item={v} />
                    ))} */}

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
                    {dressInfo?.waist_rises?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                    {dressInfo?.patterns?.map((v) => (
                      <Tooltip title={v.alias}>
                        <Tag className={styles.marginBottom} color={Color.colors.pink}>
                          {v.title}
                        </Tag>
                      </Tooltip>
                    ))}
                  </Row>

                  <Row style={{ margin: 10 }} gutter={[8, 16]} type="flex">
                    <Col>
                      <Popconfirm
                        title="Sure to delete this dress?"
                        onConfirm={() => this.removeLookDress(record.id, item.id)}
                      >
                        <Button type="danger" icon="delete"></Button>
                      </Popconfirm>
                    </Col>

                    <Col>
                      <Button
                        onClick={() => this.updateLookDress(record, item)}
                        type="ghost"
                        icon="edit"
                      ></Button>
                    </Col>
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
      <Card title="Looks">
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
      </Card>
    );
  }
}

export default ListLook;
