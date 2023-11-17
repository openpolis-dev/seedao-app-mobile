import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import EventCard from "components/eventCard";
import { getSeeuEventList } from "api/event";
import InfiniteScroll from "react-infinite-scroll-component";
import NoItem from "components/noItem";

const PageSize = 20;

export default function EventListPage() {
  const { t } = useTranslation();

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const hasMore = useMemo(() => {
    return list.length < total;
  }, [list, total]);

  const getList = async () => {
    try {
      const res = await getSeeuEventList({ currentPage: page, pageSize: PageSize });
        setList([...list, ...res.data.data]);
      setTotal(res.data.total);
      setPage(page + 1);
    } catch (error) {
      //  TODO toast
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <Layout title={t("Event.ListTitle")}>
      <InfiniteScroll
        dataLength={list.length}
        next={getList}
        hasMore={hasMore}
        // loader={<Loading />}
      >
        {list.length === 0 && <NoItem />}
        <EventList>
          {list.map((p) => (
            <EventItem key={p.id}>
              <EventCard event={p} />
            </EventItem>
          ))}
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
`;

const EventItem = styled.div`
  width: calc(50% - 7px);
`;
