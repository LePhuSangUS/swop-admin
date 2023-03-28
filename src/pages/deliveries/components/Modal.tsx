import React from 'react';
import { Form, Input, Modal, Row, Select, Switch } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { AutoCompletePlace, ImageUpload, AutoCompleteTimezone } from 'components';
import { IFormProps, IUser } from 'types';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';

const { Option } = Select;
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
  item: IUser;
  onAccept: (item: IUser) => void;
}

interface IModelState {
  imageFile: File | null;
  confirmDirty: boolean;
}
class UserModal extends React.PureComponent<IModalProps, IModelState> {
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
    const { item, onOk, form, ...modalProps } = this.props;
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
          <FormItem label="Role" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('role', {
              initialValue: item?.role || 'user',
              rules: [
                {
                  required: true,
                  message: 'Please select a valid role',
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="First Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('first_name', {
              initialValue: item?.first_name,
              rules: [
                {
                  required: true,
                  message: 'Please enter first name',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Last Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('last_name', {
              initialValue: item?.last_name,
              rules: [
                {
                  required: true,
                  message: 'Please enter last name',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Location" {...formItemLayout}>
            {getFieldDecorator('coordinate', {
              initialValue: {
                lat: item?.coordinate?.lat,
                lng: item?.coordinate?.lng,
                address: item?.coordinate?.formatted_address,
                place_id: item?.coordinate?.google_place_id,
              },
              rules: [
                {
                  required: false,
                  message: 'Please select a location',
                },
              ],
            })(
              <AutoCompletePlace
                inputID="coordinate"
                initialValue={item?.coordinate?.formatted_address}
                placeholder="Search a location"
                onSelect={this.handlePickupLocationChange}
                form={form}
              />,
            )}
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
          <FormItem label="Timezone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('timezone', {
              initialValue: item?.timezone,
              rules: [
                {
                  required: true,
                  message: 'Please select your timezone!',
                },
              ],
            })(
              <AutoCompleteTimezone
                onSelect={(item) => {
                  form.setFieldsValue({
                    timezone: item,
                  });
                }}
                initialValue={item?.timezone}
              />,
            )}
          </FormItem>
          <Form.Item label="First Time Login" {...formItemLayout}>
            {getFieldDecorator('is_first_login', {
              initialValue: item?.is_first_login || false,
              rules: [{ required: false }],
            })(<Switch />)}
          </Form.Item>

          {this.renderPassword()}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(UserModal);
