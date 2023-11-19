import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import RankIcon from "assets/Imgs/vault/rank.svg";
import { formatTime } from "utils/time";
import { formatNumber } from "utils/number";
import { getApplications } from "api/applications";
import useQuerySNS from "hooks/useQuerySNS";
import ApplicationItem from "./applicantionItem";
import useSeasons from "hooks/useSeasons";
import SeeSelect from "components/common/select";
import useApplicationStatus from "hooks/useApplicationStatus";
import useAssets from "hooks/useAssets";
import SearchIcon from "assets/Imgs/search.svg";
import { Link } from "react-router-dom";
import ApplicationDetailPage from "./applicationDetail";

export default function ApplicationsSection() {
  const { t } = useTranslation();

  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);

  // status
  const statusList = useApplicationStatus();
  const [selectStatus, setSelectStatus] = useState();
  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState();
  // assets
  const assets = useAssets();
  const [selectAsset, setSelectAsset] = useState();

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
    getRecords();
  }, []);
  return (
    <ApplicantsSectionBlock>
      {showDetail && <ApplicationDetailPage handleClose={() => setShowDetail(undefined)} />}
      <SectionTitle>
        <div>{t("Vault.SendRecordTitle")}</div>
        <SectionTitleRight to="/ranking">
          <img src={RankIcon} alt="" />
          <span>{t("Vault.ScrRanking")}</span>
        </SectionTitleRight>
      </SectionTitle>
      <FilterBox>
        <div style={{ flex: 6 }}>
          <SearchInputBox>
            <img src={SearchIcon} alt="" className="search" />
            <InputStyle type="text" placeholder={t("Application.SearchSNSPlaceholder")} />
          </SearchInputBox>
        </div>
        <div style={{ flex: 2 }}>
          <SeasonSelect
            width="100%"
            options={seasons}
            closeClear={true}
            isSearchable={false}
            placeholder=""
            onChange={(value) => {
              setSelectSeason(value?.value);
              setPage(1);
            }}
          />
        </div>
        <div style={{ flex: 3 }}>
          <SeasonSelect
            width="100%"
            options={statusList}
            closeClear={true}
            isSearchable={false}
            placeholder=""
            onChange={(value) => {
              setSelectStatus(value?.value);
              setPage(1);
            }}
          />
        </div>
        <div style={{ flex: 3 }}>
          <SeasonSelect
            width="100%"
            options={assets}
            closeClear={true}
            isSearchable={false}
            placeholder=""
            onChange={(value) => {
              setSelectAsset(value?.value);
              setPage(1);
            }}
          />
        </div>
      </FilterBox>
      {list.map((item, index) => (
        <ApplicationItem data={item} key={index} onCheck={() => setShowDetail(true)} />
      ))}
    </ApplicantsSectionBlock>
  );
}

const ApplicantsSectionBlock = styled.section`
  min-height: 300px;
`;
const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 22px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1323;
  line-height: 22px;
`;

const SectionTitleRight = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color);
  gap: 4px;
`;

const FilterBox = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 17px;
  align-items: center;
`;

const SeasonSelect = styled(SeeSelect)`
  width: 46px;
`;

const SearchInputBox = styled.div`
  width: 100%;
  position: relative;
  img.search {
    position: absolute;
    left: 6px;
    top: 7px;
  }
`;

const InputStyle = styled.input`
  width: 100%;
  height: 24px;
  line-height: 24px;
  background: #e2e2ee;
  border-radius: 6px;
  padding-left: 24px;
  border: none;
  font-size: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  &:focus-visible {
    outline: none;
  }
`;
