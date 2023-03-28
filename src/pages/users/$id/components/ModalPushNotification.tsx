import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IUserDevice, IUser } from 'types';
import { Ellipsis } from 'ant-design-pro';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  user: IUser;
  sendAllDevicesOfUser: boolean;
  devices: IUserDevice[];
  currentDevice: IUserDevice;
  onSend: (data: any) => void;
}

interface IModelState {}
class ModalPushNotification extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onSend, form, sendAllDevicesOfUser, user } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };
      if (sendAllDevicesOfUser || data['device_token'] === 'all') {
        data['user_id'] = user?.id;
      } else {
        delete data['user_id'];
      }

      onSend(data);
    });
  };

  render() {
    const { onOk, currentDevice, devices, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    const item = devices?.find(
      (item) => typeof currentDevice?.token === 'string' && item.token === currentDevice?.token,
    );
    return (
      <Modal
        title="Send Notification"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem hasFeedback={true}>
          {getFieldDecorator('device_token', {
            initialValue: item?.token || 'all',
            rules: [{ required: true, message: 'Title is required' }],
          })(
            <Select style={{ width: '100%' }}>
              <Option key="all">All Device</Option>
              {devices?.map((item) => (
                <Option key={item.token}>
                  <Ellipsis tooltip lines={1} length={300}>
                    {item.token}
                  </Ellipsis>
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem hasFeedback={true}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Title is required' }],
          })(<Input onPressEnter={this.handleOk} placeholder="Title" />)}
        </FormItem>
        <FormItem hasFeedback={true}>
          {getFieldDecorator('message', {
            rules: [{ required: true, message: 'Message is required' }],
          })(<TextArea rows={6} onPressEnter={this.handleOk} placeholder="Message" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalPushNotification);
