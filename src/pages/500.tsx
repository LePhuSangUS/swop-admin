import { Result } from "antd";
import { Page } from "components";
import React from "react";

const Error = () => (
  <Page inner={true}>
    <Result status="500" title="500" subTitle="Sorry, the server is wrong." />
  </Page>
);

export default Error;
