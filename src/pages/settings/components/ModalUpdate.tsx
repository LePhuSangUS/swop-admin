import React from 'react';
import { Form, Input, Modal, Row, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { ImageUpload } from 'components';
import { IConstants, IFormProps, IUser } from 'types';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';

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
  constant: IConstants;
  item: IUser;
  onAccept: (item: IUser) => void;
}

interface IModelState {
  imageFile: File | null;
  confirmDirty: boolean;
}
class ModalUpdate extends React.PureComponent<IModalProps, IModelState> {
  state: IModelState = {
    imageFile: null,
    confirmDirty: false,
  };

  handleOk = () => {
    const { imageFile } = this.state;
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        imageFile,
        id: item?.id,
      };

      onAccept(data);
    });
  };

  handleConfirmBlur = (e: any) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  renderPassword = () => {
    const { item, form } = this.props;
    const { getFieldDecorator } = form;
    if (!item) {
      return (
        <React.Fragment>
          <Form.Item label="Password" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
        </React.Fragment>
      );
    }

    return null;
  };

  handlePickupLocationChange = (value: any) => {
    this.props.form.setFieldsValue({ coordinate: value });
  };

  render() {
    const { constant, item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <Row type="flex" justify="center">
            <div>
              <ImageUpload
                defaultImageURL={item?.avatar}
                onImageLoaded={(file) => this.setState({ imageFile: file })}
              />
            </div>
          </Row>

          <FormItem label="Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item?.name,
            })(<Input />)}
          </FormItem>

          <FormItem label="Phone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item?.phone,
              rules: [
                {
                  required: true,
                  message: 'The input is not valid phone!',
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

          <FormItem label="Email" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item?.email,
              rules: [
                {
                  required: false,
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Permissions" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('permissions', {
              initialValue: item?.permissions || [],
              rules: [
                {
                  required: true,
                  message: 'Please select permissions!',
                },
              ],
            })(
              <Select mode="multiple" style={{ width: '100%' }}>
                {constant?.admin_member_permissions?.map((item) => (
                  <Select.Option value={item.alias} key={item.alias}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>

          {this.renderPassword()}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdate);
