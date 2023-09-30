import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "api/project";
import { useProjectContext, PROJECT_ACTIONS } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import ProjectMember from "./member";
import ProjectBasic from "./basic";
import ProjectProposal from "./proposal";
import ProjectAssets from "./asset";

const TABS_VALUE = {
  INFOMATION: 0,
  MEMBER: 1,
  ASSET: 2,
  PROPOSAL: 3,
};

export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { data },
    dispatch,
  } = useProjectContext();

  const [activeTab, setActiveTab] = useState(TABS_VALUE.INFOMATION);

  const tabs = useMemo(() => {
    return [
      {
        label: t("Project.ProjectInformation"),
        value: TABS_VALUE.INFOMATION,
      },
      {
        label: t("Project.Members"),
        value: TABS_VALUE.MEMBER,
      },
      {
        label: t("Project.Asset"),
        value: TABS_VALUE.ASSET,
      },
      {
        label: t("Project.ProjectProposal"),
        value: TABS_VALUE.PROPOSAL,
      },
    ];
  }, [t]);

  const handleTabChange = (v) => {
    setActiveTab(v);
  };

  useEffect(() => {
    const getProjectData = async () => {
      store.dispatch(saveLoading(true));
      try {
        const data = await getProjectById(id);
        console.log(`[pro-${id}]`, data);
        dispatch({ type: PROJECT_ACTIONS.SET_DATA, payload: data.data });
      } catch (error) {
        console.error(error);
      } finally {
        store.dispatch(saveLoading(false));
      }
    };
    if (id) {
      getProjectData();
      dispatch({ type: PROJECT_ACTIONS.SET_ID, payload: Number(id) });
    }
  }, [id, dispatch]);
  const getTabContent = () => {
    switch (activeTab) {
      case TABS_VALUE.INFOMATION:
        return <ProjectBasic />;
      case TABS_VALUE.MEMBER:
        return <ProjectMember />;
      case TABS_VALUE.ASSET:
        return <ProjectAssets />;
      case TABS_VALUE.PROPOSAL:
        return <ProjectProposal />;
      default:
        return <></>;
    }
  };
  return (
    <Layout noTab title={data?.name || t("mobile.projectDetail")}>
      <Tab data={tabs} value={activeTab} onChangeTab={handleTabChange} />
      <TabContent>{getTabContent()}</TabContent>
    </Layout>
  );
}

const TabContent = styled.div`
  padding-block: 15px;
`;
