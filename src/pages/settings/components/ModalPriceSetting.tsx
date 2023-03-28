import React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IPriceSetting, IFile, IFormProps } from 'types';
import { formatCurrencyInput } from 'utils/money';
import styles from './ModalPriceSetting.less';

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
  item: IPriceSetting;
  onAccept: (item: IPriceSetting) => void;
}

interface IModelState {
  fileList: IFile[];
  confirmDirty: boolean;
}
class UserModal extends React.PureComponent<IModalProps, IModelState> {
  state: IModelState = {
    fileList: [],
    confirmDirty: false,
  };

  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        country_code: item?.country_code,
      };

      onAccept(data);
    });
  };

  render() {
    const { item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { formatter, parser, minValue, step } = formatCurrencyInput(item?.currency);
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem labelAlign="left" label="Category" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('delivery_per_km', {
              initialValue: item?.delivery_per_km,
              rules: [
                {
                  required: true,
                  message: 'Please select a valid price',
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                step={step}
                formatter={(value) => formatter(value)}
                parser={(value) => parser(value)}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(UserModal);
