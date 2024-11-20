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
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import InfiniteScroll from "react-infinite-scroll-component";

import { Type as ListType, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import ApplicationStatusTag from "components/applicationStatusTag";
import publicJs from "utils/publicJs";
import sns from "@seedao/sns-js";

import store from "store";
import {saveCache, saveLoading} from "store/reducer";
import useToast from "hooks/useToast";
import Avatar from "components/common/avatar";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";
import getConfig from "../../constant/envCofnig";

export default function ApplicationsSection({ handleBg }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);
  const snsMap = useSelector((state) => state.snsMap);

  const { getMultiSNS } = useQuerySNS();

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
      getMultiSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item, idx) => ({
        ...item,
        created_date: formatTime(item.created_at),
        transactions: item.transaction_ids.split(","),
        asset_display: Number(item.amount).format() + " " + item.asset_name,
        submitter_name: item.submitter_wallet,
        reviewer_name: item.reviewer_wallet,
        receiver_name: item.target_user_wallet,
      }));
      setList(init ? _list : [...list, ..._list]);
      setPage(_page + 1);
    } catch (error) {
      logError("getRecords error", error);
    } finally {
    }
  };

  useEffect(() => {
    if(cache?.type==="assets" && cache?.page>page)return;
    getRecords(true);
  }, [selectAsset, selectSeason, selectStatus, searchVal]);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/assets/application") === -1 || cache?.type!== "assets" )return;

    const { list, page,height,id} = cache;

    setList(list);
    setPage(page);

    setTimeout(()=>{
      const element = document.querySelector(`#inner`)
      // const targetElement = document.querySelector(`#assets_${id}`);
        element.scrollTo({
          top: height ,
          behavior: 'auto',
        });

    },0)
  },[prevPath])


  const StorageList = (item) =>{

    const element = document.querySelector(`#inner`)
    const height =element.scrollTop;
    let obj={
      type:"assets",
      id:item.application_id,
      list,
      page,
      height
    }
    store.dispatch(saveCache(obj))
  }
  const openDetail = (item) => {
    StorageList(item)
    navigate("/assets/application", { state: item });
  };
  const handleSearch = async () => {
    if (keyword.endsWith(".seedao")) {
      // sns
      store.dispatch(saveLoading(true));
      const w = await sns.resolve(keyword,getConfig().NETWORK.rpcs[0]);
      if (w && w !== ethers.constants.AddressZero) {
        setSearchVal(w?.toLocaleLowerCase());
      } else {
        showToast(t("Msg.SnsNotFound"));
      }
      store.dispatch(saveLoading(false));
    } else if (ethers.utils.isAddress(keyword)) {
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
    const sns = snsMap[wallet.toLocaleLowerCase()] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns);
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

      <BoxList>


      <InfiniteScroll scrollableTarget="inner" dataLength={list.length} next={getRecords} hasMore={hasMore}>
        <SwipeableList threshold={0.5} type={ListType.IOS}>
          {list.map((data, index) => (
            // <ApplicationItem data={item} key={index} onCheck={() => openDetail(item)} />
            <SwipeableListItem trailingActions={trailingActions(data)} key={index}   id={`assets_${data.application_id}`}>
              <ItemBox>
                <ContentInnerBox>
                  <LeftBox>
                    <Avatar size="34px" src={data.target_user_avatar} />
                    <div>
                      <div className="wallet">{formatSNS(data.target_user_wallet)}</div>
                      <div>
                        <ApplicationStatusTag status={data.status} />
                      </div>
                    </div>
                  </LeftBox>
                  <RightBox>
                    <div className="value">{data.asset_display}</div>
                    <div className="from">{t("Governance.Cityhall", { season: data.season_name })}</div>
                  </RightBox>
                </ContentInnerBox>
              </ItemBox>
            </SwipeableListItem>
          ))}
        </SwipeableList>
      </InfiniteScroll>
      </BoxList>
      {Toast}
    </ApplicantsSectionBlock>
  );
}

const BoxList = styled.div`
  margin-right: -20px;
`

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
    padding-right: 20px;
  }
  .from {
    font-size: 12px;
    line-height: 14px;
    color: #9ca1b3;
    margin-top: 5px;
    padding-right: 20px;

  }
`;
