import React from 'react';
import ReactTimeago from 'react-timeago';
import { Row, Col, Avatar, Tag, Dropdown, Menu, Button, Icon } from 'antd';
import { IUser, IAccountStatus } from 'types';
import { formatDate } from 'utils/date';
import { getAccountStatusColor } from 'utils/theme';
import styles from './Header.less';

interface IProps {
  user: IUser;
  onRequestAccessToken: (userID: string) => void;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (record: IUser, e: any) => {
    const { onRequestAccessToken } = this.props;
    if (e.key === '1') {
      onRequestAccessToken(record.id);
    }  else if (e.key === '2') {
    }
  };

  renderMenu = () => {
    const { user } = this.props;
    return (
      <Menu onClick={(e) => this.handleMenuClick(user, e)}>
        <Menu.Item key="1">Request Token</Menu.Item>

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
    const { user } = this.props;
    const accountStatus: IAccountStatus = user?.deleted_at ? 'Inactive' : 'Active';
    return (
      <Row gutter={[16, 16]}>
        <Col lg={{ offset: 0, span: 8 }} xs={{ offset: 4, span: 16 }}>
          <div className={styles.row}>
            <Avatar className={styles.avatar} size={64} src={user?.avatar} />
            <div className={styles.col}>
              <p className={styles.header}>{user?.name}</p>
              <p className={styles.header}>{user?.phone}</p>
            </div>
          </div>
        </Col>

        <Col lg={{ offset: 1, span: 15 }} xs={{ offset: 2, span: 18 }}>
          <Row gutter={48} type="flex" justify="end">
            <Col>
              {this.renderStatus(
                'REMAINING',
                <span>
                  <strong>{user?.remaining_credits}</strong> swops
                </span>,
              )}
            </Col>
            <Col>
              {this.renderStatus(
                'ACCOUNT STATUS',
                <Tag color={getAccountStatusColor(user?.deleted_at)}>{accountStatus}</Tag>,
              )}
            </Col>
            <Col>
              {this.renderStatus(
                'LAST VISITED',
                <ReactTimeago date={formatDate(user?.last_login || user?.created_at, null)} />,
              )}
            </Col>
            <Col>
              {this.renderStatus(
                'SIGN UP',
                <ReactTimeago date={formatDate(user?.created_at, null)} />,
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
