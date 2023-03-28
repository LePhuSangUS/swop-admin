import React from 'react';
import { Form, InputNumber, Modal, Checkbox } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IUser } from 'types';

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
  taskName: string;
  onRequest: (taskName: string, timeElapsed: number) => void;
}

interface IModelState {}
class ModalTimeElapsed extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onRequest, taskName, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = getFieldsValue();

      onRequest(taskName, data.is_use_default ? 0 : data.time_elapsed);
    });
  };

  render() {
    const { onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        title="Request Access Token"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem>
          {getFieldDecorator('is_use_default', {
            initialValue: true,
          })(<Checkbox defaultChecked={true}>Use default setting</Checkbox>)}
        </FormItem>
        <FormItem label="Time Elapsed To Execute A Cron">
          {getFieldDecorator('time_elapsed', {
            initialValue: 10,
          })(
            <InputNumber
              disabled={getFieldValue('is_use_default')}
              style={{ width: '100%' }}
              formatter={(value) => `${value} seconds`}
              min={10}
              step={10}
              max={600}
            />,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalTimeElapsed);
