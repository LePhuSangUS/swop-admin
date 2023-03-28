import React, { PureComponent } from 'react';
import { Button, Row, Col, Form, Divider, Icon, Card } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IBlogSection, IConnectState, IFormProps } from 'types';
import api from 'services/api';
import { uploadS3Image } from 'services/s3';
import { router } from 'umi';
import BlogForm from './components/BlogForm';
import './index.less';

interface IState {
  creating: boolean;
  sections: IBlogSection[];
}
interface IProps extends IConnectState, IFormProps {}
class Blogs extends PureComponent<IProps, IState> {
  state: IState = {
    creating: false,
    sections: [],
  };

  onCreateBlog = async () => {
    const { form } = this.props;
    const { getFieldsValue, validateFieldsAndScroll } = form;

    validateFieldsAndScroll(async (errors: any) => {
      if (errors) {
        return;
      }

      this.setState({ creating: true });
      const data: any = getFieldsValue();

      if (data['cover_photo_file']) {
        const file = data['cover_photo_file'];
        if (!file || typeof file === 'string') {
        } else {
          const { data: s3Data, success: ok } = await api.getS3Signature({
            content_type: file.type,
            prefix: `blogs`,
          });

          if (ok) {
            const formData = new FormData();

            const { url, key, ...other } = s3Data;
            Object.keys(other).forEach((k) => formData.append(k, other[k]));
            formData.append('key', key);
            formData.append('file', file);

            const resp: any = await uploadS3Image(url, formData);
            if (resp.success) {
              data['cover_photo_url'] = `${url}/${key}`;
            }
          }

          delete data['cover_photo_file'];
        }
      }

      if (Array.isArray(data.sections)) {
        await Promise.all(
          data.sections.map(async (item: IBlogSection, index: number) => {
            const file = item['cover_photo_file'];
            if (!file || typeof file === 'string') {
              return;
            }

            const { data: s3Data, success: ok } = await api.getS3Signature({
              content_type: file.type,
              prefix: `blogs`,
            });

            if (ok) {
              const formData = new FormData();

              const { url, key, ...other } = s3Data;
              Object.keys(other).forEach((k) => formData.append(k, other[k]));
              formData.append('key', key);
              formData.append('file', file);

              const resp: any = await uploadS3Image(url, formData);
              if (resp.success) {
                data.sections[index]['cover_photo_url'] = `${url}/${key}`;
              }
            }

            delete data.sections[index]['cover_photo_file'];
          }),
        );
      }

      const { data: blogData, success } = await api.createBlog(data);
      if (success) {
        router.push(`/blogs/${blogData.id}`);
      } else {
        throw data;
      }
    });
  };

  render() {
    const { creating, sections } = this.state;
    return (
      <Page inner={true}>
        <Row type="flex" justify="end">
          <Col>
            <Button loading={creating} onClick={this.onCreateBlog}>
              Create Blog
            </Button>
          </Col>
        </Row>
        <Form>
          <BlogForm {...this.props} useCrop={false} aspectRatio={4 / 6} />
          <Divider />
          <div>
            Blog Sections:{' '}
            <Button
              onClick={() =>
                this.setState({
                  sections: [
                    {
                      title: '',
                      content: '',
                      cover_photo_url: '',
                      id: `${new Date().getSeconds()}`,
                      cover_photo_file: null,
                    },
                    ...(sections || []),
                  ],
                })
              }
              type="dashed"
            >
              <Icon type="plus" /> Add Section
            </Button>
          </div>

          {sections?.map((item, index) => {
            return (
              <>
                <Card
                  title={`Blog section: #${index + 1}`}
                  extra={
                    <Button
                      onClick={() => {
                        this.setState({
                          sections: sections?.filter((section) => section.id !== item.id),
                        });
                      }}
                    >
                      Remove
                    </Button>
                  }
                >
                  <BlogForm
                    {...this.props}
                    blog={item}
                    isSection
                    useCrop={false}
                    isPhotoRequired={false}
                    namePrefix={`sections[${index}].`}
                  />
                </Card>
                {index !== sections.length - 1 && <Divider />}
              </>
            );
          })}
        </Form>
      </Page>
    );
  }
}

export default connect(({ loading }: IConnectState) => ({
  loading,
}))(Form.create<IProps>()(Blogs));
