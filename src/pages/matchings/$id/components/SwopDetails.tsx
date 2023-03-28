import React from 'react';
import { Card, Carousel, Row, Col, Divider, Tag, Spin, Tooltip, Checkbox } from 'antd';
import { IConstants, IOverdueBalance, ISwop, ITransaction, IUser } from 'types';
import Link from 'umi/link';
import styles from './SwopDetails.less';
import { getDressInfo } from 'utils';
import theme, { getSwopLogisticMethodColor } from 'utils/theme';
import { getSwopLogisticMethodDisplay } from 'utils/mapping';
import { formatMoneyCurrency } from 'utils/money';
import { Location } from 'components';
import { formatDate, formatDateTimeSlot } from 'utils/date';

interface IProps {
  swop: ISwop;
  otherSwop: ISwop;
  user: IUser;
  overdueBalance: IOverdueBalance;
  transactions: ITransaction[];
  constants: IConstants;
  loading?: boolean;
}

class SwopDetails extends React.PureComponent<IProps> {
  renderTitle = () => {
    const { swop } = this.props;

    return (
      <Row type="flex" justify="space-between">
        <span>{swop?.is_counter ? 'Counter Swop' : 'Swop'}</span>
      </Row>
    );
  };

  renderContent() {
    const { swop, user, overdueBalance, constants } = this.props;
    const dressInfo = getDressInfo(constants, swop?.dress);
    const header = `${dressInfo?.category?.title || ''} • ${dressInfo?.type?.title || ''}`;
    const reReturnCategory = constants?.dress_categories?.find(
      (item) => item.alias === swop?.re_return_dress_category,
    );
    const reReturnCategoryType = `${reReturnCategory?.title || ''} • ${
      reReturnCategory?.types?.find((item) => item.alias === swop?.re_return_dress_type)?.title ||
      ''
    }`;
    return (
      <Card
        hoverable={false}
        title={this.renderTitle()}
        cover={
          <Row style={{ textAlign: 'center' }}>
            {(swop?.dress.is_different || swop?.dress.is_return_different) &&
              swop?.dress?.proof_photos?.length > 0 && (
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Carousel autoplay>
                    {swop?.dress?.proof_photos?.map((item) => (
                      <div className={styles.imgWrap}>
                        <a target="__blank" href={item}>
                          <img className={styles.img} src={item} />
                        </a>
                      </div>
                    ))}
                  </Carousel>
                  <div>Different Photos</div>
                </Col>
              )}
            <Col
              span={
                (swop?.dress.is_different || swop?.dress.is_return_different) &&
                swop?.dress?.proof_photos?.length > 0
                  ? 12
                  : 24
              }
            >
              <Carousel autoplay>
                {swop?.dress?.photos?.map((item) => (
                  <div className={styles.imgWrap}>
                    <a target="__blank" href={item}>
                      <img className={styles.img} src={item} />
                    </a>
                  </div>
                ))}
              </Carousel>
            </Col>
          </Row>
        }
      >
        <Card.Meta
          title={
            <div className={styles.row}>
              <div>{header}</div>
              <div className={styles.border}>{swop?.dress?.size}</div>
            </div>
          }
          description={
            <div>
              <p>{swop?.dress?.title}</p>
              <p>{swop?.dress?.note}</p>
              <Divider />
            </div>
          }
        />

        <Row>
          <Col span={12}>
            <h3>Necklines</h3>
            {dressInfo?.necklines?.length > 0 && (
              <Row>
                {dressInfo?.necklines?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Sleeves</h3>
            {dressInfo?.sleeves?.length > 0 && (
              <Row>
                {dressInfo?.sleeves?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Fits</h3>
            {dressInfo?.fits?.length > 0 && (
              <Row>
                {dressInfo?.fits?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Fabrics</h3>
            {dressInfo?.fabrics?.length > 0 && (
              <Row>
                {dressInfo?.fabrics?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Patterns</h3>
            {dressInfo?.patterns?.length > 0 && (
              <Row>
                {dressInfo?.patterns?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Styles</h3>
            {dressInfo?.styles?.length > 0 && (
              <Row>
                {dressInfo?.styles?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>

          <Col span={12}>
            <h3>Colors</h3>
            {dressInfo?.colors?.length > 0 && (
              <Row>
                {dressInfo?.styles?.map((item) => (
                  <Tag key={item.title} color={theme.colors.pink}>
                    {item.title}
                  </Tag>
                ))}
              </Row>
            )}
            <Divider />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Swop ID: <Link to={`/swops/${swop?.id}`}>{swop?.id}</Link>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Owner: <Link to={`/users/${user?.id}`}>{`${user?.name} (${user?.phone})`}</Link>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Dress: <Link to={`/dresses/${swop?.dress?.id}`}>{`${swop?.dress?.id}`}</Link>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Chat Disabled: <Checkbox disabled checked={swop?.chat_disabled} />
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Send Back Reason: <Tag>{swop?.send_back_reason}</Tag>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Send Back Action: <Tag>{swop?.send_back_action}</Tag>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Re-Return Dress:{' '}
              <Link
                to={`/dresses/${swop?.re_return_dress_id}`}
              >{`${swop?.re_return_dress_id}`}</Link>
            </span>
          </Col>
          <Col span={24}>
            <span>
              Re-Return Dress Category & Type: {reReturnCategoryType}
              <span>
                -- Is Re-Return: <Checkbox disabled checked={swop?.is_re_return} />
              </span>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Proposed At:
              <strong>
                <Tooltip title={`${swop?.proposed_at}`}>{formatDate(swop?.proposed_at)}</Tooltip>
              </strong>
            </span>
          </Col>
          <Col span={24}>
            <span>
              Confirmed At:
              <strong>
                <Tooltip title={`${swop?.confirmed_at}`}>{formatDate(swop?.confirmed_at)}</Tooltip>
              </strong>
            </span>
          </Col>
          <Col span={24}>
            <span>
              Accepted At:
              <strong>
                <Tooltip title={`${swop?.accepted_at}`}>{formatDate(swop?.accepted_at)}</Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Completed At:
              <strong>
                <Tooltip title={`${swop?.completed_at}`}>{formatDate(swop?.completed_at)}</Tooltip>
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Pick Up Date Time:{' '}
              <strong>
                <Tooltip title={`${swop?.pick_up_from_time}-${swop?.pick_up_to_time}`}>
                  {' '}
                  {formatDateTimeSlot(swop?.pick_up_from_time, swop?.pick_up_to_time)}
                </Tooltip>
              </strong>
              <strong>
                {swop?.pick_up_attempts > 0 ? ` ${swop?.pick_up_attempts} Attempts` : ''}
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Pick Up Assigned At:{' '}
              <strong>
                <Tooltip title={`${swop?.pick_up_assgined_at}`}>
                  {formatDate(swop?.pick_up_assgined_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Picked Up At:{' '}
              <strong>
                <Tooltip title={`${swop?.picked_at}`}>{formatDate(swop?.picked_at)}</Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Laundry Received At:
              <strong>
                <Tooltip title={`${swop?.laundry_received_at}`}>
                  {formatDate(swop?.laundry_received_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Delivery Date Time:{' '}
              <strong>
                <Tooltip title={`${swop?.delivery_from_time}-${swop?.delivery_to_time}`}>
                  {' '}
                  {formatDateTimeSlot(swop?.delivery_from_time, swop?.delivery_to_time)}
                </Tooltip>
              </strong>
              <strong>
                {swop?.delivery_attempts > 0 ? ` -- ${swop?.delivery_attempts} Attempts` : ''}{' '}
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Delivery Assigned At:{' '}
              <strong>
                <Tooltip title={`${swop?.delivery_assgined_at}`}>
                  {formatDate(swop?.delivery_assgined_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Delivered At:{' '}
              <strong>
                <Tooltip title={`${swop?.delivered_at}`}>{formatDate(swop?.delivered_at)}</Tooltip>
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Return Pick Up Date Time:{' '}
              <strong>
                <Tooltip
                  title={`${swop?.return_pick_up_from_time}-${swop?.return_pick_up_to_time}`}
                >
                  {' '}
                  {formatDateTimeSlot(swop?.return_pick_up_from_time, swop?.return_pick_up_to_time)}
                </Tooltip>
              </strong>
              <strong>
                {swop?.return_pick_up_attempts > 0
                  ? ` -- ${swop?.return_pick_up_attempts} Attempts`
                  : ''}
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Return Pick Up Assigned At:{' '}
              <strong>
                <Tooltip title={`${swop?.return_pick_up_assgined_at}`}>
                  {formatDate(swop?.return_pick_up_assgined_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Return Picked At:{' '}
              <strong>
                <Tooltip title={`${swop?.return_picked_at}`}>
                  {formatDate(swop?.return_picked_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Laundry Return Received At:
              <strong>
                <Tooltip title={`${swop?.laundry_return_received_at}`}>
                  {formatDate(swop?.laundry_return_received_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Return Delivery Date Time:{' '}
              <strong>
                <Tooltip
                  title={`${swop?.return_delivery_from_time}-${swop?.return_delivery_to_time}`}
                >
                  {' '}
                  {formatDateTimeSlot(
                    swop?.return_delivery_from_time,
                    swop?.return_delivery_to_time,
                  )}
                </Tooltip>
              </strong>
              <strong>
                {swop?.return_delivery_attempts > 0
                  ? ` -- ${swop?.return_delivery_attempts} Attempts`
                  : ''}
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Return Delivery Assigned At:{' '}
              <strong>
                <Tooltip title={`${swop?.return_delivery_assgined_at}`}>
                  {formatDate(swop?.return_delivery_assgined_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>

          <Col span={24}>
            <span>
              Return Delivered At:{' '}
              <strong>
                <Tooltip title={`${swop?.return_delivered_at}`}>
                  {formatDate(swop?.return_delivered_at)}
                </Tooltip>
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className={styles.row}>
              <span style={{ marginRight: 6 }}>Swop Location: </span>
              <Location
                location={{
                  lat: swop?.coordinate?.lat,
                  lng: swop?.coordinate?.lng,
                  address: swop?.coordinate?.formatted_address,
                  google_place_id: swop?.coordinate?.google_place_id,
                }}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Logistic Method:{' '}
              <Tag
                key={swop?.logistic_method}
                color={getSwopLogisticMethodColor(swop?.logistic_method)}
              >
                {getSwopLogisticMethodDisplay(swop?.logistic_method)}
              </Tag>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span>
              Laundry ID: <Link to={`/laundries/${swop?.laundry_id}`}>{swop?.laundry?.name}</Link>
            </span>
          </Col>
          <Col span={24}>
            <div className={styles.row}>
              <span style={{ marginRight: 6 }}>Laundry Location: </span>
              <Location
                location={{
                  lat: swop?.laundry?.coordinate?.lat,
                  lng: swop?.laundry?.coordinate?.lng,
                  address: swop?.laundry?.coordinate?.formatted_address,
                  google_place_id: swop?.laundry?.coordinate?.google_place_id,
                }}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={13}>
            <span>
              {`Overdue Balance Deduct (od): `}{' '}
              <strong>{formatMoneyCurrency(swop?.deduct, swop?.currency)}</strong>
            </span>
          </Col>
          <Col span={13}>
            <span>
              {`Overdue Balance (OD): `}{' '}
              <strong>
                {formatMoneyCurrency(overdueBalance?.price, overdueBalance?.currency)}
              </strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={13}>
            <span>
              {`Cleaning Fee Deduct (cc): `}{' '}
              <strong>{formatMoneyCurrency(swop?.cleaning_fee_deduct, swop?.currency)}</strong>
            </span>
          </Col>
          <Col span={11}>
            <span>
              {`Cleaning Fee (CC): `}{' '}
              <strong>{formatMoneyCurrency(swop?.cleaning_fee, swop?.currency)}</strong>
            </span>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={13}>
            <span>
              {`Delivery Charges Deduct (dc): `}{' '}
              <strong>{formatMoneyCurrency(swop?.delivery_fee_deduct, swop?.currency)}</strong>
            </span>
          </Col>
          <Col span={11}>
            <span>
              {`Delivery Charges (DC): `}{' '}
              <strong>{formatMoneyCurrency(swop?.delivery_fee, swop?.currency)}</strong>
            </span>
          </Col>
        </Row>
        <Divider />
      </Card>
    );
  }

  render() {
    const { loading, children } = this.props;
    return (
      <Spin spinning={loading}>
        {this.renderContent()}
        {children}
      </Spin>
    );
  }
}

export default SwopDetails;
