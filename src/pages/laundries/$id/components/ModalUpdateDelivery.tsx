import React from 'react';
import { Form, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IDelivery, IFormProps, IUser } from 'types';
import DateTimeSelect from 'components/DateTimeSelect';
import LaundrySearch from 'components/LaundrySearch';

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  item: IDelivery;
  onAccept: (item: IUser) => void;
}

class ModalUpdateDelivery extends React.PureComponent<IModalProps> {
  state = {
    from: this.props.item?.scheduled_from_time,
    to: this.props.item?.scheduled_to_time,
    return_laundry: this.props.item?.return_laundry,
    return_laundry_id: this.props.item?.return_laundry_id,
    laundry: this.props.item?.laundry,
    laundry_id: this.props.item?.laundry_id,
  };
  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const {
      from: scheduled_from_time,
      to: scheduled_to_time,
      laundry_id,
      return_laundry_id,
    } = this.state;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        scheduled_from_time,
        scheduled_to_time,
        laundry_id: typeof laundry_id === 'string' && laundry_id !== '' ? laundry_id : null,
        return_laundry_id:
          typeof return_laundry_id === 'string' && return_laundry_id !== ''
            ? return_laundry_id
            : null,
        status: item.status,
        id: item?.id,
      };

      onAccept(data);
    });
  };

  render() {
    const { item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <Form.Item label="Laundry" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('laundry_id', {
              initialValue: item?.laundry,
            })(
              <LaundrySearch
                initialValue={item?.laundry}
                onItemSelect={(item) => {
                  this.setState({
                    laundry: item,
                    laundry_id: item?.id,
                  });
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="Return Laundry" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('return_laundry_id', {
              initialValue: item?.return_laundry,
            })(
              <LaundrySearch
                initialValue={item?.return_laundry}
                onItemSelect={(item) => {
                  this.setState({
                    return_laundry: item,
                    return_laundry_id: item?.id,
                  });
                }}
              />,
            )}
          </Form.Item>

          <Form.Item>
            <DateTimeSelect
              title="Time Slot"
              from={item?.scheduled_from_time}
              to={item?.scheduled_to_time}
              onSelected={(from, to) => this.setState({ from, to })}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdateDelivery);
