import React from 'react';
import { Col, Row, Carousel, Card, Tag, Divider, List, Avatar } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IConnectState } from 'types';
import theme from 'utils/theme';
import styles from './index.less';
import { getDressInfo } from 'utils';
import Link from 'umi/link';

@connect(({ app, reportDetails, loading }: IConnectState) => ({ app, reportDetails, loading }))
class ReportDetails extends React.PureComponent<IConnectState> {
  renderCover() {
    return (
      <Carousel
        style={{ width: '100%', height: 460, backgroundColor: theme.colors.background }}
        autoplay
      >
        {}
      </Carousel>
    );
  }
  render() {
    const { reportDetails, app, loading } = this.props;

    const dressInfo = getDressInfo(app.appConstants, reportDetails?.dress);
    const header = `${dressInfo?.category?.title || ''} • ${dressInfo?.type?.title || ''}`;
    return (
      <Page inner={true} loading={loading.effects['laundryDetails/getLaundry']}>
        <Row type="flex" justify="center">
          <Col lg={{ span: 12 }} xs={{ span: 20 }}>
            <Card
              hoverable
              cover={
                <Carousel style={{ backgroundColor: theme.colors.background }} autoplay>
                  {reportDetails?.dress?.photos?.map((item) => (
                    <div className={styles.imgWrap}>
                      <a target="__blank" href={item}>
                        <img className={styles.img} src={item} />
                      </a>
                    </div>
                  ))}
                </Carousel>
              }
            >
              <Card.Meta
                title={
                  <div className={styles.row}>
                    <div>{header}</div>
                    <div className={styles.border}>{reportDetails?.dress?.size}</div>
                  </div>
                }
                description={
                  <div>
                    <p>{reportDetails?.dress?.title}</p>
                    <p>{reportDetails?.dress?.note}</p>
                    <Divider />
                  </div>
                }
              />

              <Row>
                {dressInfo?.necklines?.length > 0 && (
                  <Col span={12}>
                    <h3>Necklines</h3>
                    <Row>
                      {dressInfo?.necklines?.map((item) => (
                        <Tag color={theme.colors.pink}>{item.title}</Tag>
                      ))}
                    </Row>
                    <Divider />
                  </Col>
                )}

                {dressInfo?.fits?.length > 0 && (
                  <Col span={12}>
                    <h3>Fits</h3>
                    <Row>
                      {dressInfo?.fits?.map((item) => (
                        <Tag color={theme.colors.pink}>{item.title}</Tag>
                      ))}
                    </Row>
                    <Divider />
                  </Col>
                )}

                {dressInfo?.fabrics?.length > 0 && (
                  <Col span={12}>
                    <h3>Fabrics</h3>
                    {dressInfo?.fabrics?.map((item) => (
                      <Tag color={theme.colors.pink}>{item.title}</Tag>
                    ))}
                    <Divider />
                  </Col>
                )}

                {dressInfo?.patterns?.length > 0 && (
                  <Col span={12}>
                    <h3>Patterns</h3>
                    <Row>
                      {dressInfo?.patterns?.map((item) => (
                        <Tag color={theme.colors.pink}>{item.title}</Tag>
                      ))}
                    </Row>
                    <Divider />
                  </Col>
                )}

                {dressInfo?.styles?.length > 0 && (
                  <Col span={12}>
                    <h3>Styles</h3>
                    <Row>
                      {dressInfo?.styles?.map((item) => (
                        <Tag color={theme.colors.pink}>{item.title}</Tag>
                      ))}
                    </Row>
                    <Divider />
                  </Col>
                )}

                {dressInfo?.colors?.length > 0 && (
                  <Col span={12}>
                    <h3>Colors</h3>
                    <Row>
                      {dressInfo?.styles?.map((item) => (
                        <Tag color={theme.colors.pink}>{item.title}</Tag>
                      ))}
                    </Row>
                    <Divider />
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>

        <br />
        <br />
        <Card title="List Users Report This Dress">
          <List
            itemLayout="horizontal"
            dataSource={reportDetails?.list}
            pagination={reportDetails?.pagination}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.reported_by_user?.avatar} />}
                  title={
                    <Link to={`/users/${item.reported_by_user?.id}`}>
                      {item.reported_by_user?.name}
                    </Link>
                  }
                  description={
                    <span>
                      Report Type: <strong>{item.type}</strong>
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Page>
    );
  }
}

export default ReportDetails;
