import React from 'react';
import ReactTimeago from 'react-timeago';
import { Row, Col, Avatar, Dropdown, Menu, Button, Icon } from 'antd';
import { ICollection } from 'types';
import { formatDate } from 'utils/date';
import styles from './Header.less';
import { Link } from 'umi';

interface IProps {
  collection: ICollection;
  onAddLook: (collection: ICollection) => void;
}
class Header extends React.PureComponent<IProps> {
  handleMenuClick = (record: ICollection, e: any) => {
    const { onAddLook } = this.props;
    if (e.key === '1') {
      onAddLook(record);
    } else if (e.key === '2') {
    }
  };

  renderMenu = () => {
    const { collection } = this.props;
    return (
      <Menu onClick={(e) => this.handleMenuClick(collection, e)}>
        <Menu.Item key="1">Add Look</Menu.Item>
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
    const { collection } = this.props;
    return (
      <Row gutter={[16, 16]}>
        <Col lg={{ offset: 0, span: 8 }} xs={{ offset: 4, span: 16 }}>
          <div className={styles.row}>
            <img className={styles.avatar} src={collection?.photo} />
            <div className={styles.col}>
              <p className={styles.header}>{collection?.name}</p>
              {typeof collection?.instagram_url === 'string' && collection?.instagram_url != '' && (
                <Link to={collection?.instagram_url}>
                  <p className={styles.header}>{collection?.instagram_url}</p>
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
                <ReactTimeago date={formatDate(collection?.updated_at, null)} />,
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
