import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import ProjectOrGuildItem, { ProjectOrGuildItemSkeleton } from "components/projectOrGuild/projectOrGuildItem";
import { useEffect, useState } from "react";
import { getGuilds } from "api/guild";
import store from "../../store";
import {saveCache} from "../../store/reducer";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";
import PublicJs from "../../utils/publicJs";
import useToast from "../../hooks/useToast";

export default function ExploreGuildSection() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const { Toast, toast } = useToast();

  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/guild/info") === -1 || cache?.type!== "explore_guild" )return;

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
  const openDetail = (id) => {
    PublicJs.StorageList("explore_guild",list)
    navigate(`/guild/info/${id}`);
  };

  useEffect(() => {
    if(cache?.type === "explore_guild") return;
    getList();
  }, []);
  const getList = async () => {
    setLoading(true);
    try {
      const res = await getGuilds({ page: 1, size: 3 });
      setList(res.data.rows);
      setLoading(false);
    } catch (error) {
      toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
      logError(error);
    }
  };
  return (
    <ExploreSection title={t("Explore.GuildTitle")} desc={t("Explore.GuildDescription")} moreLink="/guild">
      <List>
        {loading ? (
          <>
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
          </>
        ) : (
          list.map((item) => <div key={item.id} id={`explore_guild_${item.id}}`}>
            <ProjectOrGuildItem data={item} key={item.id} onClickItem={openDetail} />
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
  padding-bottom: 26px;
`;
