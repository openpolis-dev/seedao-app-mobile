import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import { useState, useMemo } from "react";

export default function ProjectInfo() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState([]);

  const tabs = useMemo(() => {
    return [
      {
        label: t("Project.ProjectInformation"),
        value: 0,
      },
      {
        label: t("Project.Members"),
        value: 1,
      },
      {
        label: t("Project.Asset"),
        value: 2,
      },
      {
        label: t("Project.ProjectProposal"),
        value: 3,
      },
    ];
  }, [t]);

  const handleTabChange = (v) => {
    setActiveTab(v);
  };
  return (
    <Layout noTab title={t("mobile.projectDetail")}>
      <Tab data={tabs} value={activeTab} onChangeTab={handleTabChange} />
    </Layout>
  );
}
