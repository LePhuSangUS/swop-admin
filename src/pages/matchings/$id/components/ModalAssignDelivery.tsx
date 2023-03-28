import React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IAssignDeliveryForm, IFormProps, ISwop, IUser } from 'types';
import { formatCurrencyInput } from 'utils/money';
import { getSwopForDelivery } from 'utils/mapping';
import { Ellipsis } from 'ant-design-pro';
import { Location } from 'components';
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
  otherItem: ISwop;
  user: IUser;
  otherUser: IUser;
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

      const newItem = getSwopForDelivery(item);

      const data: any = {
        ...getFieldsValue(),
        swop_id: newItem?.id,
        other_swop_id: newItem?.other_swop_id,
        currency: newItem?.currency,
        type: newItem?.delivery_type,
      };

      onAccept(data);
    });
  };

  render() {
    const { item, otherItem, user, otherUser, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    const isAssignForSwoper = item?.status === 'pick_up_scheduled';
    const needAssignDeliveryCharges =
      item?.status === 'pick_up_scheduled' ||
      item?.status === 'delivery_scheduled' ||
      item?.status === 'return_pick_up_scheduled' ||
      item?.status === 'return_delivery_scheduled';
    const needAssignCleaningCharges = false;
    const { formatter, parser, minValue, step } = formatCurrencyInput(
      (isAssignForSwoper ? item?.currency : otherItem?.currency) || 'VND',
    );

    const newItem = getSwopForDelivery(item);

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Status" hasFeedback={false} {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: newItem?.status,
            })(<Input disabled style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Laundry Name" hasFeedback={false} {...formItemLayout}>
            {getFieldDecorator('laundry_id', {
              initialValue: newItem?.laundry?.name,
            })(
              <Ellipsis lines={1} tooltip>
                <Link to={`/laundries/${newItem?.laundry?.id}`}>{newItem?.laundry?.name}</Link>
              </Ellipsis>,
            )}
          </FormItem>
          <FormItem label="Laundry Address" hasFeedback={false} {...formItemLayout}>
            <Location
              location={{
                address: newItem?.laundry?.coordinate?.formatted_address,
                google_place_id: newItem?.laundry?.coordinate?.google_place_id,
                lat: newItem?.laundry?.coordinate?.lat,
                lng: newItem?.laundry?.coordinate?.lng,
              }}
            />
          </FormItem>

          <FormItem
            label={`Overdue (${isAssignForSwoper ? 'Sw.OD' : 'CSW.OD'})`}
            hasFeedback={true}
            {...formItemLayout}
          >
            {getFieldDecorator('overdue_balance', {
              initialValue: newItem?.user?.overdue_balance,
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
              initialValue: newItem?.cleaning_fee_deduct,
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

          <FormItem
            label={`Deduct (${isAssignForSwoper ? 'Sw.od' : 'CSW.od'})`}
            hasFeedback={true}
            {...formItemLayout}
          >
            {getFieldDecorator(
              'deduct',
              {},
            )(
              <InputNumber
                style={{ width: '100%' }}
                step={step}
                formatter={formatter}
                parser={parser}
              />,
            )}
          </FormItem>
          {needAssignDeliveryCharges && (
            <FormItem
              label={`Delivery Fee (${isAssignForSwoper ? 'Sw.dc' : 'CSW.dc'})`}
              hasFeedback={true}
              {...formItemLayout}
            >
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
          )}

          {needAssignCleaningCharges && (
            <FormItem
              label={`Cleaning Fee (${isAssignForSwoper ? 'Sw.dc' : 'CSW.dc'})`}
              hasFeedback={true}
              {...formItemLayout}
            >
              {getFieldDecorator('cleaning_fee', {
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
                  formatter={formatter}
                  parser={parser}
                />,
              )}
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAssignDelivery);
