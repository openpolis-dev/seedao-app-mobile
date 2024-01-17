import React, { useRef, useState } from "react";
import styled from "styled-components";
import Avatar from "components/common/avatar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import publicJs from "utils/publicJs";

const toPlaintext = (delta) => {
  return delta.reduce(function (text, op) {
    if (!op.insert) throw new TypeError("only `insert` operations can be transformed!");
    if (typeof op.insert !== "string") return text + " ";
    return text + op.insert;
  }, "");
};

const formatSNS = (snsMap, wallet) => {
  const name = snsMap[wallet] || wallet;
  return name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4);
};

export default React.forwardRef(function ReplyTabbar({ sendComment }, ref) {
  const { t } = useTranslation();
  const userToken = useSelector((state) => state.userToken);
  const snsMap = useSelector((state) => state.snsMap);

  const [ctype, setCtype] = useState("");
  const [data, setData] = useState();
  const [sendVisible, setSendVisible] = useState(false);
  const inputRef = useRef();
  const loading = useSelector((store) => store.loading);

  const [quillContent, setQuillContent] = useState("");

  const [placeholder, setPlaceholder] = useState(t("Proposal.WriteReplyHint"));

  React.useImperativeHandle(ref, () => ({
    focus(type, _data) {
      inputRef?.current?.focus();
      if (!type) {
        return;
      }
      setData(_data);
      setCtype(type);
      if (type === "edit") {
        if (_data?.content?.includes("insert")) {
          setQuillContent(toPlaintext(JSON.parse(_data?.content)));
        } else {
          setQuillContent(_data?.content);
        }
      } else if (type === "reply") {
        setPlaceholder(`${t("Proposal.Reply")} @${formatSNS(snsMap, _data.wallet?.toLocaleLowerCase())}`);
      }
    },
    clear() {
      setData(undefined);
      setCtype();
      setQuillContent("");
      setSendVisible(false);
    },
  }));

  const onChangeContent = (e) => {
    setQuillContent(e.target.value);
  };

  return (
    <Box>
      <BoxInner>
        <Avatar src={userToken?.user?.avatar} size="32px" />
        <Editor>
          <textarea
            ref={inputRef}
            value={quillContent}
            placeholder={placeholder}
            onChange={onChangeContent}
            onFocus={() => setSendVisible(true)}
            onBlur={() => !quillContent && setSendVisible(false)}
          />
          <HideContent contenteditable="true">{quillContent}</HideContent>
        </Editor>
        {sendVisible && (
          <SendButton disabled={loading} onClick={() => sendComment(ctype, data, quillContent)}>
            {t("Proposal.Send")}
          </SendButton>
        )}
      </BoxInner>
    </Box>
  );
});

const Box = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  min-height: 70px;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
  padding-inline: 24px;
  box-sizing: border-box;
  padding-top: 16px;
`;

const BoxInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Editor = styled.div`
  flex: 1;
  border: 1px solid var(--border-color-1);
  border-radius: 16px;
  outline: none;
  padding-inline: 4px;
  min-height: 40px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  textarea {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    line-height: 20px;
    box-sizing: border-box;
    outline: 0;
    border: none;
    padding-inline: 10px;
    margin-block: 10px;
    font-size: 14px;
  }
`;
const HideContent = styled.div`
  min-height: 20px;
  line-height: 20px;
  margin: 10px;
  font-size: 14px;
  outline: 0;
  -webkit-user-modify: read-write-plaintext-only;
  visibility: hidden;
`;

const SendButton = styled.button`
  height: 40px;
  line-height: 40px;
  padding-inline: 16px;
  background-color: var(--primary-color);
  color: #fff;
  font-size: 14px;
  font-family: "Poppins-SemiBold";
  border-radius: 16px;
  border: none;
  &:disabled {
    opacity: 0.4;
  }
`;
