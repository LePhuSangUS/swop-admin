import React from 'react';
import { Row, Col, Menu, Tag, Dropdown, Tooltip, Button, Icon, Modal } from 'antd';
import { IMatching } from 'types';
import { getMatchingStatusColor, getSwopStatusColor } from 'utils/theme';
import styles from './Header.less';
import { getMatchingStatusDisplay, getSwopStatusDisplay } from 'utils/mapping';

interface IProps {
  matching: IMatching;
  onUpdateMatching: () => void;
  onMarkAsEarlyReturnConfirmed: (id: string) => void;
  onMarkAsRetentionConfirmed: (id: string) => void;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (key: string) => {
    const {
      onUpdateMatching,
      onMarkAsEarlyReturnConfirmed,
      onMarkAsRetentionConfirmed,
      matching,
    } = this.props;
    if (key === '1') {
      onUpdateMatching();
    } else if (key === '2') {
      Modal.info({
        title: 'Please make sure you know what are you doing!',
        maskClosable: true,
        okCancel: true,
        content: (
          <div>
            <strong>Story:</strong>
            <ul>
              <li>
                User sends wrong clothes to the laundry but the laundry user does not detect and
                sends forward
              </li>
            </ul>
            <br />
            <strong>Solution:</strong>
            <ul>
              <li>
                Admin user can manually set the swop status to "EarlyReturnConfirmed" and then the
                rest of the return flow follows.
              </li>
              <li>Admin user can credit a free swop to the user.</li>
            </ul>
          </div>
        ),
        onOk: () => onMarkAsEarlyReturnConfirmed(matching.id),
      });
    } else if (key === '3') {
      Modal.info({
        title: 'Please make sure you know what are you doing!',
        maskClosable: true,
        okCancel: true,
        content: (
          <div>
            <strong>Story:</strong>
            <ul>
              <li>Both users don't return the clothes i.e. ReturnUnpicked for both.</li>
            </ul>
            <br />
            <strong>Solution:</strong>
            <ul>
              <li>
                Admin user can manually set the swop status to "RetentionConfirmed". After this both
                clothes status changes from ReturnUnpicked, which means they are not in default and
                can continue using the app as before
              </li>
            </ul>
          </div>
        ),
        onOk: () => onMarkAsRetentionConfirmed(matching.id),
      });
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
    return (
      <Menu onClick={(e) => this.handleMenuClick(e.key)}>
        <Menu.Item key="1">Update Matching</Menu.Item>
        <Menu.Item key="2">Mark As Early Return Confirmed</Menu.Item>
        <Menu.Item key="3">Mark As Retention Confirmed</Menu.Item>
      </Menu>
    );
  };

  render() {
    const { matching } = this.props;
    return (
      <Row gutter={[16, 16]}>
        <Col lg={{ offset: 0, span: 8 }} xs={{ offset: 4, span: 16 }}>
          <div className={styles.row}>
            <div className={styles.col}>
              <p className={styles.header}>{matching?.id}</p>
              <p className={styles.header}>{matching?.reference_code}</p>
            </div>
          </div>
        </Col>
        <Col lg={{ offset: 1, span: 15 }} xs={{ offset: 2, span: 18 }}>
          <Row gutter={48} type="flex" justify="end">
            <Col>
              {this.renderStatus(
                'STATUS',
                <Tooltip title={matching?.status}>
                  <Tag color={getMatchingStatusColor(matching?.status)}>
                    {getMatchingStatusDisplay(matching?.status)}
                  </Tag>
                </Tooltip>,
              )}
            </Col>
            <Col>
              {this.renderStatus(
                'SWOP STATUS',
                <Tooltip title={matching?.swop?.status}>
                  <Tag color={getSwopStatusColor(matching?.swop?.status)}>
                    {getSwopStatusDisplay(matching?.swop?.status)}
                  </Tag>
                </Tooltip>,
              )}
            </Col>
            <Col>
              {this.renderStatus(
                'COUNTER SWOP STATUS',
                <Tooltip title={matching?.counter_swop?.status}>
                  <Tag color={getSwopStatusColor(matching?.counter_swop?.status)}>
                    {getSwopStatusDisplay(matching?.counter_swop?.status)}
                  </Tag>
                </Tooltip>,
              )}
            </Col>

            {/* <Col>
              <Dropdown overlay={this.renderMenu}>
                <Button>
                  Options <Icon type="down" />
                </Button>
              </Dropdown>
            </Col> */}
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Header;
