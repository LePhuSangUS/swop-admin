import React from 'react';
import ReactTimeago from 'react-timeago';
import { Row, Col, Avatar, Dropdown, Menu, Button, Icon } from 'antd';
import { ILook } from 'types';
import { formatDate } from 'utils/date';
import styles from './Header.less';
import { Link } from 'umi';

interface IProps {
  look: ILook;
  onAddLookDress: (look: ILook) => void;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (record: ILook, e: any) => {
    const { onAddLookDress } = this.props;
    if (e.key === '1') {
      onAddLookDress(record);
    } else if (e.key === '2') {
    }
  };

  renderMenu = () => {
    const { look } = this.props;
    return (
      <Menu onClick={(e) => this.handleMenuClick(look, e)}>
        <Menu.Item key="1">Add Dress</Menu.Item>
      </Menu>
    );
  };
  renderStatus(title: string, element: React.ReactElement) {
    return (
      <React.Fragment>
        <div className={styles.title}>{title}</div>
        {element}
      </React.Fragment>
    );
  }

  render() {
    const { look } = this.props;
    return (
      <Row gutter={[16, 16]}>
        <Col lg={{ offset: 0, span: 8 }} xs={{ offset: 4, span: 16 }}>
          <div className={styles.row}>
            <Avatar shape="square" className={styles.avatar} size={64} src={look?.photo} />
            <div className={styles.col}>
              {typeof look?.instagram_url === 'string' && look?.instagram_url != '' && (
                <Link to={look?.instagram_url}>
                  <p className={styles.header}>{look?.instagram_url}</p>
                </Link>
              )}
            </div>
          </div>
        </Col>

        <Col lg={{ offset: 1, span: 15 }} xs={{ offset: 2, span: 18 }}>
          <Row gutter={48} type="flex" justify="end">
            <Col>
              {this.renderStatus(
                'LAST EDITED',
                <ReactTimeago date={formatDate(look?.updated_at, null)} />,
              )}
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
