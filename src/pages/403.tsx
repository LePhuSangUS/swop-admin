import { Button, Result } from "antd";
import { Page } from "components";
import React from "react";

const Error = () => (
  <Page inner={false}>
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" key="console" onClick={() => {
          // @ts-ignore
          window.g_app._store.dispatch({
            type: "app/signOut",
          });
        }}>
          Return Login
        </Button>
      }
    />
  </Page>
);

export default Error;
