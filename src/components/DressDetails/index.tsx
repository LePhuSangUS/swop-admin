import React from 'react';
import { Carousel, Card, Col, Row, Divider, Tag } from 'antd';
import { Color, getDressInfo } from 'utils';
import { IConstants, IDress } from 'types';
import theme from 'utils/theme';
import styles from './index.less';

interface IProps {
  dress: IDress;
  constants: IConstants;
  title?: React.ReactNode;
}
class DressDetails extends React.Component<IProps> {
  render() {
    const { dress, constants, title } = this.props;
    const dressInfo = getDressInfo(constants, dress);
    const header = `${dressInfo?.category?.title || ''} • ${dressInfo?.type?.title || ''}`;

    return (
      <Card
        title={title}
        hoverable
        cover={
          <>
            <Carousel style={{ backgroundColor: theme.colors.background }} autoplay>
              {dress?.photos?.map((item) => (
                <div key={item} className={styles.imgWrap}>
                  <a target="__blank" href={item}>
                    <img
                      style={{ backgroundImage: 'linear-gradient(#fdfdfd, #f2f2f2)' }}
                      className={styles.img}
                      src={item}
                    />
                  </a>
                </div>
              ))}
            </Carousel>
            {dress?.is_in_swop && (
              <Row style={{ position: 'absolute', top: 5, right: 5 }}>
                <Tag color={Color.colors.blue2}>In a swop</Tag>
              </Row>
            )}
          </>
        }
      >
        <Card.Meta
          title={
            <div className={styles.row}>
              <div>{header}</div>
              <div className={styles.border}>{dress?.size}</div>
            </div>
          }
          description={
            <div>
              <p>{dress?.title}</p>
              <p>{dress?.note}</p>
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
    );
  }
}

export default DressDetails;
