import React from 'react';
import { Form, Select, Modal, Checkbox, Input } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, ISwopTracking, IConstants } from 'types';

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
  item: ISwopTracking;
  constants: IConstants;
  onAccept: (data: ISwopTracking) => void;
}

interface IModelState {}
class ModalUpdateSwopTracking extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onAccept, form, item } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = getFieldsValue();
      if (item) {
        data['id'] = item.id;
      }
      onAccept(data);
    });
  };

  render() {
    const { onOk, item, form, constants, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem label="Status" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item?.status,
          })(
            <Select style={{ width: '100%' }}>
              {constants?.swop_status
                ?.filter((status) => status !== item?.status)
                ?.map((st) => (
                  <Select.Option key={st}>{st}</Select.Option>
                ))}
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdateSwopTracking);
