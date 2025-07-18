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
import dayjs from "dayjs";
import NewEvent from "../home/newEvent";

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
      // const res = await getSeeuEventList({ currentPage: 1, pageSize: 6 });
      const resp = await fetch("/data/eventList.json");
      let rt = await resp.json();

      const list = rt.data.items.slice(0,6);

      let arr = [];
      list.map((item) => {
        let startDay = dayjs(item.fields['活动日期']).format(`YYYY-MM-DD`);
        arr.push({
          startDay,
          startTime:item.fields['活动时间'] ? item.fields['活动时间'][0].text :"",
          poster: item.fields['活动照片/海报'] ? item.fields['活动照片/海报'][0].name :"",
          subject:item.fields['活动名称'] ? item.fields['活动名称'][0]?.text:"",
          activeTime:item.fields['活动时长'] ? item.fields['活动时长'][0].text :"",
          city:item.fields['活动地点'] ? item.fields['活动地点'][0].text :"",
          fee:item.fields['活动费用'] ?item.fields["活动费用"][0].text:"",
          type:item?.fields["活动类型"] ?? "",
          id:item?.record_id
        });
      })
      setList(arr);
      // setList(res.data.data);
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
              {/*<EventCard event={item} handleClick={openEvent} />*/}
              <NewEvent item={item} key={index} imgRadius={true}  />
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
