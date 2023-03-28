import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IMatching, IConstants } from 'types';
import { getMatchingStatusDisplay } from 'utils/mapping';

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
  item: IMatching;
  constants: IConstants;
  onAccept: (data: IMatching) => void;
}

interface IModelState {}
class ModalUpdateMatching extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onAccept, form, item } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = getFieldsValue();

      onAccept({
        id: item?.id,
        ...data,
      });
    });
  };

  render() {
    const { onOk, constants, item, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Update Matching"
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
              {constants?.matching_status.map((item) => (
                <Select.Option key={item}>{getMatchingStatusDisplay(item)}</Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem label="Reference Code" hasFeedback={true} {...formItemLayout}>
          {getFieldDecorator('reference_code', {
            initialValue: item?.reference_code,
          })(<Input max={4} style={{ textTransform: 'uppercase' }} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalUpdateMatching);
