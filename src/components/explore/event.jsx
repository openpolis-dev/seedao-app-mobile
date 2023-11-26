import styled from "styled-components";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getSeeuEventList } from "api/event";
import EventCard, { EventCardSkeleton } from "components/event/eventCard";
import { useNavigate } from "react-router-dom";

export default function ExploreEventSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const res = await getSeeuEventList({ currentPage: 1, pageSize: 6 });
        setList(res.data.data);
        setLoading(false);
      } catch (error) {
        //  TODO toast
        console.error(error);
      }
    };
    getList();
  }, []);
  const openEvent = (id) => {
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
            <EventItem key={index}>
              <EventCard event={item} handleClick={openEvent} />
            </EventItem>
          ))
        )}
      </List>
    </ExploreSection>
  );
}

const List = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

const EventItem = styled.div`
  width: calc(50% - 7px);
`;
