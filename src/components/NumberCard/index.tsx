import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card } from 'antd';
import { Spin } from 'antd';
import React from 'react';
import CountUp from 'react-countup';
import styles from './index.less';

export interface INumberCardProps {
  icon?: string;
  color?: string;
  title?: string;
  subTitle?: string;
  number: number;
  countUp?: object;
  loading?: boolean;
  bordered?: boolean;
  formattingFn?: (n: number) => string;
}

const NumberCard: React.SFC<INumberCardProps> = (props) => {
  const {
    color,
    icon,
    number,
    countUp,
    title,
    subTitle,
    bordered,
    formattingFn,
    loading = true,
  } = props;
  return (
    <Spin spinning={loading}>
      <Card className={styles.numberCard} bordered={bordered} bodyStyle={{ padding: 10 }}>
        <LegacyIcon className={styles.iconWarp} style={{ color }} type={icon} />
        <div className={styles.content}>
          {typeof title === 'string' && title !== '' && <p className={styles.title}>{title}</p>}
          <p className={styles.number}>
            <CountUp
              start={0}
              end={number}
              formattingFn={formattingFn}
              duration={2.75}
              useEasing={true}
              separator=","
              {...(countUp || {})}
            />
          </p>
          {typeof subTitle === 'string' && subTitle !== '' && (
            <p className={styles.subTitle}>{subTitle}</p>
          )}
        </div>
      </Card>
    </Spin>
  );
};

export default NumberCard;
