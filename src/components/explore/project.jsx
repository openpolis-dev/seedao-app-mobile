import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import ProjectOrGuildItem, { ProjectOrGuildItemSkeleton } from "components/projectOrGuild/projectOrGuildItem";
import { useEffect, useState } from "react";
import { getProjects } from "api/project";
import store from "../../store";
import {saveCache} from "../../store/reducer";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";
import PublicJs from "../../utils/publicJs";
import useToast from "../../hooks/useToast";

export default function ExploreProjectSection() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const { Toast, toast } = useToast();
  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/project/info") === -1 || cache?.type!== "explore_project" )return;

    const { list, height} = cache;
    setList(list);

    setTimeout(()=>{
      const element = document.querySelector(`#inner`)
      element.scrollTo({
        top: height,
        behavior: 'auto',
      });
      store.dispatch(saveCache(null))
    },0)
  },[prevPath])
  // const StorageList = () =>{
  //   const element = document.querySelector(`#inner`)
  //   const height =element.scrollTop;
  //   let obj={
  //     type:"explore_project",
  //     list,
  //     height
  //   }
  //   store.dispatch(saveCache(obj))
  // }
  const openDetail = (id) => {
    PublicJs.StorageList("explore_project",list)
    navigate(`/project/info/${id}`);
  };

  useEffect(() => {
   if(cache?.type === "explore_project") return;
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await getProjects({ page: 1, size: 3 });
      setList(res.data.rows);
      setLoading(false);
    } catch (error) {

      logError(error);
      toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
    }
  };
  return (
    <ExploreSection title={t("Explore.ProjectTitle")} desc={t("Explore.ProjectDescription")} moreLink="/project">
      <List>
        {loading ? (
          <>
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
          </>
        ) : (
          list.map((item) => <div key={item.id} id={`explore_project_${item.id}}`}>
            <ProjectOrGuildItem data={item} onClickItem={openDetail} />
          </div>)
        )}
      </List>
      {Toast}
    </ExploreSection>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  > div:last-of-type ._right {
    border-bottom: none;
  }
  padding-bottom: 28px;
`;
