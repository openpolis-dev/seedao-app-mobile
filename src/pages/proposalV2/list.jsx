import styled from "styled-components";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "store";
import { saveLoading } from "store/reducer";

import { useEffect, useState } from "react";
import Layout from "components/layout/layout";
import Loading from "components/common/loading";
import NoItem from "components/noItem";
import ProposalItem from "components/proposalCom/proposalItem";
import { ProposalState } from "constant/proposal";
import useProposalCategories from "hooks/useProposalCategories";
import { getProposalList } from "api/proposalV2";
import SeeSelect from "components/common/select";
import SearchImg from "assets/Imgs/search.svg";
import useQuerySNS from "hooks/useQuerySNS";
import publicJs from "utils/publicJs";
import { useSelector } from "react-redux";
import SearchRhtImg from "../../assets/Imgs/searchRht.svg";

const PAGE_SIZE = 10;

export default function ProposalList() {
  const { t } = useTranslation();
  const snsMap = useSelector((state) => state.snsMap);

  const proposalCategories = useProposalCategories();
  // filter category
  const CATEGORY_OPTIONS = [{ value: undefined, label: t("Proposal.TypeSelectHint") }].concat(
    proposalCategories.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  );
  // filter time
  const TIME_OPTIONS = [
    { value: "desc", label: t("Proposal.TheNeweset") },
    { value: "asc", label: t("Proposal.TheOldest") },
  ];
  // filter status
  const STATUS_OPTIONS = [
    { value: undefined, label: t("Proposal.StatusSelectHint") },
    { value: ProposalState.Voting, label: t("Proposal.Voting") },
    { value: ProposalState.Draft, label: t("Proposal.Draft") },
    { value: ProposalState.Rejected, label: t("Proposal.Rejected") },
    { value: ProposalState.Withdrawn, label: t("Proposal.WithDrawn") },
    { value: ProposalState.VotingPassed, label: t("Proposal.Passed") },
    { value: ProposalState.VotingFailed, label: t("Proposal.Failed") },
  ];

  const [selectCategory, setSelectCategory] = useState();
  const [selectTime, setSelectTime] = useState(TIME_OPTIONS[0]);
  const [selectStatus, setSelectStatus] = useState();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");

  const [proposalList, setProposalList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [initPage, setInitPage] = useState(true);

  const [showModal,setShowModal] = useState(false);

  const hasMore = proposalList.length < totalCount;
  const { getMultiSNS } = useQuerySNS();

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      setSearchKeyword(e.target.value);
    }
  };
  const onChangeKeyword = (e) => {
    const v = e.target.value;
    setInputKeyword(v);
    !v && searchKeyword && setSearchKeyword("");
  };

  const getProposals = async (init = false) => {
    store.dispatch(saveLoading(true));
    const _page = init ? 1 : page;
    try {
      const resp = await getProposalList({
        page: _page,
        size: PAGE_SIZE,
        sort_order: selectTime.value,
        sort_field: "create_ts",
        state: selectStatus?.value,
        category_id: selectCategory?.value,
        q: searchKeyword,
      });
      let new_list;
      _page === 1 ? (new_list = resp.data.rows) : (new_list = [...proposalList, ...resp.data.rows]);
      setProposalList(new_list);
      getMultiSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
      setTotalCount(resp.data.total);
      setPage(_page + 1);
    } catch (error) {
      logError("getAllProposals failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (!initPage) {
      getProposals(true);
      setPage(1);
    }
  }, [selectStatus, selectTime, selectCategory, searchKeyword]);

  useEffect(() => {
    initPage && getProposals();
    setInitPage(false);
  }, [page]);

  const formatSNS = (wallet) => {
    const name = snsMap[wallet] || wallet;
    return name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4);
  };

  const handleTime = (item) =>{
    setSelectTime(item)
    setShowModal(false)
  }

  const handleType = (item) =>{
    setSelectCategory(item)
    setShowModal(false)
  }
  const handleClose = () =>{
    setShowModal(false)
  }

  return (
    <Layout title={t("Proposal.Governance")} headBgColor={`var(--background-color)`} bgColor="var(--background-color)">
      <FilterBox>
        <SearchInputBox>
          <img src={SearchImg} alt="" />
          <InputStyle
            value={inputKeyword}
            onChange={onChangeKeyword}
            type="search"
            enterKeyHint="search"
            placeholder={t("General.Search")}
            onKeyUp={onKeyUp}
          />
          <img src={SearchRhtImg} alt="" className="srht" onClick={() => setShowModal(true)} />
        </SearchInputBox>
        {showModal && (
          <Modal onClick={handleClose}>
            <FilterMask>
              <ModalContent>
                <ListBox>
                  <dt>{t("Proposal.Time")}</dt>
                  <dd>
                    <ul>
                      {TIME_OPTIONS.map((item, index) => (
                        <li key={`time_${index}`} onClick={() => handleTime(item)}>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </ListBox>
                <ListBox>
                  <dt>{t("Proposal.Category")}</dt>
                  <dd>
                    <ul>
                      {CATEGORY_OPTIONS.map((item, index) => (
                        <li className="w50" key={`cat_${index}`} onClick={() => handleType(item)}>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </ListBox>
                <ListBox>
                  <dt>{t("Proposal.State")}</dt>
                  <dd>
                    <ul>
                      {STATUS_OPTIONS.map((item, index) => (
                        <li key={`status_${index}`} onClick={() => handleType(item)}>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </ListBox>
              </ModalContent>
            </FilterMask>
          </Modal>
        )}

        {/*<SelectBox>*/}
        {/*  <li>*/}
        {/*    <FilterSelect*/}
        {/*      width="100%"*/}
        {/*      options={TIME_OPTIONS}*/}
        {/*      defaultValue={TIME_OPTIONS[0]}*/}
        {/*      isClearable={false}*/}
        {/*      isSearchable={false}*/}
        {/*      placeholder={t("Application.SelectStatus")}*/}
        {/*      onChange={(v) => setSelectTime(v)}*/}
        {/*    />*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <FilterSelect*/}
        {/*      width="100%"*/}
        {/*      options={CATEGORY_OPTIONS}*/}
        {/*      defaultValue={CATEGORY_OPTIONS[0]}*/}
        {/*      closeClear={true}*/}
        {/*      isSearchable={false}*/}
        {/*      placeholder={t("Proposal.TypeSelectHint")}*/}
        {/*      onChange={(v) => setSelectCategory(v)}*/}
        {/*    />*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <FilterSelect*/}
        {/*      width="100%"*/}
        {/*      options={STATUS_OPTIONS}*/}
        {/*      defaultValue={STATUS_OPTIONS[0]}*/}
        {/*      closeClear={true}*/}
        {/*      isSearchable={false}*/}
        {/*      placeholder={t("Proposal.StatusSelectHint")}*/}
        {/*      onChange={(v) => setSelectStatus(v)}*/}
        {/*    />*/}
        {/*  </li>*/}
        {/*</SelectBox>*/}
      </FilterBox>
      <ProposalBox>
        <InfiniteScroll
          scrollableTarget="inner"
          dataLength={proposalList.length}
          next={getProposals}
          hasMore={hasMore}
          loader={<Loading />}
        >
          {proposalList.length === 0 && <NoItem />}
          {proposalList.map((p) => (
            <div id={`pro_${p.id}`} key={p.id}>
              <ProposalItem data={p} sns={formatSNS(p.applicant?.toLocaleLowerCase())} />
            </div>
          ))}
        </InfiniteScroll>
      </ProposalBox>
    </Layout>
  );
}


const ListBox = styled.dl`
  margin-bottom: 20px;
  dt{
    font-size: 16px;
    margin-bottom: 10px;
    font-family: 'Poppins-Medium';
  }
  ul{
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    li{
      border: 1px solid var(--primary-color);
      border-radius: 50px;
      padding-block: 5px;
      width: 31%;
      box-sizing: border-box;
      text-align: center;
      margin-bottom: 10px;
      &:last-child{
        margin-right: auto;
      }
      &.w50{
        width: 48%;
        &:last-child{
          margin-left: 0;
          margin-right: 0;
        }
      }
    }
  }
`


const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 24px;
  padding-inline: 22px;
  padding-bottom: 29px;
  box-sizing: border-box;
`;

const FilterMask = styled.div`

  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`


const FilterBox = styled.div`
  padding-inline: 20px;
`;
const ProposalBox = styled.div`
  padding-inline: 20px;
  overflow-y: auto;
`;

const SelectBox = styled.ul`
  display: flex;
  gap: 10px;
  margin-bottom: 9px;
  li {
    flex: 1;
  }
`;

const SearchInputBox = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  background: #e2e2ee;
  border-radius: 20px;
  gap: 8px;
  padding: 0 16px;
  box-sizing: border-box;
  .srht{
    width: 18px;
    height: 16px;
  }
`;

const InputStyle = styled.input`
  flex-grow: 1;
  background: transparent;
  border: none;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: -3px;

  &:focus-visible {
    outline: none;
  }
`;

const FilterSelect = styled(SeeSelect)`
  height: 26px !important;
  [class$="-control"] {
    height: 26px !important;
  }
  [class$="-control"],
  [class$="-option"] {
    font-size: 12px !important;
  }
`;
