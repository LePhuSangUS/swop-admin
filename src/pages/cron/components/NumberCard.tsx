import { Icon as LegacyIcon } from "@ant-design/compatible";
import { Card } from "antd";
import { Spin } from "antd";
import React from "react";
import CountUp from "react-countup";
import styles from "./NumberCard.less";

export interface INumberCardProps {
  icon?: string;
  color?: string;
  title?: string;
  number: number;
  countUp?: object;
  loading?: boolean;
}

const NumberCard: React.SFC<INumberCardProps> = (props) => {
  const { color, icon, number, countUp, title, loading = true } = props;
  return (
    <Spin spinning={loading}>
      <Card
        className={styles.numberCard}
        bordered={false}
        bodyStyle={{ padding: 10 }}
      >
        <LegacyIcon className={styles.iconWarp} style={{ color }} type={icon} />
        <div className={styles.content}>
          <p className={styles.title}>{title || "No Title"}</p>
          <p className={styles.number}>
            <CountUp
              start={0}
              end={number}
              duration={2.75}
              useEasing={true}
              separator=","
              {...(countUp || {})}
            />
          </p>
        </div>
      </Card>
    </Spin>
  );
};

export default NumberCard;
