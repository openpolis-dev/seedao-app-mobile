import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ExploreProjectSection from "components/explore/project";
import ExploreGuildSection from "components/explore/guild";
import ExploreResourceSection from "components/explore/resource";
import ExploreEventSection from "components/explore/event";
import Pub from "components/explore/pub";

export default function Explore() {
  const { t } = useTranslation();

  return (
    <Layout sticky title={t("Explore.Head")} bgColor="var(--background-color-1)">
      <LayoutContainer>
        <ExploreProjectSection />
        <ExploreGuildSection />
        <ExploreResourceSection />
        <ExploreEventSection />
        <Pub />
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
