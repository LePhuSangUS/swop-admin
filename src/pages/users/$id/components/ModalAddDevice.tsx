import React from 'react';
import { Form, Input, Modal, Select, Icon } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps } from 'types';

const { Option } = Select;
const FormItem = Form.Item;

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  onAddDevice: (data: any) => void;
}

interface IModelState {}

class ModalAddDevice extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onAddDevice, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      onAddDevice(data);
    });
  };

  render() {
    const { onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Add Device"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem hasFeedback={true}>
          {getFieldDecorator('platform', {
            initialValue: 'ios',
            rules: [{ required: true, message: 'Platform is required' }],
          })(
            <Select style={{ width: '30%', minWidth: 200 }}>
              <Option value="ios">
                <Icon style={{ width: 30, textAlign: 'left' }} type="apple" />
                iOS
              </Option>
              <Option value="android">
                <Icon style={{ width: 30, textAlign: 'left' }} type="android" />
                Android
              </Option>
            </Select>,
          )}
        </FormItem>
        <FormItem hasFeedback={true}>
          {getFieldDecorator('token', {
            rules: [{ required: true, message: 'Device Token is required' }],
          })(
            <Input
              style={{ paddingRight: 30 }}
              onPressEnter={this.handleOk}
              placeholder="Device Token"
            />,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAddDevice);
