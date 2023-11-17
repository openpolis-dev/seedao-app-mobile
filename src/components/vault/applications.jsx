import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import RankIcon from "assets/Imgs/vault/rank.svg";
import { formatTime } from "utils/time";
import { formatNumber } from "utils/number";
import { getApplications } from "api/applications";
import useQuerySNS from "hooks/useQuerySNS";
import ApplicationItem from "./applicantionItem";

export default function ApplicationsSection() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);

  const [selectStatus, setSelectStatus] = useState();
  const [selectMap, setSelectMap] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [selectSeason, setSelectSeason] = useState();
  const [snsMap, setSnsMap] = useState(new Map());

  const { getMultiSNS } = useQuerySNS();

  const handleSNS = async (wallets) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getRecords = async () => {
    try {
      const queryData = {};
      if (selectStatus) queryData.state = selectStatus;
      if (selectSeason) {
        queryData.season_id = selectSeason;
      }

      const res = await getApplications(
        {
          page,
          size: pageSize,
          sort_field: "created_at",
          sort_order: "desc",
        },
        queryData,
      );
      setTotal(res.data.total);
      const _wallets = new Set();
      res.data.rows.forEach((item) => {
        _wallets.add(item.target_user_wallet);
        _wallets.add(item.submitter_wallet);
        item.reviewer_wallet && _wallets.add(item.reviewer_wallet);
      });
      handleSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item, idx) => ({
        ...item,
        created_date: formatTime(item.created_at),
        transactions: item.transaction_ids.split(","),
        asset_display: formatNumber(Number(item.amount)) + " " + item.asset_name,
        submitter_name: item.submitter_wallet?.toLocaleLowerCase(),
        reviewer_name: item.reviewer_wallet?.toLocaleLowerCase(),
        receiver_name: item.target_user_wallet?.toLocaleLowerCase(),
      }));
      setList(_list);
    } catch (error) {
      console.error("getRecords error", error);
    } finally {
    }
  };

  useEffect(() => {
    // getRecords();
  }, []);
  return (
    <ApplicantsSectionBlock>
      <SectionTitle>
        <div>{t("Vault.SendRecordTitle")}</div>
        <SectionTitleRight>
          <img src={RankIcon} alt="" />
          <span>{t("Vault.ScrRanking")}</span>
        </SectionTitleRight>
      </SectionTitle>
      <ApplicationItem />
      <ApplicationItem />
      <ApplicationItem />
    </ApplicantsSectionBlock>
  );
}

const ApplicantsSectionBlock = styled.section``;
const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 22px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1323;
  line-height: 22px;
`;

const SectionTitleRight = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color);
  gap: 4px;
`;
