import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';
import { config, classnames } from 'utils';
import ScrollBar from '../ScrollBar';
import SiderMenu from './Menu';
import styles from './Sider.less';
import { formatDate } from 'utils/date';

export interface ISiderProps {
  menus: any[];
  theme: 'light' | 'dark';
  isMobile: boolean;
  collapsed: boolean;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onCollapseChange: (collapsed: boolean) => void;
}

class Sider extends React.PureComponent<ISiderProps> {
  render() {
    const { menus, theme, isMobile, collapsed, onCollapseChange } = this.props;

    const logoClassname = classnames({
      [styles.logo]: !collapsed,
      [styles.logoSmall]: collapsed,
    });

    return (
      <Layout.Sider
        width={256}
        theme={theme}
        breakpoint="lg"
        trigger={null}
        collapsible={true}
        collapsed={collapsed}
        onBreakpoint={!isMobile && onCollapseChange}
        className={styles.sider}
      >
        <div className={styles.brand}>
          <img className={logoClassname} alt="logo" src={config.logoPath} />
        </div>

        <div className={styles.menuContainer}>
          <ScrollBar
            options={{
              // Disabled horizontal scrolling, https://github.com/utatti/perfect-scrollbar#options
              suppressScrollX: true,
            }}
          >
            <SiderMenu
              menus={menus}
              theme={theme}
              isMobile={isMobile}
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
            />
          </ScrollBar>
        </div>
        {!collapsed && (
          <div className={styles.info}>
            <span> {`Version: ${config.version}`}</span>
            <span>{`Last update: ${config.lastUpdate}`}</span>
          </div>
        )}
      </Layout.Sider>
    );
  }
}

export default Sider;
