import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CreditRecordStatus } from "constant/credit";

export default function StateTag({ state, strong }) {
  const { t } = useTranslation();
  let color = "";
  let text;
  let bg = "transparent";
  switch (state) {
    case CreditRecordStatus.OVERDUE:
      color = "#FE5C73";
      text = t("Credit.RecordOverdue");
      bg = strong ? "#FE5C73" : "rgba(255, 113, 147, 0.15)";
      break;
    case CreditRecordStatus.INUSE:
      color = "#1814F3";
      text = t("Credit.RecordInUse");
      bg = strong ? "#1814F3" : "rgba(24, 20, 243, 0.07)";
      break;
    case CreditRecordStatus.CLEAR:
      color = "#16DBAA";
      text = t("Credit.RecordClear");
      bg = strong ? "#16DBAA" : "rgba(22, 219, 170, 0.15)";
      break;
    default:
      text = "";
  }
  if (strong) {
    color = "#fff";
  }

  return (
    <StatusTagStyle
      $color={color}
      $bg={bg}
      style={{ fontSize: strong ? "14px" : "10px", lineHeight: strong ? "24px" : "16px", paddingInline: strong ? "8px" : "6px"}}
    >
      {text}
    </StatusTagStyle>
  );
}

const StatusTagStyle = styled.div`
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  display: inline-block;
  text-align: center;
  border-radius: 5px;
`;
