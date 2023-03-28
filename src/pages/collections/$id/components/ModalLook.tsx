import React from 'react';
import { Form, Modal, Row, Input, Checkbox } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IConstants, ICollection, IFormProps, ILook } from 'types';
import ImageUploadCrop from 'components/ImageUpdateCrop';

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  item: ILook;
  collection: ICollection;
  constants: IConstants;
  onAccept: (item: ICollection) => void;
}

class ModalLook extends React.PureComponent<IModalProps> {
  handleOk = () => {
    const { item, onAccept, collection, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }

      const data: any = {
        ...getFieldsValue(),
        id: item?.id,
        collection_id: collection?.id,
        collection_name: collection?.name,
      };

      if (data['is_upload_from_file']) {
        delete data['photo'];
      }

      onAccept(data);
    });
  };

  render() {
    const { item, constants, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const uploadFromFile = getFieldValue('is_upload_from_file');
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form.Item
          labelAlign="left"
          label="Upload From File"
          hasFeedback={false}
          {...formItemLayout}
        >
          {getFieldDecorator('is_upload_from_file', {
            initialValue: getFieldValue('imageFile'),
          })(<Checkbox />)}
        </Form.Item>
        <Form layout="horizontal">
          {uploadFromFile ? (
            <Form.Item>
              {getFieldDecorator('imageFile', {
                initialValue: item?.photo,
                rules: [
                  {
                    required: !getFieldValue('photo'),
                    message: 'Please upload an image',
                  },
                ],
              })(
                <Row type="flex" justify="center">
                  <div>
                    <ImageUploadCrop
                      defaultImageURL={item?.photo}
                      onImageLoaded={(file) => form.setFieldsValue({ imageFile: file })}
                    />
                  </div>
                </Row>,
              )}
            </Form.Item>
          ) : (
            <Form.Item labelAlign="left" label="Image URL" hasFeedback={true} {...formItemLayout}>
              {getFieldDecorator('photo', {
                initialValue: item?.photo,
                rules: [
                  {
                    required: !getFieldValue('imageFile'),
                    pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                    message: 'Must be a valid URL',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          )}

          <Form.Item labelAlign="left" label="Instagram URL" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('instagram_url', {
              initialValue: item?.instagram_url,
              rules: [
                {
                  required: false,
                  pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                  message: 'Must be a valid URL',
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(ModalLook);
