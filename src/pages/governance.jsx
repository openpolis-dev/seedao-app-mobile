import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "components/layout/layout";
import StickyHeader from "components/layout/StickyHeader";
import VaultIcon from "assets/Imgs/governance/vault.svg";
import ProposalIcon from "assets/Imgs/governance/proposal.svg";
import GovernanceIcon from "assets/Imgs/governance/governance.svg";

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
        <GovernanceBox>
          <GovernanceBoxTop>
            <img src={GovernanceIcon} alt="" />
            <GovernanceBoxTopLeft>
              <div className="title">{t("Governance.GovernanceRule")}</div>
              <div className="desc">{t("Governance.GovernanceRuleDesc")}</div>
            </GovernanceBoxTopLeft>
          </GovernanceBoxTop>
        </GovernanceBox>
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

const GovernanceBox = styled.div`
  width: 100%;
  height: 247px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  margin-top: 16px;
  overflow: hidden;
`;

const GovernanceBoxTop = styled.div`
  height: 104px;
  display: flex;
  justify-content: space-between;
  background: #ffffff linear-gradient(65deg, #2f76ff 0%, #40c1f8 100%);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  align-items: center;
  padding-inline: 20px;
`;

const GovernanceBoxTopLeft = styled.div`
  text-align: center;
  .title {
    font-size: 18px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #ffffff;
    line-height: 22px;
    margin-bottom: 9px;
  }
  .desc {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
    height: 28px;
    border-radius: 36px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding-inline: 15px;
  }
`;
