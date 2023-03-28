import React from 'react';
import { Tooltip } from 'antd';
import { IDressObjectValue } from 'types';
import styles from './index.less';
interface IProps {
  item: IDressObjectValue;
  className?: string;
}
const ImageTag: React.SFC<IProps> = (props) => {
  const { className, item } = props;
  let classes = [styles.container];
  if (typeof className === 'string' && className !== '') {
    classes.push(className);
  }
  return (
    <Tooltip title={item?.alias}>
      <div className={classes?.join(' ')}>
        <img height={60} className={styles.img} src={item?.image_url} />
        <span className={styles.text}>{item?.title}</span>
      </div>
    </Tooltip>
  );
};

export default ImageTag;
