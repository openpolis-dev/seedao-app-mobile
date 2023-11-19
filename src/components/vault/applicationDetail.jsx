import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import ApplicationStatusTag from "components/applicationStatusTag";

const UserComp = ({ avatar, sns }) => {
  return (
    <UserBox>
      <img src={avatar} alt="" />
      <span>{sns}</span>
    </UserBox>
  );
};

export default function ApplicationDetailPage({ data, formatSNS, handleClose }) {
  const { t } = useTranslation();
  return (
    <LayoutOuter>
      <Layout title={t("Application.SendDetail")} handleBack={handleClose}>
        <AssetBox>{data.asset_display}</AssetBox>
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Receiver")}</div>
            <UserComp avatar={""} sns={formatSNS(data.target_user_wallet.toLowerCase())} />
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
            <UserComp avatar={""} sns={formatSNS(data.submitter_wallet.toLowerCase())} />
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.ApplyDate")}</div>
            <div className="value"></div>
          </RowItem>
          <ApplyIntroRowItem>
            <div className="label">{t("Application.ApplyIntro")}</div>
            <div className="value">这是一笔必要的支出这是一笔必要的支出这是一笔必要的支出，这是一笔必要的支出</div>
          </ApplyIntroRowItem>
        </SectionBlock>
        <SectionDivider />
        <SectionBlock>
          <RowItem>
            <div className="label">{t("Application.Auditor")}</div>
            {data.reviewer_wallet && <UserComp avatar={""} sns={formatSNS(data.reviewer_wallet.toLowerCase())} />}
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.AuditorDate")}</div>
            <div className="value"></div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.TransactionId")}</div>
            <div className="value">
              {data.transactions?.map((item, index) => {
                return item ? (
                  <TransactionTx key={index} href={`https://etherscan.io/tx/${item}`} target="_blank">
                    {item.slice(0, 8) + "..." + item.slice(-8)}
                  </TransactionTx>
                ) : null;
              })}
            </div>
          </RowItem>
          <RowItem>
            <div className="label">{t("Application.TransactionDate")}</div>
            <div className="value"></div>
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
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background-color: #fff;
`;
const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const TransactionTx = styled.a`
  display: block;
  text-decoration: underline;
`;
