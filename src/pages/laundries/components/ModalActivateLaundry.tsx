import React from 'react';
import { Form, Input, Modal, Switch } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import { IFormProps, ILaundry, IUser } from 'types';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  item: ILaundry;
  onAccept: (item: ILaundry) => void;
}

interface IModelState {}
class ModalActivateLaundry extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        id: item?.id,
      };

      onAccept(data);
    });
  };

  render() {
    const { item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item?.name,
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid name',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Phone Number" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item?.phone,
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid phone',
                  validator: (
                    rule: any,
                    value: any,
                    callback: any,
                    source?: any,
                    options?: any,
                  ) => {
                    const { phone } = source;
                    if (phone !== '') {
                      return isValidPhoneNumber(phone) || isPossiblePhoneNumber(phone);
                    }
                    return true;
                  },
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="First Time Login" hasFeedback={false} {...formItemLayout}>
            {getFieldDecorator('is_first_login', {
              initialValue: true,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Switch defaultChecked />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalActivateLaundry);
