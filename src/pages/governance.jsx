import styled from "styled-components";
import Layout from "components/layout/layout";
import StickyHeader from "components/layout/StickyHeader";
import { useTranslation } from "react-i18next";
import VaultIcon from "assets/Imgs/governance/vault.svg";
import ProposalIcon from "assets/Imgs/governance/proposal.svg";
import { Link } from "react-router-dom";

export default function Governance() {
  const { t } = useTranslation();
  return (
    <Layout noHeader>
      <StickyHeader title={t("Governance.Head")} bgcolor="var(--background-color)" />
      <LayoutContainer>
        <FirstLine>
          <SquareLink className="vault" to="/assets">
            <div>
              <FirstLineTitle>{t("Governance.Vault")}</FirstLineTitle>
              <FirstLineDesc>{t("Governance.VaultDesc")}</FirstLineDesc>
              <img src={VaultIcon} alt="" />
            </div>
          </SquareLink>
          <SquareLink className="proposal" to="/proposal">
            <div>
              <FirstLineTitle>{t("Governance.Proposal")}</FirstLineTitle>
              <FirstLineDesc>{t("Governance.ProposalDesc")}</FirstLineDesc>
              <img src={ProposalIcon} alt="" />
            </div>
          </SquareLink>
        </FirstLine>
      </LayoutContainer>
    </Layout>
  );
}

const LayoutContainer = styled.div`
  padding-inline: 20px;
  background-color: var(--background-color);
`;

const FirstLine = styled.div`
  display: flex;
  gap: 14px;
`;

const SquareLink = styled(Link)`
  border-radius: 16px;
  flex: 1;
  position: relative;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  & > div {
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    padding: 16px;
  }
  &.vault {
    background: #ff7193;
  }
  &.proposal {
    background: #5200ff;
  }
  img {
    margin-top: 17px;
    float: right;
    width: 50%;
  }
`;

const FirstLineTitle = styled.div`
  font-size: 22px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #ffffff;
  line-height: 24px;
`;

const FirstLineDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 21px;
  margin-top: 8px;
`;
