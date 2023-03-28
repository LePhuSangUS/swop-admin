import React from 'react';
import { Form, Input, Modal, AutoComplete, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IUser, IPagination, IConstants } from 'types';
import api from 'services/api';
import { capitalizeFirstLetter } from 'utils/mapping';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  item: IUser;
  constant: IConstants;
  onAdd: (item: IUser) => void;
}

interface IState {
  admins: IPagination<IUser>;
  searching: boolean;
  selectedUser: IUser;
}
class ModalAddAdmin extends React.PureComponent<IModalProps, IState> {
  state: IState = {
    admins: null,
    searching: false,
    selectedUser: null,
  };
  handleOk = () => {
    const { onAdd, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        id: this.state?.selectedUser?.id,
        ...getFieldsValue(),
        role: 'admin',
      };

      onAdd(data);
    });
  };

  onSearch = (value: Object) => {
    if (this.state.searching) {
      return;
    }

    api
      .searchUser({
        ...value,
        list_role: 'user',
        limit: 20,
      })
      .then((resp) => {
        if (!resp.success) {
          throw resp.data;
        }

        this.setState({ searching: false, admins: resp.data, selectedUser: null });
      })
      .finally(() => {
        this.setState({ searching: false });
      });
  };

  onSelect = (value: any, object: any) => {
    const user = this.state.admins?.records?.find((item) => item.id === value);
    if (user) {
      this.setState(
        {
          selectedUser: user,
        },
        () => {
          this.props.form.setFieldsValue({
            phone: user.phone,
            email: user.email,
            name: user.name,
            permissions: user.permissions || [],
          });
        },
      );
    }
  };

  renderOption = (item: IUser) => {
    return (
      <AutoComplete.Option style={{ borderBottom: '1px solid #eee' }} key={item.id}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong className="global-search-item-count">{capitalizeFirstLetter(item?.role)}</strong>
          <span className="global-search-item-count">{item.name}</span>
          <span className="global-search-item-count">{item.email}</span>
          <span className="global-search-item-count">{item.phone}</span>
        </div>
      </AutoComplete.Option>
    );
  };

  render() {
    const { constant, item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    const { searching, admins } = this.state;
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem labelAlign="left" label="Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item?.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem labelAlign="left" label="Email" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item?.email,
              rules: [
                {
                  required: true,
                  type: 'email',
                },
              ],
            })(
              <AutoComplete
                className="global-search"
                style={{ width: '100%' }}
                dataSource={admins?.records?.map(this.renderOption)}
                onSelect={this.onSelect}
                onSearch={(email) => this.onSearch({ email })}
                optionLabelProp="text"
              >
                <Input.Search loading={searching} />
              </AutoComplete>,
            )}
          </FormItem>

          <FormItem labelAlign="left" label="Phone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item?.phone,
              rules: [
                {
                  required: true,
                  pattern: /^\+84?(3|5|7|8|9|1[2|6|8|9])+([0-9]{8})\b/,
                  message: 'Phone is invalid ( the valid format is: +84xxxxxxxxx )',
                },
              ],
            })(
              <AutoComplete
                className="global-search"
                style={{ width: '100%' }}
                dataSource={admins?.records?.map(this.renderOption)}
                onSelect={this.onSelect}
                onSearch={(phone) => this.onSearch({ phone })}
                optionLabelProp="text"
              >
                <Input.Search loading={searching} />
              </AutoComplete>,
            )}
          </FormItem>

          <FormItem labelAlign="left" label="Password" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem labelAlign="left" label="Permissions" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('permissions', {
              initialValue: item?.phone,
              rules: [
                {
                  required: true,
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAddAdmin);
