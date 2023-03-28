import classNames from "classnames";
import React from "react";
import styles from "./Loader.less";

interface ILoaderProps {
  spinning?: boolean;
  fullScreen?: boolean;
  text?: string;
}
const Loader: React.SFC<ILoaderProps> = ({ spinning = false, fullScreen, text = "LOADING" }) => {
  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.warpper}>
        <div className={styles.inner} />
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
};

export default Loader;
