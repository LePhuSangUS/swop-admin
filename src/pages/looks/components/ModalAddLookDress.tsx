import React from 'react';
import { Form, Modal, Select, Row, Button } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, ILook, IFile, IFormProps, ICollection, ILookDress } from 'types';
import { getDressCategory } from 'utils';
import { ImageUploadMultiple } from 'components';
import styles from './ModalAddLookDress.less';

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
  look: ILook;
  constants: IConstants;
  onAccept: (item: ILookDress) => void;
}

class ModalAddLook extends React.PureComponent<IModalProps> {
  handleOk = () => {
    const { look, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }

      const data: any = {
        ...getFieldsValue(),
        look_id: look?.id,
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
          case 'tags':
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
    const { constants, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

    const dressCategory = getDressCategory(constants, getFieldValue('category'));
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <Form.Item labelAlign="left" label="Category" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('category', {
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
          </Form.Item>

          <Form.Item labelAlign="left" label="Type" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('type', {
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
          </Form.Item>

          {/* <Form.Item labelAlign="left" label="Size" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('size', {
              rules: [
                {
                  required: true,
                  message: 'Please select a valid size',
                },
              ],
            })(
              <Select>
                {constants?.dress_sizes?.sizes?.map((item) => (
                  <Select.Option value={item.alias}>{item.title}</Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item> */}

          {dressCategory?.necklines?.length > 0 && (
            <Form.Item labelAlign="left" label="Necklines" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'necklines',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.necklines?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          {dressCategory?.sleeves?.length > 0 && (
            <Form.Item labelAlign="left" label="Sleeves" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'sleeves',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.sleeves?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}
          {dressCategory?.fits?.length && (
            <Form.Item labelAlign="left" label="Fits" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'fits',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.fits?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          {dressCategory?.fabrics?.length && (
            <Form.Item labelAlign="left" label="Fabrics" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'fabrics',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.fabrics?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          {dressCategory?.patterns?.length && (
            <Form.Item labelAlign="left" label="Patterns" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'patterns',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.patterns?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          {dressCategory?.styles?.length && (
            <Form.Item labelAlign="left" label="Styles" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'styles',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.styles?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          {dressCategory?.colors?.length && (
            <Form.Item labelAlign="left" label="Colors" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator(
                'colors',
                {},
              )(
                <Select mode="multiple">
                  {dressCategory?.colors?.map((item) => (
                    <Select.Option value={item.alias}>{item.title}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalAddLook);
