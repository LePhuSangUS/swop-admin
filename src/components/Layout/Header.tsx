import { Ellipsis } from 'ant-design-pro';
import { Avatar, Badge, Icon, Layout, List, Menu, Popover } from 'antd';
import classnames from 'classnames';
import React, { Fragment, PureComponent } from 'react';
import { IMenus, IUser } from 'types';
import { router } from 'umi';
import moment from 'utils/date';
import styles from './Header.less';

const { SubMenu } = Menu;

export interface IHeaderProps {
  fixed: boolean;
  user: IUser;
  menus: IMenus;
  collapsed: boolean;
  onSignOut: () => void;
  onEdit: () => void;
  notifications: any[];
  onCollapseChange: (collapsed: boolean) => void;
  onAllNotificationsRead: () => void;
}

class Header extends PureComponent<Partial<IHeaderProps>> {
  handleClickMenu = (e: any) => {
    const { onSignOut } = this.props;
    if (e.key === '1') {
      onSignOut();
    } else if (e.key === '2') {
      router.push('/settings');
    }
  };
  render() {
    const {
      fixed,
      user,
      collapsed,
      notifications = [],
      onCollapseChange,
      onAllNotificationsRead,
    } = this.props;

    const { name, avatar } = user;
    const rightContent = [
      <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
        <SubMenu
          title={
            <Fragment>
              <span style={{ color: '#999', marginRight: 4 }}>Hi,</span>
              <span>{name}</span>
              <Avatar style={{ marginLeft: 8 }} src={avatar} />
            </Fragment>
          }
        >
          <Menu.Item key="1">Sign out</Menu.Item>
          <Menu.Item key="2">Settings</Menu.Item>
        </SubMenu>
      </Menu>,
    ];

    rightContent.unshift(
      <Popover
        placement="bottomRight"
        trigger="click"
        key="notifications"
        overlayClassName={styles.notificationPopover}
        getPopupContainer={() => document.querySelector('#primaryLayout')}
        content={
          <div className={styles.notification}>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              locale={{
                emptyText: 'You have viewed all notifications.',
              }}
              renderItem={(item) => (
                <List.Item className={styles.notificationItem}>
                  <List.Item.Meta
                    title={
                      <Ellipsis tooltip={true} lines={1}>
                        {item.title}
                      </Ellipsis>
                    }
                    description={moment(item.date).fromNow()}
                  />
                  <Icon style={{ fontSize: 10, color: '#ccc' }} type="right" theme="outlined" />
                </List.Item>
              )}
            />
            {notifications.length ? (
              <div onClick={onAllNotificationsRead} className={styles.clearButton}>
                Clear notifications
              </div>
            ) : null}
          </div>
        }
      >
        <Badge
          count={notifications.length}
          dot={true}
          offset={[-10, 10]}
          className={styles.iconButton}
        >
          <Icon className={styles.iconFont} type="bell" />
        </Badge>
      </Popover>,
    );

    return (
      <Layout.Header
        className={classnames(styles.header, {
          [styles.fixed]: fixed,
          [styles.collapsed]: collapsed,
        })}
        id="layoutHeader"
      >
        <div className={styles.button} onClick={onCollapseChange.bind(this, !collapsed)}>
          <Icon
            type={classnames({
              'menu-unfold': collapsed,
              'menu-fold': !collapsed,
            })}
          />
        </div>

        <div className={styles.rightContainer}>{rightContent}</div>
      </Layout.Header>
    );
  }
}

export default Header;
