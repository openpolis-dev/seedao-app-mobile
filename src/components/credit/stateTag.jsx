import styled, { css } from "styled-components";
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

  return strong ? (
    <StrongTagStyle $color={color} $bg={bg}>
      {text}
    </StrongTagStyle>
  ) : (
    <LightStyle $color={color} $bg={bg}>
      {text}
    </LightStyle>
  );
}

const TagStyle = styled.div`
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  display: inline-block;
  text-align: center;
  border-radius: 5px;
`;

const LightStyle = styled(TagStyle)`
  font-size: 12px;
  height: 18px;
  line-height: 19px;
  padding-inline: 6px;
`;

const StrongTagStyle = styled(TagStyle)`
  font-size: 14px;
  height: 24px;
  line-height: 25px;
  padding-inline: 8px;
`;
