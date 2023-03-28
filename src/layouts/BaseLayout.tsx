import { Loader } from "components";
import { connect } from "dva";
import NProgress from "nprogress";
import React, { Fragment, PureComponent } from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router-dom";
import withRouter from "umi/withRouter";
import { queryLayout } from "utils";
import config from "utils/config";
import "./BaseLayout.less";
import PrimaryLayout from "./PrimaryLayout";
import PublicLayout from "./PublicLayout";

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout,
};

interface IBaseLayoutProps extends RouteComponentProps {
  loading: any;
}

class BaseLayout extends PureComponent<IBaseLayoutProps, any> {
  previousPath = "";
  render() {
    const { loading, children, location } = this.props;
    const Container = LayoutMap[queryLayout(config.layouts, location.pathname)];
    const currentPath = location.pathname + location.search;
    if (currentPath !== this.previousPath) {
      NProgress.start();
    }

    if (!loading.global) {
      NProgress.done();
      this.previousPath = currentPath;
    }

    return (
      <Fragment>
        <Helmet>
          <title>{config.siteName}</title>
        </Helmet>
        {/* <Loader fullScreen={true} spinning={loading.effects["app/query"]} /> */}
        <Container>{children}</Container>
      </Fragment>
    );
  }
}

export default withRouter(connect(({ loading }: IBaseLayoutProps) => ({ loading }))(BaseLayout));
