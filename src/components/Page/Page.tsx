import classnames from "classnames";
import React, { Component } from "react";
import Loader from "../Loader/Loader";
import styles from "./Page.less";

interface IPageProps {
  loading?: boolean;
  inner?: boolean;
  className?: string;
}

export default class Page extends Component<IPageProps> {
  render() {
    const { className, children, loading = false, inner = false } = this.props;
    const loadingStyle = {
      height: "calc(100vh - 184px)",
      overflow: "hidden",
    };
    return (
      <div
        className={classnames(className, {
          [styles.contentInner]: inner,
        })}
        style={loading ? loadingStyle : null}
      >
        {loading ? <Loader spinning={true} /> : ""}
        {children}
      </div>
    );
  }
}
