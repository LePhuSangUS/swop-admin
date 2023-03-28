import React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IAssignDeliveryForm, IFormProps, ISwop } from 'types';
import { formatCurrencyInput } from 'utils/money';
import { Location } from 'components';
import { Ellipsis } from 'ant-design-pro';
import { Link } from 'react-router-dom';

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
  item: ISwop;
  onAccept: (item: IAssignDeliveryForm) => void;
}

interface IModelState {}
class ModalAssignDelivery extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        swop_id: item?.id,
        other_swop_id: item?.other_swop_id,
        currency: item?.currency,
        type: item?.delivery_type,
      };

      onAccept(data);
    });
  };

  render() {
    const { item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    const { formatter, parser, minValue, step } = formatCurrencyInput(item?.currency);
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Laundry Name" hasFeedback={false} {...formItemLayout}>
            {getFieldDecorator('laundry_id', {
              initialValue: item?.laundry.name,
            })(
              <Ellipsis lines={1} tooltip>
                <Link to={`/laundries/${item?.laundry?.id}`}>{item?.laundry?.name}</Link>
              </Ellipsis>,
            )}
          </FormItem>
          <FormItem label="Laundry Address" hasFeedback={false} {...formItemLayout}>
            <Location
              location={{
                address: item?.laundry?.coordinate?.formatted_address,
                google_place_id: item?.laundry?.coordinate?.google_place_id,
                lat: item?.laundry?.coordinate?.lat,
                lng: item?.laundry?.coordinate?.lng,
              }}
            />
          </FormItem>

          <FormItem label="Overdue" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('overdue_balance', {
              initialValue: item?.user?.overdue_balance,
            })(
              <InputNumber
                disabled
                style={{ width: '100%' }}
                step={step}
                formatter={(value) => formatter(value)}
                parser={(value) => parser(value)}
              />,
            )}
          </FormItem>

          <FormItem label="Cleaning Fee" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('cleaning_fee_deduct', {
              initialValue: item?.cleaning_fee_deduct,
            })(
              <InputNumber
                disabled
                style={{ width: '100%' }}
                step={step}
                formatter={(value) => formatter(value)}
                parser={(value) => parser(value)}
              />,
            )}
          </FormItem>

          <FormItem label="Delivery Fee" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('delivery_fee', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid price',
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={minValue}
                step={step}
                formatter={(value) => formatter(value)}
                parser={(value) => parser(value)}
              />,
            )}
          </FormItem>

          <FormItem label="Deduct" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('deduct', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid price',
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                step={step}
                formatter={formatter}
                parser={parser}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAssignDelivery);
