import React, { PureComponent } from 'react';
import { Button, Row, Col, Form, Divider, Icon, Card } from 'antd';
import { Page } from 'components';
import { connect } from 'dva';
import { IBlogSection, IConnectState, IFormProps } from 'types';
import { uploadS3Image } from 'services/s3';
import api from 'services/api';
import BlogForm from '../create/components/BlogForm';

interface IProps extends IConnectState, IFormProps {}

interface IState {
  sections: IBlogSection[];
}
class Blogs extends PureComponent<IProps> {
  didUpdate = false;
  state: IState = {
    sections: this.props?.blogDetails?.blog?.sections,
  };

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    if (nextProps.blogDetails?.blog?.sections !== this.state.sections && !this.didUpdate) {
      this.didUpdate = true;
      this.setState({ sections: nextProps.blogDetails?.blog?.sections });
    }
  }

  onUpdateBlog = () => {
    const { form, blogDetails, dispatch } = this.props;
    const { validateFieldsAndScroll, getFieldsValue } = form;

    validateFieldsAndScroll(async (errors: any) => {
      if (errors) {
        return;
      }
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
          data.sections
            .filter(
              (section: IBlogSection) =>
                this.state.sections.findIndex((item) => item.id === section.id) !== -1,
            )
            .map(async (item: IBlogSection, index: number) => {
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

      dispatch({
        type: 'blogDetails/updateBlog',
        payload: { ...blogDetails?.blog, ...data, sections: data.sections || [] },
      });
    });
  };

  onChangeStatus = () => {
    const { dispatch, blogDetails } = this.props;

    const type =
      blogDetails?.blog?.status === 'draft' ? 'blogDetails/publishBlog' : 'blogDetails/draftBlog';
    dispatch({
      type: type,
      payload: {
        id: blogDetails?.blog?.id,
      },
    });
  };

  render() {
    const { loading, blogDetails } = this.props;
    const { sections } = this.state;
    const spinning =
      loading.effects['blogDetails/getBlog'] ||
      loading.effects['blogDetails/updateBlog'] ||
      loading.effects['blogDetails/publishBlog'] ||
      loading.effects['blogDetails/draftBlog'];

    return (
      <Page loading={loading.effects['blogDetails/getBlog']} inner={true}>
        <Row gutter={[24, 24]} type="flex" justify="end">
          <Col>
            <Button disabled={spinning} loading={spinning} onClick={this.onChangeStatus}>
              {blogDetails?.blog?.status === 'draft' ? 'Publish' : 'Save Draft'}
            </Button>
          </Col>
          <Col>
            <Button disabled={spinning} loading={spinning} onClick={this.onUpdateBlog}>
              Update Blog
            </Button>
          </Col>
        </Row>
        <br />

        <Form>
          <BlogForm {...this.props} blog={blogDetails?.blog} useCrop={false} aspectRatio={4 / 6} />

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
          <br />

          {sections?.map((item, index) => {
            return (
              <>
                <Card
                  title={`Blog section: #${index + 1}`}
                  extra={
                    <Button
                      onClick={() => {
                        const list = sections?.filter((section) => section.id !== item.id);
                        this.setState({
                          sections: list,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  }
                >
                  <BlogForm
                    {...this.props}
                    isSection
                    blog={item}
                    namePrefix={`sections[${index}].`}
                    useCrop={false}
                    isPhotoRequired={false}
                    aspectRatio={4 / 6}
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

export default connect(({ blogDetails, loading }: IConnectState) => ({
  blogDetails,
  loading,
}))(Form.create<IProps>()(Blogs));
