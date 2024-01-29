import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { MdPreview } from "md-editor-rt";
import { handleContent } from "./parseContent";

export default function ActionOfCommet({ data, handleClose, onClickEditCommet, onClickDeleteCommet }) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data?.content && data?.content.includes("insert")) {
      const _parse = async () => {
        setContent(await handleContent(data?.content));
      };
      _parse();
    } else {
      setContent(data?.content);
    }
  }, [data]);
  return (
    <ActionModalModal>
      <ActionModalMask onClick={handleClose} />
      <ActionModalContent>
        <CommentContent>
          {data?.content.includes("insert") ? (
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          ) : (
            <MdPreview modelValue={content || ""} />
          )}
        </CommentContent>
        <Action onClick={onClickEditCommet}>{t("Proposal.Edit")}</Action>
        <Action onClick={onClickDeleteCommet}>{t("Proposal.Delete")}</Action>
      </ActionModalContent>
    </ActionModalModal>
  );
}

const ActionModalModal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ActionModalMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ActionModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  max-height: 50vh;
  padding-bottom: 29px;
`;

const CommentContent = styled.div`
  font-size: 14px;
  color: var(--font-light-color);
  text-align: center;
  padding-block: 24px;
`;
const Action = styled.div`
  margin-inline: 32px;
  line-height: 52px;
  border-top: 1px solid var(--border-color-1);
  text-align: center;
  font-size: 14px;
`;
