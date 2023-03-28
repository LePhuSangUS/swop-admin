import React from 'react';
import { Form, Select, Modal, Button, Spin } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IDress, IFormProps } from 'types';
import { getDressCategory } from 'utils';
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
  filter: any;
  constants: IConstants;
  onAccept: (item: IDress) => void;
  onClearFilter: () => void;
}

class ModalFilterLook extends React.PureComponent<IModalProps> {
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

      Object.keys(data).forEach((key) => {
        switch (key) {
          case 'patterns':
          case 'necklines':
          case 'sleeves':
          case 'styles':
          case 'fits':
          case 'colors':
          case 'fabrics':
          case 'lengths':
          case 'sizes':
            const value = data[key];
            if (Array.isArray(value) && value.length > 0) {
              // @ts-ignore
              data[key] = value.join(',');
            }
        }
      });

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
        <Spin spinning={this.state.loading}>
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
                    <Select.Option key={item.alias} value={item.alias}>
                      {item.title}
                    </Select.Option>
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
                    <Select.Option key={item.alias} value={item.alias}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem labelAlign="left" label="Sizes" hasFeedback={false} {...formItemLayout}>
              {getFieldDecorator('sizes', {
                initialValue:
                  typeof filter?.sizes === 'string' && filter?.sizes
                    ? filter?.sizes?.split(',')
                    : [],
              })(
                <Select mode="multiple">
                  {constants?.dress_sizes?.sizes?.map((item) => (
                    <Select.Option key={item.alias} value={item.alias}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            {dressCategory?.necklines?.length > 0 && (
              <FormItem labelAlign="left" label="Necklines" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('necklines', {
                  initialValue:
                    typeof filter?.necklines === 'string' && filter?.necklines
                      ? filter?.necklines?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.necklines?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}

            {dressCategory?.sleeves?.length > 0 && (
              <FormItem labelAlign="left" label="Sleeves" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('sleeves', {
                  initialValue:
                    typeof filter?.sleeves === 'string' && filter?.sleeves
                      ? filter?.sleeves?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.sleeves?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}
            {dressCategory?.fits?.length && (
              <FormItem labelAlign="left" label="Fits" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('fits', {
                  initialValue:
                    typeof filter?.fits === 'string' && filter?.fits
                      ? filter?.fits?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.fits?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}

            {dressCategory?.fabrics?.length && (
              <FormItem labelAlign="left" label="Fabrics" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('fabrics', {
                  initialValue:
                    typeof filter?.fabrics === 'string' && filter?.fabrics
                      ? filter?.fabrics?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.fabrics?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}

            {dressCategory?.patterns?.length && (
              <FormItem labelAlign="left" label="Patterns" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('patterns', {
                  initialValue:
                    typeof filter?.patterns === 'string' && filter?.patterns
                      ? filter?.patterns?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.patterns?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}

            {dressCategory?.styles?.length && (
              <FormItem labelAlign="left" label="Styles" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('styles', {
                  initialValue:
                    typeof filter?.styles === 'string' && filter?.styles
                      ? filter?.styles?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.styles?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}

            {dressCategory?.colors?.length && (
              <FormItem labelAlign="left" label="Colors" hasFeedback={false} {...formItemLayout}>
                {getFieldDecorator('colors', {
                  initialValue:
                    typeof filter?.colors === 'string' && filter?.colors
                      ? filter?.colors?.split(',')
                      : [],
                })(
                  <Select mode="multiple">
                    {dressCategory?.colors?.map((item) => (
                      <Select.Option key={item.alias} value={item.alias}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalFilterLook);
