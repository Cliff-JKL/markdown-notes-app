// import * as React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '../markdown-editor.scss';

interface EditNoteProps {
  content: string;
  onChange: (value: string) => void;
  height: number;
}

export const MarkdownEditor = (props: EditNoteProps) => {
  const { content, onChange, height } = props;

  return (
    <MDEditor
      value={content}
      onChange={onChange}
      height="100%"
      preview="live"
    />
  );
};
