import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import ApplicationStatusTag from "components/applicationStatusTag";
import { formatDate } from "utils/time";
import Avatar from "components/common/avatar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuerySNS from "hooks/useQuerySNS";
import publicJs from "utils/publicJs";

const UserComp = ({ avatar, sns }) => {
  return (
    <UserBox>
      <Avatar src={avatar} size="24px" />
      <span>{sns}</span>
    </UserBox>
  );
};

export default function ApplicationDetailPage() {
  const { t } = useTranslation();
  const { state: data } = useLocation();

  const [snsMap, setSnsMap] = useState(new Map());

  const { getMultiSNS } = useQuerySNS();

  useEffect(() => {
    const handleSNS = async () => {
      try {
        const _wallets = new Set();
        _wallets.add(data.target_user_wallet);
        data.applicant_wallet && _wallets.add(data.applicant_wallet);
        data.reviewer_wallet && _wallets.add(data.reviewer_wallet);
        const sns_map = await getMultiSNS(Array.from(_wallets));
        setSnsMap(sns_map);
      } catch (error) {
        console.error(error);
      }
    };
    handleSNS();
  }, [data]);



  const formatSNS = (wallet) => {
    const sns = snsMap[wallet] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns);
  };

  return (
    <LayoutOuter>
      <Layout title={t("Application.SendDetail")}>
        <AssetBox>{data.asset_display}</AssetBox>
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Recipient")}</div>
            <UserComp avatar={data.target_user_avatar} sns={formatSNS(data.target_user_wallet.toLowerCase())} />
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.OutVault")}</div>
            <div className="value">{t("Governance.CityhallPure")}</div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.State")}</div>
            <div className="value">
              <ApplicationStatusTag status={data.status} type="tag" />
            </div>
          </RowItem>
        </SectionBlock>
        <SectionDivider />
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Season")}</div>
            <div className="value">{data.season_name}</div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.BudgetSource")}</div>
            <div className="value">{data.budget_source}</div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.Items")}</div>
            <div className="value">{data.detailed_type}</div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.Comment")}</div>
            <div className="value">{data.comment}</div>
          </RowItem>
        </SectionBlock>
        <SectionDivider />
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Applicant")}</div>
            {data.applicant_wallet ? (
              <UserComp avatar={data.applicant_avatar} sns={formatSNS(data.applicant_wallet?.toLowerCase())} />
            ) : (
              <div className="value">-</div>
            )}
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.ApplyDate")}</div>
            <div className="value">{data.apply_ts ? formatDate(data.apply_ts * 1000) : "-"}</div>
          </RowItem>
          <ApplyIntroRowItem>
            <div className="label">{t("Application.ApplyIntro")}</div>
            <div className="value">{data.app_bundle_comment}</div>
          </ApplyIntroRowItem>
        </SectionBlock>
        <SectionDivider />
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Auditor")}</div>
            {data.reviewer_wallet ? (
              <UserComp avatar={data.reviewer_avatar} sns={formatSNS(data.reviewer_wallet?.toLowerCase())} />
            ) : (
              <div className="value">-</div>
            )}
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.AuditorDate")}</div>
            <div className="value">{data.review_ts ? formatDate(data.review_ts * 1000) : "-"}</div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.TransactionId")}</div>
            <div className="value">
              {data.transactions?.map((item, index) => {
                return item ? (
                  <TransactionTx key={index} href={`https://etherscan.io/tx/${item}`} target="_blank">
                    {item.slice(0, 8) + "..." + item.slice(-8)}
                  </TransactionTx>
                ) : (
                  "-"
                );
              })}
            </div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.TransactionDate")}</div>
            <div className="value">{data.complete_ts ? formatDate(data.complete_ts * 1000) : "-"}</div>
          </RowItem>
        </SectionBlock>
      </Layout>
    </LayoutOuter>
  );
}

const AssetBox = styled.div`
  font-size: 20px;
  font-family: "Poppins-Medium";
  font-weight: 500;
  color: #1a1323;
  line-height: 28px;
  margin-top: 20px;
  margin-bottom: 15px;
  text-align: center;
`;

const SectionBlock = styled.section`
  padding-top: 16px;
  font-size: 14px;
  padding-inline: 20px;
`;

const SectionDivider = styled.div`
  padding-inline: 20px;
  height: 1px;
  border-bottom: 1px solid var(--border-color-1);
  margin-inline: 20px;
`;

const RowItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 17px;
  line-height: 24px;
  .label {
    color: var(--font-light-color);
  }
  .value {
    max-width: 70%;
    word-wrap: break-word;
    text-align: right;
  }
`;
const ApplyIntroRowItem = styled(RowItem)`
  flex-direction: column;
  justify-content: flex-start;
  .value {
    max-width: 100%;
    margin-top: 8px;
    text-align: justify;
  }
`;
const LayoutOuter = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  box-sizing: border-box;
  background-color: #fff;

  .tabBarBox{
    padding-bottom: env(safe-area-inset-bottom);
  }
`;
const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TransactionTx = styled.a`
  display: block;
  text-decoration: underline;
`;
