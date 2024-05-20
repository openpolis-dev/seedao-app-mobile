import CreditModal from "./creditModal";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CreditButton from "./button";

export default function ItemsModal({ title, steps, confirmText, onConfirm, handleClose, w }) {
  return (
    <CreditModal>
      <ModalTitle>{title}</ModalTitle>
      <StepsBox>
        {steps.map((step, index) => (
          <li key={index}>
            <span className="number">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </StepsBox>
      <ConfirmBox>
        <CreditButton onClick={onConfirm}>{confirmText}</CreditButton>
      </ConfirmBox>
    </CreditModal>
  );
}

export const BorrowItemsModal = ({ onConfirm, handleClose }) => {
  const { t, i18n } = useTranslation();
  return (
    <ItemsModal
      title={t("Credit.BorrowStepTitle")}
      steps={[t("Credit.BorrowStep1"), t("Credit.BorrowStep2"), t("Credit.BorrowStep3")]}
      onConfirm={onConfirm}
      confirmText={t("Credit.BorrowStepConfirmButton")}
      handleClose={handleClose}
      w={i18n.language === "en"}
    />
  );
};

export const RepayItemsModal = ({ onConfirm, handleClose }) => {
  const { t, i18n } = useTranslation();
  return (
    <ItemsModal
      title={t("Credit.RepayStepTitle")}
      steps={[t("Credit.RepayStep1"), t("Credit.RepayStep2"), t("Credit.RepayStep3")]}
      onConfirm={onConfirm}
      confirmText={t("Credit.RepayStepConfirmButton")}
      handleClose={handleClose}
      w={i18n.language === "en"}
    />
  );
};

const ModalTitle = styled.div`
  font-size: 16px;
  text-align: center;
  color: #343c6a;
  font-family: Inter-SemiBold;
  font-weight: 600;
  line-height: 54px;
`;

const StepsBox = styled.ul`
  color: #343c6a;
  margin: 40px auto;
  display: inline-block;

  li {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 20px;
  }
  .number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #1814f3;
    font-size: 14px;
    text-align: center;
    line-height: 32px;
    color: #1814f3;
  }
`;

const ConfirmBox = styled.div`
  width: 100%;
  margin: 0 auto;
`;
