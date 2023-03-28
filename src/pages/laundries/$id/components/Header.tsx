import React from 'react';
import { Row, Col, Tag } from 'antd';
import { IUser, IAccountStatus, ILaundry } from 'types';
import { getAccountStatusColor } from 'utils/theme';
import styles from './Header.less';
import Link from 'umi/link';

interface IProps {
  laundry: ILaundry;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (record: IUser, e: any) => {
    const {} = this.props;
    if (e.key === '1') {
    } else if (e.key === '2') {
    } else if (e.key === '3') {
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

  render() {
    const { laundry } = this.props;
    const accountStatus: IAccountStatus = laundry?.deleted_at ? 'Inactive' : 'Active';
    const laundryStatus = laundry?.is_laundry_stop_ordering ? 'Denying' : 'Accepting';
    const laundryAdminStatus = laundry?.is_admin_stop_ordering ? 'Inactive' : 'Active';
    return (
      <Row>
        <Col lg={{ offset: 0, span: 9 }} xs={{ span: 24 }}>
          <div className={styles.row}>
            <p className={styles.header}>{`${laundry?.name} `}</p>
            <strong
              style={{ marginLeft: 10 }}
            >{`( ${laundryStatus} • ${laundryAdminStatus} )`}</strong>
          </div>
          <p className={styles.header}>{laundry?.phone}</p>
        </Col>
        <Col lg={{ offset: 1, span: 14 }} xs={{ span: 24 }}>
          <Row type="flex" justify="end" gutter={48}>
            <Col>
              <p className={styles.title}>RELATIONSHIP MANAGER</p>
              <Link to={`/users/${laundry?.relationship_manager?.id}`}>
                <p className={styles.title}>
                  {`${laundry?.relationship_manager?.name} • (${laundry?.relationship_manager?.phone})`}
                </p>
              </Link>
            </Col>

            <Col>
              <p className={styles.title}>MANAGER</p>
              <Link to={`/users/${laundry?.manager?.id}`}>
                <p
                  className={styles.title}
                >{`${laundry?.manager?.name} • (${laundry?.manager?.phone})`}</p>
              </Link>
            </Col>

            <Col>
              {this.renderStatus(
                'ADMIN STATUS',
                <Tag color={getAccountStatusColor(laundry?.deleted_at)}>{accountStatus}</Tag>,
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Header;
