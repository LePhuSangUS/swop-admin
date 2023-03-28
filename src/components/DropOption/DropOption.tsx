import { Button, Dropdown, Icon, Menu } from 'antd';
import React from 'react';

interface IProps {
  onMenuClick?: (item: any) => void;
  menuOptions?: Array<{ key: string; name: string }>;
  buttonStyle?: Object;
  dropdownProps?: Object;
  disabled?: boolean;
  style?: any;
}
const DropOption: React.SFC<IProps> = (props) => {
  const { onMenuClick, menuOptions, buttonStyle, dropdownProps, disabled, children } = props;
  const menu = menuOptions.map((item) => <Menu.Item key={item.key}>{item.name}</Menu.Item>);
  return (
    <Dropdown
      disabled={disabled}
      overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
      {...dropdownProps}
    >
      <Button style={{ border: 'none', ...buttonStyle }}>
        {children ? children : <Icon style={{ marginRight: 2 }} type="bars" />}
        <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default DropOption;
