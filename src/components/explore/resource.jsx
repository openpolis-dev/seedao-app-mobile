import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ExploreSection from "components/exploreSection";
import ResourceCard from "components/resourceCard";
import links from "utils/links";
import { useMemo } from "react";

export default function ExploreResourceSection() {
  const { t } = useTranslation();
  const list = useMemo(() => {
    return links.resource.slice(0, 6).map((item) => ({ ...item, name: t(item.name), desc: t(item.desc) }));
  }, [t]);
  return (
    <ExploreSection title={t("Explore.ResourceApply")} desc={t("Explore.ResourceApplyDesc")} moreLink="/resources" noMore>
      <LinkBox>
        {list.map((item, i) => (
          <ResourceCard data={item} key={i} />
        ))}
      </LinkBox>
    </ExploreSection>
  );
}

const LinkBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px 14px;
  padding-bottom: 21px;
  & > div {
    width: calc(50% - 7px);
  }
`;
