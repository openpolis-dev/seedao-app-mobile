import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import StickyHeader from "../components/layout/StickyHeader";
import ExploreSection from "components/exploreSection";
import styled from "styled-components";

export default function Explore() {
  const { t } = useTranslation();

  return (
    <Layout noHeader>
      <StickyHeader title={t("Explore.Head")} bgcolor="var(--background-color-1)" />
      <LayoutContainer>
        <ExploreSection
          title={t("Explore.ProjectTitle")}
          desc={t("Explore.ProjectDescription")}
          moreLink="/projects"
        ></ExploreSection>
        <ExploreSection
          title={t("Explore.GuildTitle")}
          desc={t("Explore.GuildDescription")}
          moreLink="/guilds"
        ></ExploreSection>
        <ExploreSection
          title={t("Explore.ResourceApply")}
          desc={t("Explore.ResourceApplyDesc")}
          moreLink="/resources"
        ></ExploreSection>
        <ExploreSection
          title={t("Explore.OfflineEvent")}
          desc={t("Explore.OfflineEventDesc")}
          moreLink="/events"
        ></ExploreSection>
      </LayoutContainer>
    </Layout>
  );
}

const LayoutContainer = styled.div`
  padding-inline: 20px;
  section {
    margin-top: 30px;
    &:first-of-type {
      margin-top: 14px;
    }
  }
`;
