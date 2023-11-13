import styled from "styled-components";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getSeeuEventList } from "api/event";
import EventCard, { EventCardSkeleton } from "components/eventCard";

export default function ExploreEventSection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const res = await getSeeuEventList({ currentPage: 1, pageSize: 2 });
        setList(res.data.data);
        setLoading(false);
      } catch (error) {
        //  TODO toast
        console.error(error);
      }
    };
    getList();
  }, []);
  return (
    <ExploreSection title={t("Explore.OfflineEvent")} desc={t("Explore.OfflineEventDesc")} moreLink="/event">
      <List>
        {loading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          list.map((item) => <EventCard event={item} />)
        )}
      </List>
    </ExploreSection>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    border-bottom: 1px solid var(--border-color-1);
    &:last-of-type {
      border-bottom: none;
    }
  }
`;
