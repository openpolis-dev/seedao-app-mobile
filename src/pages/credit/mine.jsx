import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CreditLogo from "assets/Imgs/credit/credit-logo.svg";
import SCRIcon from "assets/Imgs/credit/scr.svg";
import QuotaIcon from "assets/Imgs/credit/quota.svg";
import CountIcon from "assets/Imgs/credit/count.svg";
import AmountIcon from "assets/Imgs/credit/amount.svg";

const MineCard = () => {
  const { t } = useTranslation();

  return (
    <>
      <CardStyle>
        <div className="label">{t("Credit.MyBorrowingQuota")}</div>
        <div className="value">2,000.00</div>
        <div className="tip">{t("Credit.MyBorrowingTip1")}</div>
        <div className="btn-tip">{t("Credit.MyBorrowingTip2")}</div>
        <div className="vault">{t("Credit.VaultTotalQuota")}</div>
        <img src={CreditLogo} alt="" />
      </CardStyle>
      <SubCardStyle>
        <div>
          <div className="label">
            <img src={SCRIcon} alt="" />
            <span>{t("Credit.MySCR")}</span>
          </div>
          <div className="value">100,000.00</div>
        </div>
        <div>
          <div className="label">
            <img src={QuotaIcon} alt="" />
            <span>{t("Credit.MyTotalQuota")}</span>
          </div>
          <div className="value">1,000.00</div>
        </div>
      </SubCardStyle>
      <OperateBox>
        <div className="borrow">{t("Credit.GoToBorrow")}</div>
        <div>{t("Credit.GoToRepay")}</div>
      </OperateBox>
      <BlockTitle>{t("Credit.MyBorrowingsState")}</BlockTitle>
      <StateBlock>
        <StateLine>
          <img src={CountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.MyInuseCount", { num: 1 })}</div>
            <div className="value">3,000.00 USDT</div>
          </div>
        </StateLine>
        <StateLine>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.OverdueCount", { num: 1 })}</div>
            <div className="value">3,000.00 USDT</div>
          </div>
        </StateLine>
        <div className="repay-tip">{t("Credit.LatestRepayDate")} 2022-01-02</div>
        <div className="repay-tip">{t("Credit.RepayTip")}</div>
      </StateBlock>
    </>
  );
};

export default function MyBorrowings() {
  const { t } = useTranslation();
  return (
    <>
      <MineCard />
    </>
  );
}

const CardStyle = styled.div`
  background: linear-gradient(107.38deg, #4c49ed 2.61%, #2926f1 51.9%, #0a06f4 101.2%);
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
    margin-block: 8px;
  }
  .vault {
    text-align: right;
    cursor: pointer;
    font-size: 12px;
  }
  .btn-tip {
    display: inline-block;
    line-height: 22px;
    font-size: 12px;
    padding-inline: 8px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  }
`;

const SubCardStyle = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  > div {
    flex: 1;
    background-color: #fff;
    border-radius: 15px;
    padding: 16px;

    .label {
      font-size: 10px;
      color: #718ebf;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .value {
      font-size: 16px;
      font-family: "Inter-SemiBold";
      font-weight: 600;
      margin-top: 6px;
    }
  }
`;

const OperateBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  > div {
    flex: 1;
    background-color: #fff;
    color: #343c6a;
    font-size: 15px;
    font-weight: 500;
    font-family: "Inter-Medium";
    line-height: 48px;
    border-radius: 10px;
    text-align: center;
    &.borrow {
      background-color: #1814f3;
      color: #fff;
    }
  }
`;

const BlockTitle = styled.div`
  font-family: "Inter-SemiBold";
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin-top: 20px;
  margin-bottom: 14px;
  color: #343c6a;
`;

const StateBlock = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px 20px 16px;
  .repay-tip {
    font-size: 12px;
    color: #1814f3;
  }
`;

const StateLine = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 25px;
  .label {
    color: #718ebf;
    font-size: 12px;
  }
  .value {
    color: #232323;
    font-size: 16px;
    font-family: "Inter-SemiBold";
    font-weight: 600;
  }
`;
