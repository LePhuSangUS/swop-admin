import React from 'react';
import { Form, Input, Modal, Switch, AutoComplete, InputNumber } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { AutoCompletePlace } from 'components';
import { IConstants, IFormProps, ILaundry, IPagination, IUser } from 'types';
import { capitalizeFirstLetter } from 'utils/mapping';
import api from 'services/api';
import { formatCurrencyInput } from 'utils/money';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  constant: IConstants;
  item: ILaundry;
  onAccept: (item: ILaundry) => void;
}

interface IState {
  admins: IPagination<IUser>;
  searchingAdmin: boolean;
  selectedAdmin: IUser;

  laundryUsers: IPagination<IUser>;
  searchingLaundryUser: boolean;
  selectedLaundryUser: IUser;

  users: IPagination<IUser>;
  searchingUser: boolean;
  selectedUser: IUser;
}
class UserModal extends React.PureComponent<IModalProps, IState> {
  state: IState = {
    admins: null,
    searchingAdmin: false,
    selectedAdmin: null,
    users: null,
    searchingUser: false,
    selectedUser: null,
    laundryUsers: null,
    searchingLaundryUser: false,
    selectedLaundryUser: null,
  };
  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;
    const { selectedUser, selectedAdmin, selectedLaundryUser } = this.state;
    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...item,
        ...getFieldsValue(),
      };

      data.id = selectedUser?.id || data?.id || item?.id;
      data.manager.id = selectedLaundryUser?.id || data.manager?.id || item?.manager?.id;
      data.relationship_manager.id =
        selectedAdmin?.id || data?.relationship_manager?.id || item?.relationship_manager?.id;

      if (data.prices) {
        var list: any[] = [];
        Object.keys(data.prices || {}).map((key) => {
          list.push({
            cloth_category: key,
            unit_price: data.prices[key],
            currency: data.currency || 'VND',
          });
        });

        data.prices = list;
      }

      onAccept(data);
    });
  };

  handlePickupLocationChange = (value: any) => {
    this.props.form.setFieldsValue({ coordinate: value });
  };

  onSearchUser = (value: Object) => {
    if (this.state.searchingUser) {
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

        this.setState({ searchingUser: false, users: resp.data, selectedUser: null });
      })
      .finally(() => {
        this.setState({ searchingUser: false });
      });
  };

  onSearchLaundryUser = (value: Object) => {
    if (this.state.searchingLaundryUser) {
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

        this.setState({
          searchingLaundryUser: false,
          laundryUsers: resp.data,
          selectedLaundryUser: null,
        });
      })
      .finally(() => {
        this.setState({ searchingLaundryUser: false });
      });
  };

  onSearchAdmin = (value: Object) => {
    if (this.state.searchingAdmin) {
      return;
    }

    api
      .searchUser({
        ...value,
        list_role: 'admin',
        limit: 20,
      })
      .then((resp) => {
        if (!resp.success) {
          throw resp.data;
        }

        this.setState({ searchingAdmin: false, admins: resp.data, selectedAdmin: null });
      })
      .finally(() => {
        this.setState({ searchingAdmin: false });
      });
  };

  onSelectUser = (value: any, object: any) => {
    const user = this.state.users?.records?.find((item) => item.id === value);
    if (user) {
      this.setState(
        {
          selectedUser: user,
        },
        () => {
          this.props.form.setFieldsValue({
            phone: user.phone,
            email: user.email,
            name: this.props.form.getFieldValue('name') || user.name,
            permissions: user.permissions || [],
          });
        },
      );
    }
  };

  onSelectLaundryUser = (value: any, object: any) => {
    const user = this.state.laundryUsers?.records?.find((item) => item.id === value);
    if (user) {
      this.setState(
        {
          selectedLaundryUser: user,
        },
        () => {
          this.props.form.setFieldsValue({
            'manager.phone': user.phone,
            'manager.email': user.email,
            'manager.name': this.props.form.getFieldValue('manager.name') || user.name,
            'manager.permissions': user.permissions || [],
          });
        },
      );
    }
  };

  onSelectAdminUser = (value: any, object: any) => {
    const user = this.state.admins?.records?.find((item) => item.id === value);
    if (user) {
      this.setState(
        {
          selectedAdmin: user,
        },
        () => {
          this.props.form.setFieldsValue({
            'relationship_manager.phone': user.phone,
            'relationship_manager.email': user.email,
            'relationship_manager.name':
              this.props.form.getFieldValue('relationship_manager.name') || user.name,
            'relationship_manager.permissions': user.permissions || [],
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

  renderPrices = () => {
    const { constant, form, item } = this.props;
    const { getFieldDecorator } = form;
    return constant?.clothes?.map((cloth) => {
      const { formatter, parser, minValue, step } = formatCurrencyInput(item?.currency || 'VND');
      const defaultPrice = item?.prices?.find((item) => item.cloth_category === cloth.alias)
        ?.unit_price;
      return (
        <FormItem label={cloth.title} hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator(`prices.${cloth.alias}`, {
            initialValue: defaultPrice,
            rules: [
              {
                required: true,
                message: `Please enter a valid ${cloth.title}`,
              },
            ],
          })(
            <InputNumber
              style={{ width: '100%' }}
              step={step}
              min={minValue}
              formatter={(value) => formatter(value)}
              parser={(value) => parser(value)}
            />,
          )}
        </FormItem>
      );
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

          <FormItem label="Phone" hasFeedback={true} {...formItemLayout}>
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
                dataSource={this.state?.users?.records?.map(this.renderOption)}
                onSelect={this.onSelectUser}
                onSearch={(phone) => this.onSearchUser({ phone })}
                optionLabelProp="text"
              >
                <Input.Search placeholder="+84xxxxxxxxx" loading={this.state?.searchingUser} />
              </AutoComplete>,
            )}
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
                  required: true,
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

          <FormItem label="Manager's name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('manager.name', {
              initialValue: item?.manager?.name,
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid name',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Manager's Phone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('manager.phone', {
              initialValue: item?.manager?.phone,
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
                dataSource={this.state?.laundryUsers?.records?.map(this.renderOption)}
                onSelect={this.onSelectLaundryUser}
                onSearch={(phone) => this.onSearchLaundryUser({ phone })}
                optionLabelProp="text"
              >
                <Input.Search
                  placeholder="+84xxxxxxxxx"
                  loading={this.state?.searchingLaundryUser}
                />
              </AutoComplete>,
            )}
          </FormItem>

          <FormItem label="Relation Manager's name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('relationship_manager.name', {
              initialValue: item?.relationship_manager?.name,
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid name',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label="Relation Manager's Phone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('relationship_manager.phone', {
              initialValue: item?.relationship_manager?.phone,
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
                dataSource={this.state?.admins?.records?.map(this.renderOption)}
                onSelect={this.onSelectAdminUser}
                onSearch={(phone) => this.onSearchAdmin({ phone })}
                optionLabelProp="text"
              >
                <Input.Search placeholder="+84xxxxxxxxx" loading={this.state?.searchingAdmin} />
              </AutoComplete>,
            )}
          </FormItem>

          {/* <Form.Item label="Stop Ordering (Laundry)" {...formItemLayout}>
            {getFieldDecorator('is_admin_stop_ordering', {
              initialValue: item?.is_admin_stop_ordering || false,
              rules: [{ required: false }],
            })(<Switch defaultChecked={item?.is_admin_stop_ordering} />)}
          </Form.Item>

          <Form.Item label="Stop Ordering (Admin)" {...formItemLayout}>
            {getFieldDecorator('is_laundry_stop_ordering', {
              initialValue: item?.is_laundry_stop_ordering || false,
              rules: [{ required: false }],
            })(<Switch defaultChecked={item?.is_admin_stop_ordering} />)}
          </Form.Item> */}

          {this.renderPrices()}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(UserModal);
