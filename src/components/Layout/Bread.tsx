import { Breadcrumb, Icon } from "antd";
import React, { Fragment, PureComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { IMenuItem, IMenus } from "types";
import Link from "umi/navlink";
import withRouter from "umi/withRouter";
import { pathMatchRegexp, queryAncestors } from "utils";
import styles from "./Bread.less";

interface IBreadProps extends Partial<RouteComponentProps> {
  routeList: IMenus;
}

class Bread extends PureComponent<IBreadProps> {
  generateBreadcrumbs = (paths: IMenus) => {
    return paths.map((item, key) => {
      const content = item && (
        <Fragment>
          {item.icon && <Icon type={item.icon} style={{ marginRight: 4 }} />}
          {item.name}
        </Fragment>
      );

      return (
        item && (
          <Breadcrumb.Item key={key}>
            {paths.length - 1 !== key ? <Link to={item.route || "#"}>{content}</Link> : content}
          </Breadcrumb.Item>
        )
      );
    });
  }
  render() {
    const { routeList, location } = this.props;

    // Find a route that matches the pathname.
    const currentRoute = routeList.find(
      (_) => _.route && pathMatchRegexp(_.route, location.pathname),
    );

    const notFoundRoute: IMenuItem = {
      id: "404",
      name: "Not Found",
      route: "/404",
    };
    // Find the breadcrumb navigation of the current route match and all its ancestors.
    const paths = currentRoute
      ? queryAncestors(routeList, currentRoute, "breadcrumbParentId").reverse()
      : [routeList[0], notFoundRoute];

    return <Breadcrumb className={styles.bread}>{this.generateBreadcrumbs(paths)}</Breadcrumb>;
  }
}
// @ts-ignore
export default withRouter(Bread);
