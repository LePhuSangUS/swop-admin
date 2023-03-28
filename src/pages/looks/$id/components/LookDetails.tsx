import React from 'react';
import { Carousel, Card, Col, Row, Divider, Tag } from 'antd';
import { getDressInfo } from 'utils';
import { IConstants, ILook } from 'types';
import theme from 'utils/theme';
import styles from './LookDetails.less';

interface IProps {
  look: ILook;
  constants: IConstants;
  title?: React.ReactNode;
}
class LookDetails extends React.Component<IProps> {
  render() {
    const { look, constants, title } = this.props;
    const lookInfo = getDressInfo(constants, look);
    const header = `${lookInfo?.category?.title || ''} • ${lookInfo?.type?.title || ''}`;

    return (
      <Card
        title={title}
        hoverable
        cover={
          <Carousel style={{ backgroundColor: theme.colors.background }} autoplay>
            {look?.photos?.map((item) => (
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
              <div className={styles.border}>{look?.size}</div>
            </div>
          }
          description={
            <div>
              <Row>
                {look?.tags?.map((item) => (
                  <Tag color={theme.colors.pink}>{item}</Tag>
                ))}
              </Row>
              <Divider />
            </div>
          }
        />

        <Row>
          {lookInfo?.necklines?.length > 0 && (
            <Col span={12}>
              <h3>Necklines</h3>
              <Row>
                {lookInfo?.necklines?.map((item) => (
                  <Tag color={theme.colors.pink}>{item.title}</Tag>
                ))}
              </Row>
              <Divider />
            </Col>
          )}

          {lookInfo?.fits?.length > 0 && (
            <Col span={12}>
              <h3>Fits</h3>
              <Row>
                {lookInfo?.fits?.map((item) => (
                  <Tag color={theme.colors.pink}>{item.title}</Tag>
                ))}
              </Row>
              <Divider />
            </Col>
          )}

          {lookInfo?.fabrics?.length > 0 && (
            <Col span={12}>
              <h3>Fabrics</h3>
              {lookInfo?.fabrics?.map((item) => (
                <Tag color={theme.colors.pink}>{item.title}</Tag>
              ))}
              <Divider />
            </Col>
          )}

          {lookInfo?.patterns?.length > 0 && (
            <Col span={12}>
              <h3>Patterns</h3>
              <Row>
                {lookInfo?.patterns?.map((item) => (
                  <Tag color={theme.colors.pink}>{item.title}</Tag>
                ))}
              </Row>
              <Divider />
            </Col>
          )}

          {lookInfo?.styles?.length > 0 && (
            <Col span={12}>
              <h3>Styles</h3>
              <Row>
                {lookInfo?.styles?.map((item) => (
                  <Tag color={theme.colors.pink}>{item.title}</Tag>
                ))}
              </Row>
              <Divider />
            </Col>
          )}

          {lookInfo?.colors?.length > 0 && (
            <Col span={12}>
              <h3>Colors</h3>
              <Row>
                {lookInfo?.styles?.map((item) => (
                  <Tag color={theme.colors.pink}>{item.title}</Tag>
                ))}
              </Row>
              <Divider />
            </Col>
          )}
        </Row>
      </Card>
    );
  }
}

export default LookDetails;
