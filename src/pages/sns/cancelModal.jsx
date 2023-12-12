import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function CancelModal({ handleClose, handleCancel }) {
  const { t } = useTranslation();
  return (
    <CancelModalStyle>
      <ModalMask />
      <ModalContent>
        <Title>{t("SNS.CancelRegister")}</Title>
        <TextContent>{t("SNS.CancelTip")}</TextContent>
        <CardFooter>
          <ConfirmButton onClick={handleCancel}>{t("General.confirm")}</ConfirmButton>
          <CancelButton onClick={handleClose}>{t("General.cancel")}</CancelButton>
        </CardFooter>
      </ModalContent>
    </CancelModalStyle>
  );
}

const CancelModalStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContent = styled.div`
  height: 200px;
  width: 90vw;
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 5vw;
  margin-top: -100px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  justify-content: center;
`;

const CardFooter = styled.div`
  text-align: center;
  display: flex;
  gap: 20px;
  justify-content: center;
  button {
    width: 110px;
  }
`;

const BasicButton = styled.button`
  outline: none;
  border: none;
  height: 36px;
  border-radius: 8px;
  padding-inline: 10px;
  font-size: 14px;
`;

const ConfirmButton = styled(BasicButton)`
  background-color: var(--primary-color);
  color: #fff;
`;
const CancelButton = styled(BasicButton)``;

const TextContent = styled.div`
  text-align: center;
  font-size: 14px;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: Poppins-Medium;
`;