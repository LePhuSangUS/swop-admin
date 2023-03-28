import React from 'react';
import { Form, Select, Modal, Button, Spin } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IFormProps, IMatching } from 'types';
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

interface IModalProps extends IFormProps, ModalProps {
  filter?: any;
  item: IMatching;
  constants: IConstants;
  onClearFilter: () => void;
  onAccept: (item: any) => void;
}

interface IModelState {}
class ModalFilter extends React.PureComponent<IModalProps, IModelState> {
  state = {
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
        ...getFieldsValue(),
      };

      if (Array.isArray(data.city)) {
        data['city'] = data.city?.join(',');
      }

      if (Array.isArray(data.status)) {
        data['status'] = data.status?.join(',');
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
    const { onOk, form, filter, constants, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        {...modalProps}
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
            <FormItem label="Location City" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('city', {
                initialValue: filter?.city !== '' ? filter?.city?.split(',') : [],
              })(
                <Select showSearch optionFilterProp="children" mode="multiple">
                  {constants?.location_cities?.map((item) => (
                    <Select.Option key={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="Matching Status" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: filter?.status !== '' ? filter?.status?.split(',') : [],
              })(
                <Select showSearch optionFilterProp="children" mode="multiple">
                  {constants?.matching_status?.map((item) => (
                    <Select.Option key={item}>{getMatchingStatusDisplay(item)}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalFilter);
