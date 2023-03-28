import React from 'react';
import { Editor } from 'components';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { EditorState as EditorStateProps } from 'react-draft-wysiwyg';
import { uploadS3Image } from 'services/s3';
import draftToHtml from 'draftjs-to-html';
import api from 'services/api';

interface IState {
  editorState: EditorStateProps;
}
interface IProps {
  content?: string;
  editorStyle?: React.CSSProperties;
  onChange?: (content: string, editorState: EditorStateProps) => void;
}

const getEditorState = (content?: string) => {
  const blocksFromHTML = convertFromHTML(content ?? '<p></p>');
  const editorState = blocksFromHTML?.contentBlocks
    ? EditorState.createWithContent(
        ContentState.createFromBlockArray(blocksFromHTML?.contentBlocks, blocksFromHTML?.entityMap),
      )
    : EditorState.createEmpty();

  return editorState;
};

class BlogEditor extends React.Component<IProps, IState> {
  didUpdate = false;
  state = {
    editorState: getEditorState(this?.props?.content),
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      editorState: getEditorState(this?.props?.content),
    };
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    const raw = convertToRaw(this.state?.editorState.getCurrentContent());

    const content = draftToHtml(raw);
    if (nextProps.content && nextProps.content !== content && !this.didUpdate) {
      this.didUpdate = true;
      this.setState({ editorState: getEditorState(nextProps.content) });
    }
  }
  parseContent = () => {
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    if (raw.blocks?.length === 1 && raw.blocks[0].text?.trim() === '') {
      return '';
    }
    const content = draftToHtml(raw);

    return content;
  };

  onEditorStateChange = (editorState: EditorStateProps) => {
    const { onChange } = this.props;
    this.setState(
      {
        editorState,
      },
      () => {
        const content = this.parseContent();
        onChange?.(content, editorState);
      },
    );
  };

  onUploadFile = (file: any) => {
    return new Promise<object>(async (resolve, reject) => {
      try {
        const { data, success } = await api.getS3Signature({
          content_type: file.type,
          prefix: `blogs`,
        });

        if (success) {
          const formData = new FormData();

          const { url, key, ...other } = data;
          Object.keys(other).forEach((k) => formData.append(k, other[k]));
          formData.append('key', key);
          formData.append('file', file);

          const resp: any = await uploadS3Image(url, formData);
          if (resp.success) {
            resolve({ data: { link: `${url}/${key}` } });
          } else {
            reject('An error occured');
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  render() {
    const { editorState } = this.state;
    const { editorStyle } = this.props;
    return (
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        uploadCallback={this.onUploadFile}
        editorStyle={editorStyle}
        spellCheck
      />
    );
  }
}

export default BlogEditor;
