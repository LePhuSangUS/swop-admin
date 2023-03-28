import React from 'react';
import { Form, Input, Modal, DatePicker } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, ISwop } from 'types';
import DateTimeSelect from 'components/DateTimeSelect';
import moment from 'moment';

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  item: ISwop;
  onAccept: (data: any) => void;
}

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModelState {}

class ModalUpdateOrder extends React.PureComponent<IModalProps, IModelState> {
  state = {
    from: this.props?.item?.scheduled_from_time,
    to: this.props?.item?.scheduled_to_time,
  };
  handleOk = () => {
    const { onAccept, item, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const { from, to } = this.state;
      const data: any = {
        ...getFieldsValue(),
        id: item.id,
        from_time: from,
        to_time: to,
        delivery_date: from,
        from_time_slot: moment.unix(from).format('ha'),
        to_time_slot: moment.unix(to).format('ha'),
      };

      onAccept(data);
    });
  };

  render() {
    const { onOk, item, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Update Swop"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <Form.Item label="Delivery Date" {...formItemLayout}>
          {getFieldDecorator('delivey_date', {
            initialValue: item?.scheduled_from_time
              ? moment.unix(item?.scheduled_from_time)
              : moment().add(1, 'days'),
            rules: [{ required: false }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              format={'MMM DD, YYYY'}
              disabledDate={(d) => !d || d.isSameOrBefore(moment())}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <DateTimeSelect
            title="Delivery Date - Time Slot"
            from={item?.scheduled_from_time}
            to={item?.scheduled_to_time}
            onSelected={(from, to) => this.setState({ from, to })}
          />
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdateOrder);
