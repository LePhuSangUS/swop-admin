import { Result } from "antd";
import { Page } from "components";
import React from "react";

const Error = () => (
  <Page inner={true}>
    <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
  </Page>
);

export default Error;
