import React from 'react';
import ReactJson, { ThemeKeys } from 'react-json-view';

interface IProps {
  object: any;
  collapsed?: boolean;
  theme?: ThemeKeys;
}
export const SyntaxHighlight: React.FC<IProps> = (props) => {
  const { object, collapsed = true, theme } = props;
  return (
    <ReactJson
      theme={theme}
      name={false}
      groupArraysAfterLength={100}
      collapsed={collapsed}
      displayDataTypes={false}
      src={object}
    />
  );
};
export default SyntaxHighlight;
