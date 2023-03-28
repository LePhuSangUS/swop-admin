import React from 'react';
import { Form } from 'antd';
import { IBlog, IBlogSection, IFormProps } from 'types';
import ImageUploadCrop from 'components/ImageUpdateCrop';
import BlogEditor from 'components/BlogEditor';
import { ImageUpload } from 'components';

interface IProps extends IFormProps {
  blog?: IBlog | IBlogSection;
  namePrefix?: string;
  useCrop?: boolean;
  aspectRatio?: number;
  isPhotoRequired?: boolean;
  isSection?: boolean;
}
class BlogForm extends React.Component<IProps> {
  render() {
    const {
      form,
      blog,
      aspectRatio = 4 / 6,
      namePrefix = '',
      useCrop = true,
      isPhotoRequired = true,
      isSection,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Form.Item label="Cover Photo">
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator(`${namePrefix}id`, {
              initialValue: blog?.id,
            })(<span />)}
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator(`${namePrefix}cover_photo_url`, {
              initialValue: blog?.cover_photo_url,
            })(<span />)}
          </Form.Item>

          {getFieldDecorator(`${namePrefix}cover_photo_file`, {
            initialValue: blog?.cover_photo_file,
            rules: [
              {
                required: !blog?.cover_photo_url && isPhotoRequired,
                message: 'Please upload a cover image',
              },
            ],
          })(
            useCrop ? (
              <ImageUploadCrop
                aspectRatio={aspectRatio}
                defaultImageURL={blog?.cover_photo_url}
                onImageLoaded={(file) =>
                  form.setFieldsValue({ [`${namePrefix}cover_photo_file`]: file })
                }
              />
            ) : (
              <ImageUpload
                defaultImageURL={blog?.cover_photo_url}
                onImageLoaded={(file) =>
                  form.setFieldsValue({ [`${namePrefix}cover_photo_file`]: file })
                }
              />
            ),
          )}
        </Form.Item>

        <Form.Item label="Title">
          {getFieldDecorator(`${namePrefix}title`, {
            initialValue: blog?.title,
            rules: [
              {
                required: true,
                message: 'Please input a title',
              },
            ],
          })(
            <BlogEditor
              editorStyle={{
                color: 'black',
                fontFamily: 'Playfair Display, serif',
                fontSize: isSection ? '32px' : '28px',
                lineHeight: isSection ? '40px' : '32px',
                letterSpacing: '0.003em',
              }}
              content={blog?.title}
              onChange={(content) => {
                form.setFieldsValue({ [`${namePrefix}title`]: content });
              }}
            />,
          )}
        </Form.Item>

        <Form.Item label="Content">
          {getFieldDecorator(`${namePrefix}content`, {
            initialValue: blog?.content,
            rules: [
              {
                required: false,
                message: 'Please input a content',
              },
            ],
          })(
            <BlogEditor
              content={blog?.content}
              editorStyle={{
                color: 'black',
                fontFamily: 'Playfair Display, serif',
                fontSize: isSection ? '16px' : '14px',
                lineHeight: isSection ? '32px' : '26px',
                letterSpacing: '0.002em',
              }}
              onChange={(content) => {
                form.setFieldsValue({ [`${namePrefix}content`]: content });
              }}
            />,
          )}
        </Form.Item>
      </>
    );
  }
}

export default BlogForm;
