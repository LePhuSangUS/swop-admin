import React from 'react';
import { Tag, Input, Tooltip, Icon, Typography } from 'antd';
import { Color } from 'utils';

interface Props {
  tags: string[];
  style?: any;
  className?: any;
  onChange: (tags: string[]) => void;
}

class EditableTagGroup extends React.Component<Props> {
  state = {
    tags: this.props.tags || [],
    inputVisible: false,
    inputValue: '',
    errorMessage: '',
  };

  handleClose = (removedTag: string) => {
    const { onChange } = this.props;
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
    onChange(tags);
  };

  // @ts-ignore
  showInput = () => this.setState({ inputVisible: true }, () => this.input.focus());

  handleInputChange = (e: any) => {
    const value = e.target.value;

    const regex = new RegExp(/#[a-zA-Z0-9_]+/);
    const valid = regex.test(value);
    let errorMessage = '';
    if (!valid) {
      errorMessage = 'The valid hashtag must be start with #';
    }

    this.setState({ inputValue: value, errorMessage });
  };

  handleInputConfirm = () => {
    const { onChange } = this.props;
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    onChange(tags);
  };

  // @ts-ignore
  saveInputRef = (input) => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue, errorMessage } = this.state;
    const { style, className } = this.props;
    return (
      <>
        <div style={style} className={className}>
          {tags?.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                color={Color.colors.pink}
                key={tag}
                closable={index !== 0}
                onClose={() => this.handleClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 120 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={this.showInput} style={{ borderStyle: 'dashed' }}>
              <Icon style={{ color: Color.colors.black2 }} type="plus" /> New Tag
            </Tag>
          )}
        </div>
        {typeof errorMessage === 'string' && errorMessage !== '' && (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        )}
      </>
    );
  }
}

export default EditableTagGroup;
