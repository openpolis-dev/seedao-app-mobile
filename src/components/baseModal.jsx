import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function BaseModal({ title, msg, onCancel, onConfirm, confirmText, footer }) {
  const { t } = useTranslation();
  return (
    <Modal>
      <ModalMask />
      <ModalContainer>
        <ModalBox>
          <Content>
            {title && <Title>{title}</Title>}
            <Message>{msg}</Message>
          </Content>
          {footer || (
            <Footer>
              <CancelButton onClick={onCancel}>{t("General.cancel")}</CancelButton>
              <ConfirmButtn onClick={onConfirm}>{confirmText || t("General.confirm")}</ConfirmButtn>
            </Footer>
          )}
        </ModalBox>
      </ModalContainer>
    </Modal>
  );
}

const ModalMask = styled.div`
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalBox = styled.div`
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
`;

const Content = styled.div`
  padding: 28px 30px 30px;
`;

const Message = styled.div`
  line-height: 24px;
  font-size: 14px;
`;

const Footer = styled.div`
  height: 45px;
  line-height: 45px;
  display: flex;
  border-top: 1px solid #f0f1f2;
`;

const Title = styled.div`
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 8px;
  font-family: "Poppins-SemiBold";
`;

const FooterButton = styled.span`
  flex: 1;
  text-align: center;
`;

const CancelButton = styled(FooterButton)`
  color: var(--font-color-1);
`;
const ConfirmButtn = styled(FooterButton)`
  color: #5b0dff;
  border-left: 1px solid #f0f1f2;
`;
