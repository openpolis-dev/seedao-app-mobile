import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import Layout from "components/layout/layout";
import ProposalCard from "components/proposal/proposalCard";
import { getProposalsBySubCategory } from "api/proposal";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "store";
import {saveCache, saveLoading} from "store/reducer";
import Loading from "components/common/loading";
import { useTranslation } from "react-i18next";
import NoItem from "../../components/noItem";
import ProposalSubNav from "components/proposal/proposalSubNav";
import useProposalCategory from "hooks/useProposalCategory";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";

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


  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/proposal/thread") === -1 || cache?.type!== "proposal" )return;

    const { proposals,category, page,height} = cache;

    setcategory(category);
    setProposals(proposals);
    setPage(page);

    setTimeout(()=>{
      const id = prevPath.split("/proposal/thread/")[1];
      const element = document.querySelector(`#inner`)
      const targetElement = document.querySelector(`#pro_${id}`);
      if (targetElement) {
        element.scrollTo({
          top: height ,
          behavior: 'auto',
        });
      }
      store.dispatch(saveCache(null))
    },0)
  },[prevPath])

  const getProposals = async () => {
    const _id = Number(id);
    // console.log("_id", _id);
    if (!_id) {
      return;
    }
    store.dispatch(saveLoading(true));
    // const _page = init ? 1 : page;
    try {
      const res = await getProposalsBySubCategory({
        page: page,
        per_page: pageSize,
        category_index_id: _id,
        sort: orderType,
      });
      if (res?.data?.threads?.length) {
        setcategory(res.data.threads[0].category_name);
      } else {
        setcategory(t("Proposal.Governance"));
      }

      // setProposals( init ? res.data.threads : [...proposals, ...res.data.threads]);
      setProposals( [...proposals, ...res.data.threads]);
      setHasMore(res.data.threads.length >= pageSize);
      setPage(page + 1);
    } catch (error) {
      logError(error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const StorageList = (id) =>{
    const element = document.querySelector(`#inner`)
    const height = element.scrollTop;

    logError(height)
    let obj={
      type:"proposal",
      category,
      page,
      proposals,
      height
    }
    store.dispatch(saveCache(obj))
  }

  useEffect(() => {

    if(cache?.type==="proposal" && cache?.page>page)return;
    id && getProposals(true);
  }, [id, orderType,cache]);
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
              <div id={`pro_${p.id}`} key={p.id}>
                <ProposalCard data={p} StorageList={StorageList}  />
              </div>
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
