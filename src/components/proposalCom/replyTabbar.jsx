import styled from "styled-components";
import Avatar from "components/common/avatar";
import { useTranslation } from "react-i18next";

export default function ReplyTabbar() {
  const { t } = useTranslation();

  const onFocusToWriteReply = () => {};
  return (
    <Box>
      <Avatar size="32px" />
      <NormalInput placeholder={t("Proposal.WriteReplyHint")} onClick={onFocusToWriteReply} />
    </Box>
  );
}

const Box = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  gap: 16px;
  height: 70px;
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

const NormalInput = styled.input`
  flex: 1;
  border: 1px solid var(--border-color-1);
  border-radius: 16px;
  outline: none;
  height: 40px;
  line-height: 40px;
  padding-inline: 16px;
`;
