import React from 'react';
import { Form, Modal, InputNumber, Input, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IConstants } from 'types';
import api from 'services/api';
const FormItem = Form.Item;

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  constants: IConstants;
  onFilter: (data: any) => void;
  filter: any;
}

interface IModelState {}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
class ModalFilterDresses extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onFilter, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      onFilter(data);
    });
  };

  handleSearchLook = (keyword: string) => {
    api.getLook({
      limit: 1,
    });
  };
  render() {
    const { onOk, constants, form, filter, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Ftiler Dresses"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem label="Look" {...formItemLayout}>
          {getFieldDecorator('look_id', {
            initialValue: filter?.look_id,
          })(<Input style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem label="Max distance" {...formItemLayout}>
          {getFieldDecorator('user_setting_distance', {
            initialValue: filter?.user_setting_distance,
          })(<InputNumber style={{ width: '100%' }} min={-1} step={0.01} max={15} />)}
        </FormItem>

        <FormItem label="Dress Size" {...formItemLayout}>
          {getFieldDecorator('user_dress_size', { initialValue: filter?.user_dress_size })(
            <Select style={{ width: '100%' }}>
              {constants?.dress_sizes?.sizes?.map((item) => (
                <Select.Option key={item.alias}>{item.title}</Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalFilterDresses);
