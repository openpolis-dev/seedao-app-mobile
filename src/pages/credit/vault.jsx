import styled from "styled-components";
import CreditLogo from "assets/Imgs/credit/credit-logo.svg";
import { useTranslation } from "react-i18next";
import { BlockTitle, StateLine } from "./mine";
import CountIcon from "assets/Imgs/credit/count.svg";
import AmountIcon from "assets/Imgs/credit/amount.svg";
import { useCallback, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useCreditContext } from "./provider";
import getConfig from "constant/envCofnig";
import { getVaultData } from "api/credit";

const networkConfig = getConfig().NETWORK;

const VaultCard = () => {
  const { t } = useTranslation();
  const {
    state: { scoreLendContract },
  } = useCreditContext();

  const [total, setTotal] = useState("0.00");
  const [data, setData] = useState({
    totalBorrowed: 1,
    totalBorrowedAmount: 0,
    inUseCount: 0,
    inUseAmount: 0,
    paybackCount: 0,
    paybackAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
    forfeitSCRAmount: 0,
  });

  const getData = useCallback(() => {
    scoreLendContract?.totalAvailableAmount().then((r) => {
      const value = ethers.utils.formatUnits(r, networkConfig.lend.lendToken.decimals);
      setTotal(Number(value).format());
    });
  }, [scoreLendContract]);

  const getDataFromIndexer = () => {
    getVaultData().then((r) => {
      r && setData(r);
    });
  };

  useEffect(() => {
    getData();
  }, [scoreLendContract, getData]);

  useEffect(() => {
    getDataFromIndexer();
  }, []);
  return (
    <>
      <CardStyle>
        <div className="label">{t("Credit.VaultBorrowingsQuota")}</div>
        <div className="value">{total}</div>
        <div className="tip" style={{ marginTop: "8px" }}>
          {t("Credit.MyBorrowingTip1")}
        </div>
        <div className="tip" style={{ marginBottom: "18px" }}>
          {t("Credit.Details")}
        </div>
        <div className="vault" style={{ visibility: "hidden" }}>
          {t("Credit.VaultTotalQuota")}
        </div>
        <img src={CreditLogo} alt="" />
      </CardStyle>
      <BlockTitle>{t("Credit.BorrowingsState")}</BlockTitle>
      <StateBlock>
        <StateLine2>
          <img src={CountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.BorrowCount", { num: data.totalBorrowed })}</div>
            <div className="value">{Number(data.totalBorrowedAmount).format()} USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.ClearCount", { num: data.paybackCount })}</div>
            <div className="value">{Number(data.paybackAmount).format()} USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={CountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.OverdueCount", { num: data.overdueCount })}</div>
            <div className="value">{Number(data.overdueAmount).format()} USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.TotalForfeit", { num: data.overdueAmount })}</div>
            <div className="value">{Number(data.forfeitSCRAmount).format()} SCR</div>
          </div>
        </StateLine2>
      </StateBlock>
    </>
  );
};
export default function VaultBorrows() {
  return (
    <>
      <VaultCard />
    </>
  );
}

const CardStyle = styled.div`
  background: linear-gradient(107.38deg, #2d60ff 2.61%, #539bff 101.2%);
  width: 100%;
  border-radius: 15px;
  padding: 30px 20px 15px 20px;
  color: #fff;
  box-sizing: border-box;
  position: relative;
  img {
    position: absolute;
    right: 16px;
    top: 18px;
  }
  .label {
    color: #f2f4f7ad;
    font-size: 12px;
  }
  .value {
    font-size: 32px;
    font-family: "Inter-SemiBold";
    font-weight: 600;
    font-size: 38px;
    margin-top: 20px;
  }
  .tip {
    font-size: 10px;
  }
  .vault {
    text-align: right;
    cursor: pointer;
    font-size: 12px;
  }
`;

const StateBlock = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const StateLine2 = styled(StateLine)`
  border-radius: 15px;
  background-color: #fff;
  padding: 16px 20px;
  margin: 0;
`;
