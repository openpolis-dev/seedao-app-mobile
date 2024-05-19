import styled from "styled-components";
import CreditLogo from "assets/Imgs/credit/credit-logo.svg";
import { useTranslation } from "react-i18next";
import { BlockTitle, StateLine } from "./mine";
import CountIcon from "assets/Imgs/credit/count.svg";
import AmountIcon from "assets/Imgs/credit/amount.svg";

const VaultCard = () => {
  const { t } = useTranslation();
  return (
    <>
      <CardStyle>
        <div className="label">{t("Credit.VaultBorrowingsQuota")}</div>
        <div className="value">2,000.00</div>
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
            <div className="label">{t("Credit.BorrowCount", { num: 1 })}</div>
            <div className="value">3,000.00 USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.ClearCount", { num: 1 })}</div>
            <div className="value">3,000.00 USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={CountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.OverdueCount", { num: 1 })}</div>
            <div className="value">3,000.00 USDT</div>
          </div>
        </StateLine2>
        <StateLine2>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.TotalForfeit", { num: 1 })}</div>
            <div className="value">3,000.00 SCR</div>
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
