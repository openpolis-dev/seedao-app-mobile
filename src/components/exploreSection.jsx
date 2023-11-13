import { useTranslation } from "react-i18next";
import styled from "styled-components";

export default function ExploreSection({ title, desc, children, moreLink }) {
  const { t } = useTranslation();
  return (
    <SectionBlock>
      <SectionHead>
        <div>
          <SectionTitle>{title}</SectionTitle>
          <SectionDesc>{desc}</SectionDesc>
        </div>
        <div>
          <CheckButton>{t("Buttons.CheckAll")}</CheckButton>
        </div>
      </SectionHead>
      <SectionBody>{children}</SectionBody>
    </SectionBlock>
  );
}

const SectionBlock = styled.section`
  border-bottom: 1px solid var(--border-color-1);
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  line-height: 22px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #1a1323;
`;

const SectionDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 8px;
`;

const CheckButton = styled.span`
  display: inline-block;
  padding: 6px 8px;
  margin-top: 10px;
  font-size: 13px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--primary-color);
`;

const SectionBody = styled.div`
  padding-top: 20px;
`;
