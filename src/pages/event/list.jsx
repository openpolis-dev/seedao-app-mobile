import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import EventCard, { EventCardSkeleton } from "components/eventCard";
import { getSeeuEventList } from "api/event";
import InfiniteScroll from "react-infinite-scroll-component";
import NoItem from "components/noItem";
import store from "store";
import { saveLoading } from "store/reducer";
import { useSelector } from "react-redux";
import Loading from "components/common/loading";
import { useNavigate } from "react-router-dom";

const PageSize = 20;

export default function EventListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loading = useSelector((state) => state.loading);

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const hasMore = useMemo(() => {
    return list.length < total;
  }, [list, total]);

  const getList = async () => {
    store.dispatch(saveLoading(true));
    try {
      const res = await getSeeuEventList({ currentPage: page, pageSize: PageSize });
      setList([...list, ...res.data.data]);
      setTotal(res.data.total);
      setPage(page + 1);
    } catch (error) {
      //  TODO toast
      console.error(error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const openEvent = (id) => {
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
              <EventItem key={p.id}>
                <EventCard event={p} handleClick={openEvent} />
              </EventItem>
            ))
          )}
        </EventList>
      </InfiniteScroll>
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
