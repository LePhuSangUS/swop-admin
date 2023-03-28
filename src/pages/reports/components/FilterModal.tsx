import React from 'react';
import { Form, Input, Modal, Switch, Select, Row, Button } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IDress, IFile, IFormProps } from 'types';
import { getDressCategory } from 'utils';
import styles from './Modal.less';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  filter: Partial<IDress>;
  constants: IConstants;
  onAccept: (item: IDress) => void;
  onClearFilter: () => void;
}

class FilterModal extends React.PureComponent<IModalProps> {
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

      onAccept(data);
    });
  };

  handleClear = () => {
    const { form, onClearFilter } = this.props;
    form?.resetFields();
    onClearFilter && onClearFilter();
  };
  render() {
    const { filter, constants, onClearFilter, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const dressCategory = getDressCategory(
      constants,
      getFieldValue('category') || filter?.category,
    );
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
        <Form layout="horizontal">
          <FormItem labelAlign="left" label="Category" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: filter?.category,
              rules: [
                {
                  required: false,
                  message: 'Please select a valid category',
                },
              ],
            })(
              <Select>
                {constants?.dress_categories?.map((item) => (
                  <Select.Option value={item.alias}>{item.title}</Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem labelAlign="left" label="Type" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: filter?.type,
              rules: [
                {
                  required: false,
                  message: 'Please select a valid type',
                },
              ],
            })(
              <Select>
                {dressCategory?.types?.map((item) => (
                  <Select.Option value={item.alias}>{item.title}</Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>

          {dressCategory?.necklines?.length > 0 && (
            <FormItem labelAlign="left" label="Necklines" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('necklines', {
                initialValue: filter?.necklines,
              })(
                <Select mode="multiple">
                  {dressCategory?.necklines?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          {dressCategory?.sleeves?.length > 0 && (
            <FormItem labelAlign="left" label="Sleeves" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('sleeves', {
                initialValue: filter?.sleeves,
              })(
                <Select mode="multiple">
                  {dressCategory?.sleeves?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}
          {dressCategory?.fits?.length && (
            <FormItem labelAlign="left" label="Fits" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('fits', {
                initialValue: filter?.fits,
              })(
                <Select mode="multiple">
                  {dressCategory?.fits?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          {dressCategory?.fabrics?.length && (
            <FormItem labelAlign="left" label="Fabrics" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('fabrics', {
                initialValue: filter?.fabrics,
              })(
                <Select mode="multiple">
                  {dressCategory?.fabrics?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          {dressCategory?.patterns?.length && (
            <FormItem labelAlign="left" label="Patterns" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('patterns', {
                initialValue: filter?.patterns,
              })(
                <Select mode="multiple">
                  {dressCategory?.patterns?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          {dressCategory?.styles?.length && (
            <FormItem labelAlign="left" label="Styles" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('styles', {
                initialValue: filter?.styles,
              })(
                <Select mode="multiple">
                  {dressCategory?.styles?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          {dressCategory?.colors?.length && (
            <FormItem labelAlign="left" label="Colors" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('colors', {
                initialValue: filter?.colors,
              })(
                <Select mode="multiple">
                  {dressCategory?.colors?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          <Form.Item labelAlign="left" label="Is Delist" {...formItemLayout}>
            {getFieldDecorator('is_delist', {
              initialValue: filter?.is_delist || 'None',
              rules: [{ required: false }],
            })(
              <Select>
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
                <Select.Option value="None">None</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(FilterModal);
