import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import MyBorrowings from "./mine";
import VaultBorrows from "./vault";
import CreditRecords from "./records";
import CreditProvider, { useCreditContext, ACTIONS } from "./provider";
import { ethers } from "ethers";
import getConfig from "constant/envCofnig";
import { amoy } from "utils/chain";
import BondNFTABI from "assets/abi/BondNFT.json";
import ScoreLendABI from "assets/abi/ScoreLend.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkTokenValid, clearStorage } from "utils/auth";
import { useSelector } from "react-redux";

const networkConfig = getConfig().NETWORK;

const CreditTabs = ({ tab, onChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userToken = useSelector((state) => state.userToken);

  const handleChangeTab = (newTab) => {
    if (newTab === "mine") {
      console.log("userToken", userToken, checkTokenValid(userToken?.token, userToken?.token_exp));
      if (!checkTokenValid(userToken?.token, userToken?.token_exp)) {
        clearStorage();
        localStorage.setItem('before-login', '/credit?tab=mine');
        navigate("/login");
        return;
      }
    }
    onChange(newTab);
    navigate(`/credit?tab=${newTab}`);
  };
  return (
    <CreditTabsStyle>
      <div onClick={() => handleChangeTab("mine")} className={tab === "mine" ? "active" : ""}>
        {t("Credit.MyBorrowings")}
      </div>
      <span className="line"></span>
      <div onClick={() => handleChangeTab("all")} className={tab === "all" ? "active" : ""}>
        {t("Credit.VaultBorrowings")}
      </div>
    </CreditTabsStyle>
  );
};

const CreditCards = ({ tab }) => {
  const { dispatch: dispatchCreditEvent } = useCreditContext();

  useEffect(() => {
    const _provider = new ethers.providers.StaticJsonRpcProvider(amoy.rpcUrls.public.http[0], amoy.id);
    const bondNFTContract = new ethers.Contract(networkConfig.lend.bondNFTContract, BondNFTABI, _provider);
    dispatchCreditEvent({ type: ACTIONS.SET_BOND_NFT_CONTRACT, payload: bondNFTContract });
    const scoreLendontract = new ethers.Contract(networkConfig.lend.scoreLendContract, ScoreLendABI, _provider);
    dispatchCreditEvent({ type: ACTIONS.SET_LEND_CONTRACT, payload: scoreLendontract });
  }, []);

  switch (tab) {
    case "mine":
      return <MyBorrowings />;
    case "all":
      return <VaultBorrows />;
    default:
      return null;
  }
};

export default function CreditPage() {
  const { t } = useTranslation();
  const [search] = useSearchParams();
  const tabFromUrl = search.get("tab");
  const [tab, setTab] = useState(["all", "mine"].includes(tabFromUrl) ? tabFromUrl : "all");

  return (
    <Layout title={t("Credit.Title")} customTab={<CreditTabs tab={tab} onChange={setTab} />} bgColor="#F5F7FA" tabHeight="46px">
      <LayoutContainer>
        <CreditProvider>
          <CreditCards tab={tab} />
          <CreditRecords tab={tab} />
        </CreditProvider>
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
  * {
    font-family: "Inter-Regular";
  }
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
      color: #1814f3;
    }
  }
`;

const LayoutContainer = styled.div`
  padding: 30px 20px 0;
`;
