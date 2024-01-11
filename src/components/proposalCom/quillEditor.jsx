import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "assets/styles/quill.css";
import styled from "styled-components";

export default React.forwardRef(function QuillEditor({ placeholder, ...props }, ref) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef != null && inputRef.current != null) {
      const quill = inputRef.current;
      quill.setEditorSelection(quill.getEditor(), { index: quill.getEditor().getLength(), length: 0 });
    }
  }, []);

  const handleChange = (value, delta, source, editor) => {
    props.onChange(value, source, editor);
  };

  React.useImperativeHandle(ref, () => ({
    focus() {
      inputRef?.current?.focus();
    },
  }));

  return (
    <EditorStyle className={"mf-ql-editor"}>
      <ReactQuill
        className={"quill-editor"}
        readOnly={props.disabled}
        value={props.value}
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputRef}
      />
      {<></>}
    </EditorStyle>
  );
});

const EditorStyle = styled.div`
  width: 100%;
  border: 1px solid var(--bs-primary);
  .ql-container.ql-snow {
    border: none;
    color: var(--bs-body-color_active);
  }
  svg {
    fill: ${(props) => (props.theme === "true" ? "#fff" : "#000")};
  }
  .ql-toolbar {
    display: none;
  }
`;
