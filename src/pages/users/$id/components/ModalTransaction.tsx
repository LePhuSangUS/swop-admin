import React from 'react';
import { Form, InputNumber, Modal, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IDress, IFile, IFormProps } from 'types';
import { formatCurrencyInput } from 'utils/money';

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
  constants: IConstants;
  onAccept: (item: IDress) => void;
}

class TransactionModal extends React.PureComponent<IModalProps> {
  handleOk = () => {
    const { onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      onAccept(data);
    });
  };

  onImageAdded = (files: IFile[]) => {
    const { form } = this.props;
    form.setFieldsValue({ fileList: files });
  };

  onImageRemoved = (file: IFile) => {
    const { form } = this.props;
    const defaultList = form?.getFieldValue('fileList');
    const list = defaultList?.filter((item: any) => {
      if (typeof item === 'string' && item !== '') {
        return item !== file.url;
      }
      return item.uid !== file.uid;
    });
    form.setFieldsValue({ fileList: list });
  };

  render() {
    const { constants, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    const { formatter, parser, minValue, step } = formatCurrencyInput('VND');
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem labelAlign="left" label="Type" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: 'cash_payout',
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid title',
                },
              ],
            })(
              <Select>
                <Select.Option value="cash_payout">Cash Payout</Select.Option>
              </Select>,
            )}
          </FormItem>

          <FormItem labelAlign="left" label="Amount" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid amount',
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={1000}
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

export default Form.create<IModalProps>()(TransactionModal);
