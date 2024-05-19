import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import MyBorrowings from "./mine";

const CreditTabs = () => {
  const { t } = useTranslation();
  return (
    <CreditTabsStyle>
      <div>{t("Credit.MyBorrowings")}</div>
      <span className="line"></span>
      <div>{t("Credit.VaultBorrowings")}</div>
    </CreditTabsStyle>
  );
};

export default function CreditPage() {
  const { t } = useTranslation();
  return (
    <Layout title={t("Credit.Title")} customTab={<CreditTabs />} bgColor="#F5F7FA">
      <LayoutContainer>
        <MyBorrowings />
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
  padding-inline: 20px;
`;
