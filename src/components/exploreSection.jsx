import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function ExploreSection({ title, desc, children, moreLink,noMore }) {
  const { t } = useTranslation();
  return (
    <SectionBlock>
      <SectionHead>
        <div>
          <SectionTitle>{title}</SectionTitle>
          <SectionDesc>{desc}</SectionDesc>
        </div>
        <div>
          {
            !noMore &&    <LinkBox to={moreLink}>
                <CheckButton>{t("Buttons.CheckAll")}</CheckButton>
              </LinkBox>
          }
        </div>
      </SectionHead>
      <SectionBody>{children}</SectionBody>
    </SectionBlock>
  );
}

const SectionBlock = styled.section`
  border-bottom: 1px solid var(--border-color-1);
  &:last-child{
    border-bottom: 0;
  }
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

const LinkBox = styled(Link)`
  margin-top: 10px;
`;

const CheckButton = styled.span`
  display: inline-block;
  padding: 6px 8px;
  font-size: 13px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--primary-color);
`;

const SectionBody = styled.div`
  padding-top: 20px;
`;
