import React from 'react';
import { Row, Col, Tag, Dropdown, Button, Icon, Menu } from 'antd';
import { ISwop } from 'types';
import { formatDate } from 'utils/date';
import { getSwopStatusColor } from 'utils/theme';
import { getSwopStatusDisplay } from 'utils/mapping';
import styles from './Header.less';
import { Link } from 'umi';

interface IProps {
  swop: ISwop;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (record: ISwop, e: any) => {
    if (e.key === '1') {
    } else if (e.key === '2') {
    }
  };

  renderStatus(title: string, element: React.ReactElement) {
    return (
      <React.Fragment>
        <div className={styles.title}>{title}</div>
        {element}
      </React.Fragment>
    );
  }

  renderMenu = () => {
    const { swop } = this.props;

    return (
      <Menu onClick={(e) => this.handleMenuClick(swop, e)}>
        <Menu.Item key="1">Update Status</Menu.Item>
      </Menu>
    );
  };

  render() {
    const { swop } = this.props;
    const dateTime = `${formatDate(swop?.delivery_date, "MMM DD' YY")} ${swop?.from_time_slot} - ${
      swop?.to_time_slot
    }`;
    return (
      <Row gutter={[16, 16]}>
        <Col lg={{ offset: 0, span: 8 }} xs={{ offset: 4, span: 16 }}>
          <h2>{`ID: ${swop?.id}`}</h2>
          <h2>
            Owner:{' '}
            <Link target="__blank" to={`/users/${swop?.user_id}`}>
              {swop?.user?.name}
            </Link>
          </h2>
        </Col>
        <Col lg={{ offset: 1, span: 15 }} xs={{ offset: 2, span: 18 }}>
          <Row gutter={48} type="flex" justify="end">
            <Col>
              {this.renderStatus(
                'STATUS',
                <Tag color={getSwopStatusColor(swop?.status)}>
                  {getSwopStatusDisplay(swop?.status)}
                </Tag>,
              )}
            </Col>

            <Col>
              {this.renderStatus(
                'OTHER STATUS',
                <Tag color={getSwopStatusColor(swop?.other_swop?.status)}>
                  {getSwopStatusDisplay(swop?.other_swop?.status)}
                </Tag>,
              )}
            </Col>

            <Col style={{ marginRight: '30px' }}>
              {this.renderStatus('DELIVERY DATE TIME', <span>{`${dateTime}`}</span>)}
            </Col>

            <Col style={{ marginRight: '30px' }}>
              {this.renderStatus('CREATED AT', <span>{formatDate(swop?.created_at)}</span>)}
            </Col>

            <Col>
              <Dropdown overlay={this.renderMenu}>
                <Button>
                  Options <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Header;
