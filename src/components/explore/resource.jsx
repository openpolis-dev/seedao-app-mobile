import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ExploreSection from "components/exploreSection";

export default function ExploreResourceSection() { 
  const { t } = useTranslation();
    return (
      <ExploreSection
        title={t("Explore.ResourceApply")}
        desc={t("Explore.ResourceApplyDesc")}
        moreLink="/resources"
      ></ExploreSection>
    );
}