import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import { getMyGuilds, getGuilds } from "api/guild";
import {useNavigate} from "react-router-dom";
import Tab from "components/common/tab";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectOrGuildItemDetail from "components/projectOrGuild/projectOrGuildItemDetail";
import store from "store";
import { saveLoading} from "store/reducer";
import Loading from "components/common/loading";
import NoItem from "components/noItem";
import {useSelector} from "react-redux";
import useCurrentPath from "../../hooks/useCurrentPath";
import {saveCache} from "store/reducer";

export default function Guild() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [proList, setProList] = useState([]);
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(() => {
    const _list = [
      {
        label: t("Guild.AllProjects"),
        value: 0,
      },
      {
        label: t("Guild.Joined"),
        id: 2,
      },
    ];
    setList(_list);
  }, [t]);

  useEffect(() => {
    if(cache?.type==="guild" && cache?.pageCur>pageCur)return;
    getCurrentList(true);
  }, [activeTab,cache]);

  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/guild/info") === -1 || cache?.type!== "guild" )return;

    const { activeTab, proList, pageCur,height} = cache;
    setActiveTab(activeTab)
    setProList(proList);
    setPageCur(pageCur);

    setTimeout(()=>{
      const id = prevPath.split("/guild/info/")[1];
      const element = document.querySelector(`#inner`)
      const targetElement = document.querySelector(`#guild_${id}`);
      if (targetElement) {
        element.scrollTo({
          top: height,
          behavior: 'auto',
        });
      }
      store.dispatch(saveCache(null))
    },0)

  },[prevPath])

  const handleTabChange = (v) => {
    setActiveTab(v);
    setPageCur(1);
    setTotal(0);
    setProList([]);
  };

  const hasMore = useMemo(() => {
    return proList.length < total;
  }, [total, proList]);

  const getList = async (useGlobalLoading) => {
    if (activeTab > 2) return;
    const stt = activeTab === 1 ? "closed" : "";
    useGlobalLoading && store.dispatch(saveLoading(true));
    const obj = {
      status: stt,
      page: pageCur,
      size: pageSize,
      sort_order: "desc",
      sort_field: "created_at",
    };
    try {
      const rt = await getGuilds(obj);
      const { rows, page, size, total } = rt.data;
      setProList([...proList, ...rows]);
      setPageSize(size);
      setTotal(total);
      setPageCur(page+1);
    } catch (error) {
      logError(error);
    } finally {
      useGlobalLoading && store.dispatch(saveLoading(false));
    }
  };

  const getMyList = async (useGlobalLoading) => {
    useGlobalLoading && store.dispatch(saveLoading(true));
    const obj = {
      page: pageCur,
      size: pageSize,
      sort_order: "desc",
      sort_field: "created_at",
    };
    try {
      const rt = await getMyGuilds(obj);
      const { rows, page, size, total } = rt.data;
      setProList([...proList, ...rows]);
      setPageSize(size);
      setTotal(total);
      setPageCur(page + 1);
    } catch (error) {
      logError(error);
    } finally {
      useGlobalLoading && store.dispatch(saveLoading(false));
    }
  };


  const StorageList = (id) =>{
    const element = document.querySelector(`#inner`)
    const height =element.scrollTop;
    let obj={
      type:"guild",
      activeTab,
      proList,
      pageCur,
      height
    }
    store.dispatch(saveCache(obj))
  }

  const openDetail = (id) => {
    StorageList(id);
    navigate(`/guild/info/${id}`);
  };

  const getCurrentList = (useGlobalLoading) => {
    if (activeTab < 2) {
      getList(useGlobalLoading);
    } else {
      getMyList(useGlobalLoading);
    }
  };





  return (
    <Layout title={t("Guild.Guild")}>
      <div style={{ marginTop: "14px" }}>
        <Tab data={list} value={activeTab} onChangeTab={handleTabChange} />
      </div>
      <LayoutContainer>
        <InfiniteScroll
          scrollableTarget="inner"
          dataLength={proList.length}
          next={getCurrentList}
          hasMore={hasMore}
          loader={<Loading />}
        >
          {proList.length === 0 && <NoItem />}
          <ProjectList>
            {proList.map((item) => (
                <div  key={item.id} id={`guild_${item.id}`} >
                  <ProjectOrGuildItemDetail data={item} onClickItem={openDetail} />
                </div>
            ))}
          </ProjectList>
        </InfiniteScroll>
      </LayoutContainer>
    </Layout>
  );
}

const ProjectList = styled.div`
  & > div {
    margin-bottom: 15px;
  }
`;

const LayoutContainer = styled.div`
  padding-inline: 20px;
  
`;
