import { Button, Dropdown, Menu, Icon } from 'antd';
import React from 'react';

interface IProps {
  onMenuClick?: (item: any) => void;
  menuOptions?: Array<{ key: string; name: string }>;
  buttonStyle?: React.CSSProperties;
  dropdownProps?: Object;
}
const SelectOption: React.SFC<IProps> = props => {
  const { onMenuClick, menuOptions, buttonStyle, dropdownProps } = props;
  const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>);
  return (
    <Dropdown overlay={<Menu onClick={onMenuClick}>{menu}</Menu>} {...dropdownProps}>
      <Button style={buttonStyle}>
        {props.children}
        <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default SelectOption;
