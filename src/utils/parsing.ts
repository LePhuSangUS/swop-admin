import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';

export function htmlToString(content: string) {
  const blocksFromHTML = convertFromHTML(content ?? '<p></p>');
  const editorState = blocksFromHTML?.contentBlocks
    ? EditorState.createWithContent(
        ContentState.createFromBlockArray(blocksFromHTML?.contentBlocks, blocksFromHTML?.entityMap),
      )
    : EditorState.createEmpty();

  const raw = convertToRaw(editorState.getCurrentContent());

  return raw;
}
