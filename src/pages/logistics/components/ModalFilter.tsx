import React from 'react';
import { Form, Modal, Button, Spin, DatePicker, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IDress, IFormProps } from 'types';
import moment from 'moment';
import { getTimeSlots } from 'utils/date';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  filter: any;
  constants: IConstants;
  onAccept: (item: IDress) => void;
  onClearFilter: () => void;
}

interface IState {
  laundry_name: string;
  loading: boolean;
}

class FilterModal extends React.PureComponent<IModalProps, IState> {
  state: IState = {
    laundry_name: '',
    loading: false,
  };

  handleOk = () => {
    const { onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...this.state,
        ...getFieldsValue(),
      };

      if (typeof data.delivery_date_moment?.unix === 'function') {
        data.delivery_date = moment(data.delivery_date_moment).format('YYYY-MM-DD');

        const begningOfDay = moment(data.delivery_date_moment)?.startOf('day');
        if (begningOfDay) {
          const timeSlot = getTimeSlots().find((item) => item.key === data.time_slot_key);
          if (timeSlot) {
            data.delivery_date_from = begningOfDay.unix() + timeSlot.from;
            data.delivery_date_to = begningOfDay.unix() + timeSlot.to;
          }
        }
      }

      onAccept(data);
    });
  };

  handleClear = () => {
    const { form, onClearFilter } = this.props;
    this.setState({ loading: true });
    form?.resetFields();
    onClearFilter && onClearFilter();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  render() {
    const { filter, constants, onClearFilter, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        {...modalProps}
        onOk={this.handleOk}
        footer={[
          <Button onClick={this.props.onCancel} key="1">
            Cancel
          </Button>,
          <Button onClick={this.handleClear} key="2">
            Clear
          </Button>,
          <Button onClick={this.handleOk} key="3" type="primary">
            Ok
          </Button>,
        ]}
      >
        <Spin spinning={this.state.loading}>
          <Form layout="horizontal">
            <Form.Item
              required
              labelAlign="left"
              label="Delivery Date"
              hasFeedback={true}
              {...formItemLayout}
            >
              {getFieldDecorator('delivery_date_moment', {
                initialValue: filter?.delivery_date_moment,
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  defaultValue={moment(moment().add(1, 'days'), "MMM DD' YY")}
                />,
              )}
            </Form.Item>

            <Form.Item
              required={form.getFieldValue('delivery_date_moment')?.unix() > 0}
              labelAlign="left"
              label="Time Slot"
              hasFeedback={true}
              {...formItemLayout}
            >
              {getFieldDecorator('time_slot_key', {
                initialValue: filter?.time_slot_key,
                rules: [
                  {
                    required: form.getFieldValue('delivery_date_moment')?.unix() > 0,
                    message: 'Please select a valid time slot',
                  },
                ],
              })(
                <Select>
                  {getTimeSlots().map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(FilterModal);
