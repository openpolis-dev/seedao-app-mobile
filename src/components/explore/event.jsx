import styled from "styled-components";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getSeeuEventList } from "api/event";
import EventCard, { EventCardSkeleton } from "components/event/eventCard";
import { useNavigate } from "react-router-dom";
import PublicJs from "../../utils/publicJs";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";
import store from "../../store";
import {saveCache} from "../../store/reducer";
import useToast from "../../hooks/useToast";

export default function ExploreEventSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { Toast, toast } = useToast();
  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/event/view") === -1 || cache?.type!== "explore_event" )return;
    const { list, height} = cache;
    setList(list);
    setLoading(false);
    setTimeout(()=>{
      const element = document.querySelector(`#inner`)
      element.scrollTo({
        top: height,
        behavior: 'auto',
      });
      store.dispatch(saveCache(null))
    },0)
  },[prevPath])

  useEffect(() => {
    if(cache?.type === "explore_event") return;
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await getSeeuEventList({ currentPage: 1, pageSize: 6 });
      setList(res.data.data);
      setLoading(false);
    } catch (error) {
      toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
      logError(error);
    }
  };
  const openEvent = (id) => {
    PublicJs.StorageList("explore_event",list)
    navigate(`/event/view?id=${id}`);
  };
  return (
    <ExploreSection title={t("Explore.OfflineEvent")} desc={t("Explore.OfflineEventDesc")} moreLink="/event">
      <List>
        {loading ? (
          <>
            <EventItem>
              <EventCardSkeleton />
            </EventItem>
            <EventItem>
              <EventCardSkeleton />
            </EventItem>
          </>
        ) : (
          list.map((item, index) => (
            <EventItem key={index}  id={`explore_event_${item.id}}`}>
              <EventCard event={item} handleClick={openEvent} />
            </EventItem>
          ))
        )}
      </List>
      {Toast}
    </ExploreSection>
  );
}

const List = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  min-height: 900px;
`;

const EventItem = styled.div`
  width: calc(50% - 7px);
`;
