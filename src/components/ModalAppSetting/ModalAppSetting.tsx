import React from 'react';
import { Form, Input, Modal,Switch } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IConnectProps, IAppSetting } from 'types';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 8,
  },
};

interface IModalProps extends IFormProps, ModalProps, IConnectProps {
  appSetting: IAppSetting;
  onUpdate: (data: any) => void;
}

interface IModelState {}
class ModalAppSetting extends React.PureComponent<IModalProps, IModelState> {
  handleOk = () => {
    const { onUpdate, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      onUpdate(data);
    });
  };

  render() {
    const { onOk, appSetting, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="Update App Setting"
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        onOk={this.handleOk}
        {...modalProps}
      >
        <FormItem hasFeedback={true}>
          {getFieldDecorator('pin', {
            rules: [{ required: true, message: 'PIN is required' }],
          })(<Input autoComplete="no" type="password" placeholder="PIN" />)}
        </FormItem>
       <FormItem labelAlign="left" label="Hide Coming Soon Cities" hasFeedback={false} {...formItemLayout}>
          {getFieldDecorator('is_hide_coming_soon_cities', {
            initialValue: appSetting?.is_hide_coming_soon_cities || false,
          })(<Switch defaultChecked={appSetting?.is_hide_coming_soon_cities || false}/>)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAppSetting);
