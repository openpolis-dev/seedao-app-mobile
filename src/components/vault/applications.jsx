import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import RankIcon from "assets/Imgs/vault/rank.svg";
import { formatTime } from "utils/time";
import { formatNumber } from "utils/number";
import { getApplications } from "api/applications";
import useQuerySNS from "hooks/useQuerySNS";
import useSeasons from "hooks/useSeasons";
import SeeSelect from "components/common/select";
import useApplicationStatus from "hooks/useApplicationStatus";
import useAssets from "hooks/useAssets";
import { Link } from "react-router-dom";
import ApplicationDetailPage from "./applicationDetail";
import { ethers } from "ethers";
import InfiniteScroll from "react-infinite-scroll-component";

import { Type as ListType, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import ApplicationStatusTag from "components/applicationStatusTag";
import publicJs from "utils/publicJs";
import sns from "@seedao/sns-js";
import store from "store";
import { saveLoading } from "store/reducer";
import useToast from "hooks/useToast";
import Avatar from "components/common/avatar";

export default function ApplicationsSection({ handleBg }) {
  const { t } = useTranslation();

  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);

  const { Toast, showToast } = useToast();

  // status
  const statusList = useApplicationStatus();
  const [selectStatus, setSelectStatus] = useState();
  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState();
  // assets
  const assets = useAssets();
  const [selectAsset, setSelectAsset] = useState();
  // search
  const [keyword, setKeyword] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const [snsMap, setSnsMap] = useState(new Map());

  const { getMultiSNS } = useQuerySNS();

  const handleSNS = async (wallets) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const hasMore = useMemo(() => {
    return list.length < total;
  }, [total, list]);

  const getRecords = async (init) => {
    const _page = init ? 1 : page;
    try {
      const queryData = {};
      if (selectStatus) queryData.state = selectStatus;
      if (selectSeason) {
        queryData.season_id = selectSeason;
      }
      if (selectAsset) {
        queryData.asset_name = selectAsset;
      }
      if (searchVal) {
        queryData.user_wallet = searchVal;
      }

      const res = await getApplications(
        {
          page: _page,
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
        item.applicant_wallet && _wallets.add(item.applicant_wallet);
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
      setList(init ? _list : [...list, ..._list]);
      setPage(_page + 1);
    } catch (error) {
      console.error("getRecords error", error);
    } finally {
    }
  };

  useEffect(() => {
    getRecords(true);
  }, [selectAsset, selectSeason, selectStatus, searchVal]);
  const openDetail = (item) => {
    setShowDetail(item);
  };
  const closeDetail = () => {
    setShowDetail(undefined);
    handleBg && handleBg();
  };
  const handleSearch = async () => {
    if (keyword.endsWith(".seedao")) {
      // sns
      store.dispatch(saveLoading(true));
      const w = await sns.resolve(keyword);
      if (w) {
        setSearchVal(w?.toLocaleLowerCase());
      } else {
        showToast(t("Msg.SnsNotFound"));
      }
      store.dispatch(saveLoading(false));
    } else if (!ethers.utils.isAddress(keyword)) {
      // address
      setSearchVal(keyword?.toLocaleLowerCase());
    } else {
      showToast(t("Msg.InvalidAddress"));
    }
  };
  const onKeyUp = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      document.activeElement.blur();
      handleSearch();
    }
  };
  const onChangeKeyword = (e) => {
    const v = e.target.value;
    setKeyword(v);
    !v && searchVal && setSearchVal("");
  };

  const formatSNS = (wallet) => {
    const sns = snsMap[wallet] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns, 6);
  };

  const trailingActions = (item) => (
    <TrailingActions>
      <SwipeAction destructive={false} onClick={() => openDetail(item)}>
        <CheckButton>{t("Application.Check")}</CheckButton>
      </SwipeAction>
    </TrailingActions>
  );
  return (
    <ApplicantsSectionBlock>
      {showDetail && <ApplicationDetailPage data={showDetail} handleClose={closeDetail} formatSNS={formatSNS} />}
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
            <InputStyle
              value={keyword}
              onChange={onChangeKeyword}
              type="search"
              enterKeyHint="search"
              placeholder={t("Application.SearchSNSPlaceholder")}
              onKeyUp={onKeyUp}
            />
          </SearchInputBox>
        </div>
        <div style={{ flex: 3 }}>
          <SeasonSelect
            width="100%"
            options={seasons}
            closeClear={true}
            isSearchable={false}
            placeholder={t("Application.SelectSeason")}
            onChange={(value) => {
              setSelectSeason(value?.value);
            }}
          />
        </div>
        <div style={{ flex: 3 }}>
          <SeasonSelect
            width="100%"
            options={statusList}
            closeClear={true}
            isSearchable={false}
            placeholder={t("Application.SelectStatus")}
            onChange={(value) => {
              setSelectStatus(value?.value);
            }}
          />
        </div>
        <div style={{ flex: 3 }}>
          <SeasonSelect
            width="100%"
            options={assets}
            closeClear={true}
            isSearchable={false}
            placeholder={t("Application.SelectAsset")}
            onChange={(value) => {
              setSelectAsset(value?.value);
            }}
          />
        </div>
      </FilterBox>
      <InfiniteScroll scrollableTarget="inner" dataLength={list.length} next={getRecords} hasMore={hasMore}>
        <SwipeableList threshold={0.5} type={ListType.IOS}>
          {list.map((data, index) => (
            // <ApplicationItem data={item} key={index} onCheck={() => openDetail(item)} />
            <SwipeableListItem trailingActions={trailingActions(data)} key={index}>
              <ItemBox>
                <ContentInnerBox>
                  <LeftBox>
                    <Avatar size="34px" src={data.traget_user_avatar} />
                    <div>
                      <div className="wallet">{formatSNS(data.target_user_wallet)}</div>
                      <div>
                        <ApplicationStatusTag status={data.status} />
                      </div>
                    </div>
                  </LeftBox>
                  <RightBox>
                    <div className="value">{`${data.asset_display}`}</div>
                    <div className="from">{t("Governance.Cityhall", { season: data.season_name })}</div>
                  </RightBox>
                </ContentInnerBox>
              </ItemBox>
            </SwipeableListItem>
          ))}
        </SwipeableList>
      </InfiniteScroll>
      {Toast}
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
  padding-top: 17px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: var(--background-color);
`;

const SeasonSelect = styled(SeeSelect)`
  width: 46px;
`;

const SearchInputBox = styled.div`
  width: 100%;
  position: relative;
`;

const InputStyle = styled.input`
  width: 100%;
  height: 24px;
  line-height: 24px;
  background: #e2e2ee;
  border-radius: 6px;
  padding-left: 6px;
  border: none;
  font-size: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  &:focus-visible {
    outline: none;
  }
`;

const ItemBox = styled.div`
  min-width: 100%;
  height: 60px;
  border-bottom: 1px solid #e1e1eb;
  position: relative;
`;

const ContentInnerBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  left: 0;
  top: 0;
  transition: transform 0.3s ease;
`;

const CheckButton = styled.span`
  display: inline-block;
  line-height: 60px;
  background: var(--primary-color);
  text-align: center;
  font-size: 13px;
  color: #ffffff;
  white-space: nowrap;
  width: 100px;
`;

const LeftBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  .wallet {
    font-size: 14px;
  }
`;

const RightBox = styled.div`
  text-align: right;
  .value {
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
  .from {
    font-size: 12px;
    line-height: 14px;
    color: #9ca1b3;
    margin-top: 5px;
  }
`;
