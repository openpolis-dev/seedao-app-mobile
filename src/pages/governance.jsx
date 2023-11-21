import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "components/layout/layout";
import VaultIcon from "assets/Imgs/governance/vault.svg";
import ProposalIcon from "assets/Imgs/governance/proposal.svg";
import GovernanceIcon from "assets/Imgs/governance/governance.svg";
import BookIcon from "assets/Imgs/governance/book.svg";
import { useMemo } from "react";
import CityhallMembers from "components/governance/cityhallMembers";

const BookRow = ({ name, link }) => {
  const { t } = useTranslation();

  return (
    <BookItem>
      <div>
        <img src={BookIcon} alt="" />
        <BookName>{name}</BookName>
      </div>
      <CheckButton href={link} target="_blank">
        {t("Buttons.Check")}
      </CheckButton>
    </BookItem>
  );
};

export default function Governance() {
  const { t } = useTranslation();

  const books = useMemo(() => {
    return [
      {
        name: t("Governance.MetaRule"),
        link: "https://seedao.notion.site/SeeDAO-SIP-2-a4720f18c068455785a7a9ee5fd626ee",
      },
      {
        name: t("Governance.GovernanceBook"),
        link: "https://seedao.notion.site/SIP-19-cadf3c7691b84e4bbc8b4620110fe9ce",
      },
      {
        name: t("Governance.NodesConferenceRule"),
        link: "https://seedao.notion.site/SIP-20-720aa499e0124838974dfcb44d4bcb44",
      },
    ];
  }, [t]);
  return (
    <Layout sticky title={t("Governance.Head")} bgColor="var(--background-color)">
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
              <div className="desc">
                {t("Governance.GovernanceRuleDesc")}
              </div>
            </GovernanceBoxTopLeft>
          </GovernanceBoxTop>
          <GovernanceContent>
            {books.map((item, index) => (
              <BookRow key={index} name={item.name} link={item.link} />
            ))}
          </GovernanceContent>
        </GovernanceBox>
        <CityhallMembers />
      </LayoutContainer>
    </Layout>
  );
}

const LayoutContainer = styled.div`
  padding-inline: 20px;
  padding-bottom: 20px;
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
  background: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  margin-top: 16px;
  overflow: hidden;
  margin-bottom: 30px;
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
    font-size: 13px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #ffffff;
    line-height: 21px;
    text-align: center;
    margin-top: 8px;
  }
`;

const GovernanceContent = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 20px 13px;
`;

const BookItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const BookName = styled.span`
  font-size: 15px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  line-height: 22px;
`;

const CheckButton = styled.a`
  display: inline-block;
  background: var(--background-color-2);
  border-radius: 15px;
  line-height: 24px;
  text-align: center;
  font-size: 13px;
  padding-inline: 16px;
  cursor: pointer;
`;
