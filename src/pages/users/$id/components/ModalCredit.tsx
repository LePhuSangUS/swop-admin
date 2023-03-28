import React from 'react';
import { Form, Modal, Select, DatePicker, InputNumber } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IUser, IUserCredit, IConstants } from 'types';
import moment from 'moment-timezone';

const FormItem = Form.Item;
interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  constants: IConstants;
  user: IUser;
  item: IUserCredit;
  onAccept: (data: any) => void;
}

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

interface IModelState {}
class ModalCredit extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onAccept, form, item } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      data['expired_at'] = data.expired_at?.unix();
      if (item) {
        data['id'] = item.id;
      }

      onAccept(data);
    });
  };

  render() {
    const { onOk, constants, item, user, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    const defaultValue = moment().add('months', 1);

    return (
      <Modal
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem labelAlign="left" label="Type" hasFeedback={false} {...formItemLayout}>
          {getFieldDecorator('source', {
            initialValue: 'admin_added',
            rules: [{ required: true, message: 'Type is required' }],
          })(
            <Select style={{ width: '100%' }}>
              {constants?.credit_sources?.map((item) => (
                <Select.Option key={item.alias} value={item.alias}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem labelAlign="left" label="Expired At" hasFeedback={false} {...formItemLayout}>
          {getFieldDecorator('expired_at', {
            initialValue: item?.expired_at ? moment.unix(item?.expired_at) : defaultValue,
            rules: [{ required: true, message: 'Expired time is required' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              format={'MMM DD, YYYY'}
              disabledDate={(d) =>
                !d || d.isSameOrBefore(moment().add(1, 'months').subtract(1, 'days'))
              }
            />,
          )}
        </FormItem>

        {!item && (
          <FormItem
            labelAlign="left"
            label="Number of tokens"
            hasFeedback={false}
            {...formItemLayout}
          >
            {getFieldDecorator('number_of_tokens', {
              initialValue: 1,
              rules: [{ required: true, message: 'Number of tokens is required' }],
            })(<InputNumber style={{ width: '100%' }} min={1} step={1} />)}
          </FormItem>
        )}
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalCredit);
