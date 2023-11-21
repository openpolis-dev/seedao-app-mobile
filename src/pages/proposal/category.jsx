import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import Layout from "components/layout/layout";
import ProposalCard from "components/proposal/proposalCard";
import { getProposalsBySubCategory } from "api/proposal";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "store";
import { saveLoading } from "store/reducer";
import Loading from "components/common/loading";
import { useTranslation } from "react-i18next";
import NoItem from "../../components/noItem";
import ProposalSubNav from "components/proposal/proposalSubNav";
import useProposalCategory from "hooks/useProposalCategory";

export default function ProposalCategory() {
  const { id } = useParams();
  const { state } = useLocation();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState([]);
  const [orderType, setOrderType] = useState("new");
  const [hasMore, setHasMore] = useState(false);
  const [category, setcategory] = useState(state);

  const ProposalNav = useProposalCategory(Number(id));

  const getProposals = async (init) => {
    const _id = Number(id);
    // console.log("_id", _id);
    if (!_id) {
      return;
    }
    store.dispatch(saveLoading(true));
    const _page = init ? 1 : page;
    try {
      const res = await getProposalsBySubCategory({
        page: _page,
        per_page: pageSize,
        category_index_id: _id,
        sort: orderType,
      });
      if (res?.data?.threads?.length) {
        setcategory(res.data.threads[0].category_name);
      } else {
        setcategory(t("Proposal.Governance"));
      }

      console.log(res);
      setProposals( init ? res.data.threads : [...proposals, ...res.data.threads]);
      setHasMore(res.data.threads.length >= pageSize);
      setPage(_page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    id && getProposals(true);
  }, [id, orderType]);
  return (
    <Layout title={category} headBgColor="var(--background-color)" bgColor="var(--background-color)">
      <HeadBox>
        {ProposalNav}
        <ProposalSubNav value={orderType} onSelect={(v) => setOrderType(v)} />
      </HeadBox>
      <ProposalBox>
        <InfiniteScroll
          scrollableTarget="inner"
          dataLength={proposals.length}
          next={getProposals}
          hasMore={hasMore}
          loader={<Loading />}
        >
          {proposals.length === 0 && <NoItem />}
          {proposals.map((p) => (
            <ProposalCard key={p.id} data={p} />
          ))}
        </InfiniteScroll>
      </ProposalBox>
    </Layout>
  );
}

const ProposalBox = styled.div`
  padding: 15px 20px 0;
  overflow-y: auto;
`;

const HeadBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  margin-top: 20px;
`;
