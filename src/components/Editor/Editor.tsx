import React from 'react';
import { Editor, EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './Editor.less';

const DraftEditor = (props: EditorProps) => {
  return (
    <Editor
      toolbarClassName={styles.toolbar}
      wrapperClassName={styles.wrapper}
      editorClassName={styles.editor}
      toolbar={{
        // options: ['inline', 'blockType', 'fontSize', 'textAlign', 'history', 'colorPicker'],
        // fontFamily: {
        //   options: ['Playfair Display', 'Montserrat'],
        // },
        inline: {
          options: ['italic', 'bold'],
          bold: { className: 'demo-option-custom' },
          italic: { className: 'demo-option-custom' },
          underline: { className: 'demo-option-custom' },
          strikethrough: { className: 'demo-option-custom' },
          monospace: { className: 'demo-option-custom' },
          superscript: { className: 'demo-option-custom' },
          subscript: { className: 'demo-option-custom' },
        },
        blockType: {
          className: 'demo-option-custom-wide',
          dropdownClassName: 'demo-dropdown-custom',
        },
        fontSize: { className: 'demo-option-custom-medium' },
      }}
      {...props}
    />
  );
};

export default DraftEditor;
