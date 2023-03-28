import React, { Component } from "react";
import withRouter from "umi/withRouter";

import BaseLayout from "./BaseLayout";

class Layout extends Component {
  render() {
    const { children } = this.props;

    return <BaseLayout>{children}</BaseLayout>;
  }
}

// @ts-ignore
export default withRouter(Layout);
