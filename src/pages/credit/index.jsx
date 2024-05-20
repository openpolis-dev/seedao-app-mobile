import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import MyBorrowings from "./mine";
import VaultBorrows from "./vault";
import CreditRecords from "./records";

const CreditTabs = ({ tab, onChange }) => {
  const { t } = useTranslation();
  return (
    <CreditTabsStyle>
      <div onClick={() => onChange("mine")} className={tab === "mine" ? "active" : ""}>
        {t("Credit.MyBorrowings")}
      </div>
      <span className="line"></span>
      <div onClick={() => onChange("all")} className={tab === "all" ? "active" : ""}>
        {t("Credit.VaultBorrowings")}
      </div>
    </CreditTabsStyle>
  );
};

export default function CreditPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("mine");

  const title = tab === "all" ? t("Credit.AllBorrowingsRecord") : t("Credit.MyBorrowingsRecord");
  return (
    <Layout title={t("Credit.Title")} customTab={<CreditTabs tab={tab} onChange={setTab} />} bgColor="#F5F7FA">
      <LayoutContainer>
        {tab === "mine" && <MyBorrowings />}
        {tab === "all" && <VaultBorrows />}

        <CreditRecords title={title} />
      </LayoutContainer>
    </Layout>
  );
}

const CreditTabsStyle = styled.div`
  background-color: #f5f7fa;
  border: 1px solid #718ebf;
  display: flex;
  border-radius: 40px;
  height: 40px;
  margin-inline: 20px;
  line-height: 40px;
  position: relative;
  .line {
    position: absolute;
    display: block;
    width: 1px;
    height: 24px;
    left: 50%;
    top: 8px;
    background-color: #718ebf;
  }
  div {
    flex: 1;
    text-align: center;
    color: #343c6a;
    font-size: 15px;
    font-weight: 500;
    font-family: "Inter-Medium";
    &.active {
      font-family: "Inter-SemiBold";
      font-weight: 600;
    }
  }
`;

const LayoutContainer = styled.div`
  padding: 30px 20px 0;
`;
