import React from 'react';
import { quillModules } from 'utils/quillUtil';
import ReactQuill from 'react-quill';
import ReactMarkdown from 'react-markdown';


export default function QuillViewer(props) {
  let str;
  try {
    str = JSON.parse(props.content);
    const delta = { ops: str };
    // const delta = { ops: JSON.parse(props.content) };
    const modules = quillModules();
    modules.toolbar = false;
    // @ts-ignore
    return <ReactQuill className={'quill-viewer'} value={delta} readOnly={true} modules={modules} />;
  } catch (e) {
    return <ReactMarkdown>{props.content}</ReactMarkdown>;
  }
}