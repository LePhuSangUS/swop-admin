import React from 'react';
import { Form, Input, Modal, InputNumber, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, ILaundryPrice } from 'types';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  item: ILaundryPrice;
  onAccept: (data: ILaundryPrice) => void;
}

interface IModelState {}
class ModalLaundryPrice extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = getFieldsValue();
 
      onAccept(data);
    });
  };

  render() {
    const { onOk, item, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Update Laundry Price"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem label="Category" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('cloth_category', {
            initialValue: item?.cloth_category,
          })(<Input disabled />)}
        </FormItem>

        <FormItem label="Currency" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('currency', {
            initialValue: item?.currency || 'VND',
            rules: [
              {
                required: true,
                message: 'Please select a currency',
              },
            ],
          })(
            <Select style={{ width: '100%' }}>
              <Select.Option value="VND">VND</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="SGD">SGD</Select.Option>
              <Select.Option value="INR">INR</Select.Option>
            </Select>,
          )}
        </FormItem>

        <FormItem label="Unit Price" hasFeedback={false} {...formItemLayout}>
          {getFieldDecorator('unit_price', {
            initialValue: item?.unit_price,
          })(
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              defaultValue={3}
            />,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalLaundryPrice);
