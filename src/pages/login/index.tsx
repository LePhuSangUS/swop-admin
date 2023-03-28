import React from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import { IConnectProps, IConnectState } from 'types';
import { IFormProps } from 'types';
import { config } from 'utils';
import styles from './index.less';

const FormItem = Form.Item;

interface ILoginProps extends IFormProps, IConnectProps, IConnectState {
  form: any;
}

class Login extends React.PureComponent<ILoginProps> {
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors: any, values: any) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row>
        <Col
          className={styles.container}
          xl={{ span: 6, offset: 9 }}
          lg={{ span: 10, offset: 7 }}
          span={22}
          offset={1}
        >
          <div className={styles.form}>
            <div className={styles.logo}>
              <img alt="logo" src={config.logoPath} />
              <span>{config.siteName}</span>
            </div>
            <Form>
              <FormItem hasFeedback={true}>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      type: 'email',
                      message: 'Please enter a valid email',
                    },
                  ],
                })(<Input onPressEnter={this.handleOk} placeholder="Email" />)}
              </FormItem>
              <FormItem hasFeedback={true}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input type="password" onPressEnter={this.handleOk} placeholder="Password" />)}
              </FormItem>
              <Row>
                <Button
                  type="primary"
                  onClick={this.handleOk}
                  loading={loading.effects['login/login']}
                >
                  Sign in
                </Button>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

export default connect(({ loading }: IConnectState) => ({ loading }))(Form.create()(Login));
