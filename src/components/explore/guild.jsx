import styled from "styled-components";
import ExploreSection from "components/exploreSection";
import { useTranslation } from "react-i18next";
import ProjectOrGuildItem, { ProjectOrGuildItemSkeleton } from "components/projectOrGuild/projectOrGuildItem";
import { useEffect, useState } from "react";
import { getGuilds } from "api/guild";

export default function ExploreGuildSection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const res = await getGuilds({ page: 1, size: 3 });
        setList(res.data.rows);
        setLoading(false);
      } catch (error) {
        //  TODO toast
        console.error(error);
      }
    };
    getList();
  }, []);
  return (
    <ExploreSection title={t("Explore.GuildTitle")} desc={t("Explore.GuildDescription")} moreLink="/guilds">
      <List>
        {loading ? (
          <>
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
            <ProjectOrGuildItemSkeleton />
          </>
        ) : (
          list.map((item) => <ProjectOrGuildItem data={item} key={item.id} />)
        )}
      </List>
    </ExploreSection>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;
