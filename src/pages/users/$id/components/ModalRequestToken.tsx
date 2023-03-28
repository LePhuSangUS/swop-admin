import React from 'react';
import { Form, Input, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IUser } from 'types';
import { Ellipsis } from 'ant-design-pro';
import styles from './ModalRequestToken.less';
const FormItem = Form.Item;

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  user: IUser;
  onRequest: (data: any) => void;
}

interface IModelState {}
class ModalRequestToken extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onRequest, user, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      const { pin } = data;
      onRequest({
        pin,
        id: user.id,
      });
    });
  };

  render() {
    const { onOk, user, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Request Access Token"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem hasFeedback={true}>
          {getFieldDecorator('pin', {
            rules: [{ required: true, message: 'PIN is required' }],
          })(<Input autoComplete="no" type="password" placeholder="PIN" />)}
        </FormItem>
        {typeof user?.token === 'string' && user?.token !== '' && (
          <div>
            <Ellipsis tooltip lines={4} length={200}>
              {user?.token}
            </Ellipsis>
            <br />
            <span className={styles.warningText}>
              <strong>NOTE: </strong>This access token only for debug purpose. Please don't public
              this access token. It only valid for 1 hour.
            </span>
          </div>
        )}
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalRequestToken);
