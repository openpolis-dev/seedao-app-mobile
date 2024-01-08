import styled from "styled-components";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "store";
import { saveLoading } from "store/reducer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Layout from "components/layout/layout";
import Loading from "components/common/loading";
import NoItem from "components/noItem";
import ProposalItem from "components/proposalCom/proposalItem";
import { ProposalState } from "constant/proposal";
import useProposalCategories from "hooks/useProposalCategories";
import { getProposalList } from "api/proposalV2";
import SeeSelect from "components/common/select";

const PAGE_SIZE = 10;

export default function ProposalList() {
  const { t } = useTranslation();

  const proposalCategories = useProposalCategories();
  // filter category
  const CATEGORY_OPTIONS = proposalCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  // filter time
  const TIME_OPTIONS = [
    { value: "desc", label: t("Proposal.TheNeweset") },
    { value: "asc", label: t("Proposal.TheOldest") },
  ];
  // filter status
  const STATUS_OPTIONS = [
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

  const hasMore = proposalList.length < totalCount;

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

  const getProposals = async (_page = 1) => {
    store.dispatch(saveLoading(true));

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
      setProposalList(resp.data.rows);
      //   handleSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
      setTotalCount(resp.data.total);
    } catch (error) {
      logError("getAllProposals failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (!initPage) {
      getProposals();
      setPage(1);
    }
  }, [selectStatus, selectTime, selectCategory, searchKeyword]);

  useEffect(() => {
    initPage && getProposals();
    setInitPage(false);
  }, [page]);

  return (
    <Layout title={t("Proposal.Governance")} headBgColor={`var(--background-color)`} bgColor="var(--background-color)">
      <FilterBox>
        <SearchInputBox>
          <InputStyle
            value={inputKeyword}
            onChange={onChangeKeyword}
            type="search"
            enterKeyHint="search"
            placeholder={t("General.Search")}
            onKeyUp={onKeyUp}
          />
        </SearchInputBox>
        <SelectBox>
          <li>
            <FilterSelect
              width="100%"
              options={TIME_OPTIONS}
              defaultValue={TIME_OPTIONS[0]}
              isClearable={false}
              isSearchable={false}
              placeholder={t("Application.SelectStatus")}
              onChange={(v) => setSelectTime(v)}
            />
          </li>
          <li>
            <FilterSelect
              width="100%"
              options={CATEGORY_OPTIONS}
              closeClear={true}
              isSearchable={false}
              placeholder={t("Proposal.TypeSelectHint")}
              onChange={(v) => setSelectCategory(v)}
            />
          </li>
          <li>
            <FilterSelect
              width="100%"
              options={STATUS_OPTIONS}
              closeClear={true}
              isSearchable={false}
              placeholder={t("Proposal.StatusSelectHint")}
              onChange={(v) => setSelectStatus(v)}
            />
          </li>
        </SelectBox>
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
              <ProposalItem data={p} />
            </div>
          ))}
        </InfiniteScroll>
      </ProposalBox>
    </Layout>
  );
}

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
`;

const InputStyle = styled.input`
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #e2e2ee;
  border-radius: 20px;
  padding-left: 6px;
  border: none;
  font-size: 10px;
  box-sizing: border-box;
  overflow-x: auto;

  &:focus-visible {
    outline: none;
  }
`;

const FilterSelect = styled(SeeSelect)`
  height: 26px !important;
`