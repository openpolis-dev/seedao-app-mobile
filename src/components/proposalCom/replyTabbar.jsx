import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Avatar from "components/common/avatar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import QuillEditor from "./quillEditor";

export default React.forwardRef(function ReplyTabbar({ sendComment }, ref) {
  const { t } = useTranslation();
  const userToken = useSelector((state) => state.userToken);

  const [ctype, setCtype] = useState("");
  const [data, setData] = useState();
  const inputRef = useRef();
  const loading = useSelector((store) => store.loading);

  const [replyContent, setReplyContent] = useState("");
  const [quillContent, setQuillContent] = useState("");

  React.useImperativeHandle(ref, () => ({
    focus(type, _data) {
      // TODO: focus
      inputRef?.current?.focus();
      setData(_data);
      setCtype(type);
      if (type === "edit") {
        setQuillContent({ ops: JSON.parse(_data?.content) });
      }
    },
    clear() {
      setData(undefined);
      setCtype();
      setReplyContent("");
      setQuillContent("");
    },
  }));

  const handleChange = (value, source, editor) => {
    if (editor.getText().trim().length === 0) {
      setReplyContent("");
    } else {
      setReplyContent(JSON.stringify(editor.getContents().ops));
    }
    // @ts-ignore
    setQuillContent(editor.getContents);
  };

  return (
    <Box>
      <Avatar src={userToken?.user?.avatar} size="32px" />
      <Editor>
        <QuillEditor onChange={handleChange} value={quillContent} ref={inputRef} />
      </Editor>
      <button disabled={loading} onClick={() => sendComment(ctype, data, replyContent)}>
        {t("Proposal.Send")}
      </button>
    </Box>
  );
});

const Box = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  gap: 16px;
  min-height: 70px;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
  padding-inline: 24px;
  box-sizing: border-box;
`;

const Editor = styled.div`
  flex: 1;
  border: 1px solid var(--border-color-1);
  border-radius: 16px;
  outline: none;
  padding-inline: 16px;
  margin: 10px 0;
  .ql-editor {
    height: unset;
    min-height: 1.5em!important;
  }
`;
