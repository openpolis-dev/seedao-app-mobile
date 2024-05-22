import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import StateTag from "components/credit/stateTag";
import publicJs from "utils/publicJs";
import { CreditRecordStatus } from "constant/credit";
import { amoy } from "utils/chain";
import { useLocation, useParams } from "react-router-dom";
import useQuerySNS from "hooks/useQuerySNS";
import getConfig from "constant/envCofnig";
import { ethers } from "ethers";

const lendToken = getConfig().NETWORK.lend;

export default function CreditRecordPage() {
  const { t } = useTranslation();

  const { state: data } = useLocation();
  const { id } = useParams();

  const [fullData, setFullData] = useState(data);
  const [borrower, setBorrower] = useState(data?.borrower);
  const [interestDays, setInterestDays] = useState(data?.interestDays || 0);
  const [interestAmount, setInterestAmount] = useState(data?.interestAmount || 0);

  const { getMultiSNS } = useQuerySNS();

  const handleSNS = async (wallet) => {
    try {
      const sns_map = await getMultiSNS([]);
      const sns = sns_map[wallet.toLowerCase()] || publicJs.AddressToShow(wallet);
      setBorrower(sns);
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    if (data) {
      handleSNS(data.debtor);
      setFullData(data);
      if (data.interestDays === 0 && data.status === CreditRecordStatus.INUSE) {
        //   bondNFTContract?.calculateInterest(Number(id)).then((r) => {
        //     setInterestDays(r.interestDays.toNumber());
        //     setInterestAmount(Number(ethers.utils.formatUnits(r.interestAmount, lendToken.decimals)));
        //   });
      }
    } else {
    }
  }, [data, id]);

  return (
    <Layout title={t("Credit.Records")} noTab bgColor="#F5F7FA">
      <LayoutContainer>
        <DetailBox>
          <TotalBox>
            <div className="amount">{fullData?.borrowAmount?.format() || "0.00"} USDT</div>
            <StateTag state={fullData?.status} strong />
          </TotalBox>
          <div className="id">
            {t("Credit.BorrowID")}: {data.lendIdDisplay}
          </div>
          <DetailLines>
            <Line>
              <dt>{t("Credit.BorrowName")}</dt>
              <dd>{borrower}</dd>
            </Line>
            <Line>
              <dt>{t("Credit.Forfeit")}</dt>
              <dd>{fullData?.mortgageSCRAmount?.format()} SCR</dd>
            </Line>
            <Line>
              <dt>{t("Credit.BorrowHash")}</dt>
              <dd>
                <a
                  className="hash"
                  href={`${amoy?.blockExplorers?.default.url}/tx/${fullData?.borrowTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {publicJs.AddressToShow(fullData?.borrowTx)}
                </a>
              </dd>
            </Line>
            <Line>
              <dt>{t("Credit.BorrowTime")}</dt>
              <dd>{fullData?.borrowTime}</dd>
            </Line>
            <Line>
              <dt>{t("Credit.Rate")}</dt>
              <dd>{t("Credit.DayRate01", { rate: fullData?.rate })}</dd>
            </Line>
            <Line>
              <dt>{t("Credit.BorrowDuration")}</dt>
              <dd>
                {fullData?.status === CreditRecordStatus.OVERDUE ? (
                  <NoData>-</NoData>
                ) : (
                  t("Credit.Days", { days: fullData?.interestDays })
                )}
              </dd>
            </Line>
            <Line>
              <dt>{t("Credit.TotalInterest")}</dt>
              <dd>
                {fullData?.status === CreditRecordStatus.OVERDUE ? (
                  <NoData>-</NoData>
                ) : (
                  `${fullData?.interestAmount} USDT`
                )}
              </dd>
            </Line>
            <Line>
              <dt>{t("Credit.LastRepaymentTime")}</dt>
              <dd>{fullData?.overdueTime}</dd>
            </Line>
          </DetailLines>
          {fullData?.status === CreditRecordStatus.CLEAR && (
            <>
              <Divider />
              <RepayTtile>{t("Credit.RepayRecord")}</RepayTtile>
              <DetailLines>
                <Line>
                  <dt>{t("Credit.TotalRepay")}</dt>
                  <dd className="total">{fullData?.borrowAmount + fullData?.interestAmount || 0} USDT</dd>
                </Line>
                <Line>
                  <dt>{t("Credit.Principal")}</dt>
                  <dd>{fullData?.borrowAmount?.format() || "0.00"} USDT</dd>
                </Line>
                <Line>
                  <dt>{t("Credit.Interest")}</dt>
                  <dd>{fullData?.interestAmount?.format() || "0.00"} USDT</dd>
                </Line>
                <Line>
                  <dt>{t("Credit.ForfeitRepay")}</dt>
                  <dd>{fullData?.mortgageSCRAmount?.format() || "0.00"} SCR</dd>
                </Line>
                <Line>
                  <dt>{t("Credit.RepayHash")}</dt>
                  <dd>
                    <a
                      className="hash"
                      href={`${amoy?.blockExplorers?.default.url}/tx/${fullData?.paybackTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {publicJs.AddressToShow(fullData?.paybackTx)}
                    </a>
                  </dd>
                </Line>
                <Line>
                  <dt>{t("Credit.RepayTime")}</dt>
                  <dd>{fullData?.paybackTime}</dd>
                </Line>
              </DetailLines>
            </>
          )}
        </DetailBox>
      </LayoutContainer>
    </Layout>
  );
}

const LayoutContainer = styled.div`
  padding: 20px 10px 0;
  .id {
    color: #718ebf;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 30px;
  }
`;

const DetailBox = styled.div`
  background-color: #fff;
  border: 1px solid rgba(233, 235, 237, 0.5);
  box-shadow: 2px 4px 4px 0px rgba(211, 206, 221, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const TotalBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  .amount {
    color: #1814f3;
    font-size: 24px;
    font-weight: 600;
    font-family: Inter-SemiBold;
    line-height: 25px;
  }
`;

const DetailLines = styled.div``;

const Line = styled.dl`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-block: 7px;
  dt {
    font-weight: 400;
    color: #718ebf;
  }
  dd {
    color: #343c6a;
  }
  .hash {
    color: #1814f3;
  }
  .total {
    font-size: 16px;
    font-weight: 600;
    font-family: "Inter-SemiBold";
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #718ebf;
  margin-block: 20px;
`;

const RepayTtile = styled.div`
  color: #343c6a;
  font-size: 16px;
  font-family: Inter-SemiBold;
  font-weight: 600;
  margin-bottom: 8px;
`;

const NoData = styled.span`
  color: red;
`;
