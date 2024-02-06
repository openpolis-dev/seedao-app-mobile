import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { getMyProjects, getProjects } from "api/project";
import { useNavigate } from "react-router-dom";
import Tab from "components/common/tab";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectOrGuildItemDetail from "components/projectOrGuild/projectOrGuildItemDetail";
import store from "store";
import { saveCache, saveDetail, saveLoading } from "store/reducer";
import NoItem from "components/noItem";
import useCurrentPath from "../../hooks/useCurrentPath";
import { useSelector } from "react-redux";
import useQuerySNS from "hooks/useQuerySNS";
import { ethers } from "ethers";
import { getUsers } from "../../api/user";

export default function Project() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [proList, setProList] = useState([]);
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const prevPath = useCurrentPath();
  const cache = useSelector((state) => state.cache);

  const { getMultiSNS } = useQuerySNS();
  // const [snsMap, setSnsMap] = useState({});
  // const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const _list = [
      {
        label: t("Project.AllProjects"),
        value: 0,
      },
      // {
      //   label: t("Project.Closed"),
      //   value: 1,
      // },
      {
        label: t("Project.JoinedProjects"),
        id: 2,
      },
    ];
    setList(_list);
  }, [t]);

  useEffect(() => {
    if (cache?.type === "project" && cache?.pageCur > pageCur) return;
    getCurrentList(true);
  }, [activeTab, cache]);

  useEffect(() => {
    if (!prevPath || prevPath?.indexOf("/project/info") === -1 || cache?.type !== "project") return;
    const { activeTab, proList, pageCur, height } = cache;
    setActiveTab(activeTab);
    setProList(proList);
    setPageCur(pageCur);

    setTimeout(() => {
      const id = prevPath.split("/project/info/")[1];
      const element = document.querySelector(`#inner`);
      const targetElement = document.querySelector(`#project_${id}`);
      if (targetElement) {
        element.scrollTo({
          top: height,
          behavior: "auto",
        });
      }
      store.dispatch(saveCache(null));
    }, 0);
  }, [prevPath]);

  const getUsersDetail = async (dt) => {
    const _wallets = [];
    dt?.forEach((key) => {
      if (key.sponsors?.length) {
        let w = key.sponsors[0];
        if (ethers.utils.isAddress(w)) {
          _wallets.push(w);
        }
      }
    });
    const wallets = Array.from(new Set(_wallets));
    let rt = await getUsersInfo(wallets);
    let userSns = await getMultiSNS(wallets);

    return {
      userMap: rt,
      userSns,
    };
    // setSnsMap(userSns);
  };

  const getUsersInfo = async (wallets) => {
    try {
      const res = await getUsers(wallets);
      const userData = {};
      res.data?.forEach((r) => {
        userData[(r.wallet || "").toLowerCase()] = r;
      });
      // setUserMap(userData);
      return userData;
    } catch (error) {
      logError("getUsersInfo error:", error);
    } finally {
    }
  };

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
    useGlobalLoading && store.dispatch(saveLoading(true));

    const obj = {
      status: "open,pending_close,closed",
      page: pageCur,
      size: pageSize,
      sort_order: "desc",
      sort_field: "create_ts",
    };
    const rt = await getProjects(obj);

    store.dispatch(saveLoading(false));
    const { rows, page, size, total } = rt.data;

    let userRT = await getUsersDetail(rows);
    const { userMap, userSns } = userRT;

    rows.map((d) => {
      let m = d.sponsors[0];
      if (m) {
        d.user = userMap[m];
        d.sns = userSns[m];
      }
    });

    setProList([...proList, ...rows]);
    setPageSize(size);
    setTotal(total);
    setPageCur(page + 1);
  };

  const getMyList = async () => {
    store.dispatch(saveLoading(true));
    const obj = {
      page: pageCur,
      size: pageSize,
      sort_order: "desc",
      sort_field: "created_at",
    };
    const rt = await getMyProjects(obj);
    store.dispatch(saveLoading(false));

    const { rows, page, size, total } = rt.data;

    let userRT = await getUsersDetail(rows);
    const { userMap, userSns } = userRT;

    rows.map((d) => {
      let m = d.sponsors[0];
      if (m) {
        d.user = userMap[m];
        d.sns = userSns[m];
      }
    });

    setProList([...proList, ...rows]);
    setPageSize(size);
    setTotal(total);
    setPageCur(page + 1);
  };

  const StorageList = () => {
    const element = document.querySelector(`#inner`);
    const height = element.scrollTop;
    let obj = {
      type: "project",
      activeTab,
      proList,
      pageCur,
      height,
    };
    store.dispatch(saveCache(obj));
  };
  const openDetail = (id) => {
    StorageList(id);
    navigate(`/project/info/${id}`);
  };

  const getCurrentList = (useGlobalLoading) => {
    if (activeTab === 0) {
      getList(useGlobalLoading);
    } else {
      getMyList(useGlobalLoading);
    }
  };

  return (
    <Layout title={t("Project.Projects")}>
      <div style={{ marginTop: "14px" }}>
        <Tab data={list} value={activeTab} onChangeTab={handleTabChange} />
      </div>
      <LayoutContainer>
        <InfiniteScroll
          scrollableTarget="inner"
          dataLength={proList.length}
          next={getCurrentList}
          hasMore={hasMore}
          loader={<></>}
        >
          {proList.length === 0 && <NoItem />}
          <ProjectList>
            {proList.map((item) => (
              <div key={item.id} id={`project_${item.id}`}>
                <ProjectOrGuildItemDetail key={item.id} data={item} onClickItem={openDetail} />
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
  /* height: calc(100vh - 90px); */
`;
