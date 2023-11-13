import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import StickyHeader from "../components/layout/StickyHeader";
import ExploreSection from "components/exploreSection";
import styled from "styled-components";
import ExploreProjectSection from "components/explore/project";
import ExploreGuildSection from "components/explore/guild";
import ExploreResourceSection from "components/explore/resource";
import ExploreEventSection from "components/explore/event";

export default function Explore() {
  const { t } = useTranslation();

  return (
    <Layout noHeader>
      <StickyHeader title={t("Explore.Head")} bgcolor="var(--background-color-1)" />
      <LayoutContainer>
        <ExploreProjectSection />
        <ExploreGuildSection />
        <ExploreResourceSection />
        <ExploreEventSection />
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
