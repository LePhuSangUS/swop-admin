import React from 'react';
import { Form, Input, Modal, Switch, Select, Row, Button } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, IDress, IFile, IFormProps } from 'types';
import { getDressCategory } from 'utils';
import { ImageUploadMultiple } from 'components';
import styles from './ModalUpdateDress.less';
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
  item: IDress;
  constants: IConstants;
  onAccept: (item: IDress) => void;
}

class DressModal extends React.PureComponent<IModalProps> {
  handleOk = () => {
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        id: item?.id,
        user_id: item.user_id,
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
            const value = data[key];
            if (typeof value === 'string' && value !== '') {
              data[key] = [value];
            }
        }
      });

      onAccept(data);
    });
  };

  onImageAdded = (files: IFile[]) => {
    const { form } = this.props;
    form.setFieldsValue({ fileList: files });
  };

  onImageRemoved = (file: IFile) => {
    const { form } = this.props;
    const defaultList = form?.getFieldValue('fileList');
    const list = defaultList?.filter((item: any) => {
      if (typeof item === 'string' && item !== '') {
        return item !== file.url;
      }
      return item.uid !== file.uid;
    });
    form.setFieldsValue({ fileList: list });
  };

  renderImageUploaded = (files: IFile[], onDelete: (item: IFile) => void) => {
    return (
      <Row type="flex">
        <br />
        {files.map((file) => (
          <div key={file?.uid} className={styles.previewWrap}>
            <div style={{ position: 'relative' }}>
              <img height={96} src={file.url || file.preview} alt={file.name} />
              <Button
                onClick={() => onDelete(file)}
                shape="circle"
                type="dashed"
                size={'small'}
                icon="delete"
                style={{ position: 'absolute', top: -12, right: -12 }}
              />
            </div>
          </div>
        ))}
      </Row>
    );
  };
  render() {
    const { item, constants, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const dressCategory = getDressCategory(constants, getFieldValue('category') || item?.category);
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem>
            {getFieldDecorator('fileList', {
              initialValue: item?.photos,
              rules: [
                {
                  required: true,
                  message: 'Please upload 1 image at least',
                },
              ],
            })(
              <ImageUploadMultiple
                defaultListImageURL={item?.photos}
                showUploadList={false}
                onImageAdded={this.onImageAdded}
                onImageRemoved={this.onImageRemoved}
                renderItemUploaded={this.renderImageUploaded}
              />,
            )}
          </FormItem>
          <br />
          <FormItem labelAlign="left" label="Title" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: item?.title,
              rules: [
                {
                  required: true,
                  message: 'Please enter a valid title',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem labelAlign="left" label="Category" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: item?.category,
              rules: [
                {
                  required: true,
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
              initialValue: item?.type,
              rules: [
                {
                  required: true,
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
                initialValue: item?.necklines,
              })(
                <Select>
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
                initialValue: item?.sleeves,
              })(
                <Select maxTagCount={1}>
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
                initialValue: item?.fits,
              })(
                <Select>
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
                initialValue: item?.fabrics,
              })(
                <Select>
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
                initialValue: item?.patterns,
              })(
                <Select>
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
                initialValue: item?.styles,
              })(
                <Select>
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
                initialValue: item?.colors,
              })(
                <Select mode="multiple">
                  {dressCategory?.colors?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          )}

          <Form.Item labelAlign="left" label="Note " {...formItemLayout}>
            {getFieldDecorator('note', {
              initialValue: item?.note || false,
              rules: [{ required: false }],
            })(<Input.TextArea rows={2} />)}
          </Form.Item>

          <Form.Item labelAlign="left" label="Is Delist" {...formItemLayout}>
            {getFieldDecorator('is_delist', {
              initialValue: item?.is_delist || false,
              rules: [{ required: false }],
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(DressModal);
