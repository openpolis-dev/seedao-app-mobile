import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import EventCard, { EventCardSkeleton } from "components/event/eventCard";
import { getSeeuEventList } from "api/event";
import InfiniteScroll from "react-infinite-scroll-component";
import NoItem from "components/noItem";
import store from "store";
import {saveCache, saveLoading} from "store/reducer";
import { useSelector } from "react-redux";
import Loading from "components/common/loading";
import { useNavigate } from "react-router-dom";
import useCurrentPath from "../../hooks/useCurrentPath";
import useToast from "../../hooks/useToast";
import dayjs from "dayjs";
import NewEvent from "../../components/home/newEvent";

const PageSize = 20;

export default function EventListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loading = useSelector((state) => state.loading);

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { Toast, toast } = useToast();
  const prevPath = useCurrentPath();
  const cache = useSelector(state => state.cache);


  useEffect(()=>{

    if(!prevPath || prevPath?.indexOf("/event/view") === -1 || cache?.type!== "event" )return;

    const { list, page,height,id} = cache;

    setList(list);
    setPage(page);

    setTimeout(()=>{
      const element = document.querySelector(`#inner`)
      const targetElement = document.querySelector(`#event_${id}`);
      // console.log(element,targetElement)
      if (targetElement) {
        element.scrollTo({
          top: height,
          behavior: 'auto',
        });
      }
    },0)
  },[prevPath])



  const hasMore = useMemo(() => {
    return list.length < total;
  }, [list, total]);

  const getList = async () => {
    store.dispatch(saveLoading(true));
    try {
      // const res = await getSeeuEventList({ currentPage: page, pageSize: PageSize });
      // setList([...list, ...res.data.data]);

      const resp = await fetch("/data/eventList.json");
      let rt = await resp.json();

      const list = rt.data.items;


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
      // setTotal(res.data.total);
      setPage(page + 1);
    } catch (error) {
      logError(error);
      toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
    } finally {
      store.dispatch(saveLoading(false));

    }
  };

  useEffect(() => {
    getList();
  }, []);

  const StorageList = (id) =>{
    const element = document.querySelector(`#inner`)
    const height =element.scrollTop;
    let obj={
      type:"event",
      id,
      list,
      page,
      height
    }
    store.dispatch(saveCache(obj))
  }


  const openEvent = (id) => {
    StorageList(id);
    navigate(`/event/view?id=${id}`);
  };
  return (
    <Layout title={t("Event.ListTitle")}>
      <InfiniteScroll
        scrollableTarget="inner"
        dataLength={list.length}
        next={getList}
        hasMore={hasMore}
        loader={<Loading />}
      >
        {!loading && list.length === 0 && <NoItem />}

        <EventList>
          {loading && list.length === 0 ? (
            <>
              {new Array(4).fill(0).map((_, index) => (
                <EventItem key={index}>
                  <EventCardSkeleton />
                </EventItem>
              ))}
            </>
          ) : (
            list.map((p) => (
              <EventItem key={p.id} id={`event_${p.id}`}>
                {/*<EventCard event={p} handleClick={openEvent} />*/}
                <NewEvent item={p}  imgRadius={true}  />
              </EventItem>

            ))
          )}
        </EventList>
      </InfiniteScroll>
      {Toast}
    </Layout>
  );
}
const EventList = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding-inline: 20px;
  margin-top: 14px;
`;

const EventItem = styled.div`
  width: calc(50% - 7px);
`;
