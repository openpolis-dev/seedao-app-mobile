import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "api/project";
import { useProjectContext, PROJECT_ACTIONS } from "../provider";
import store from "store";
import { saveLoading } from "store/reducer";

export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { dispatch } = useProjectContext();

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
    id && getProjectData();
  }, [id, dispatch]);
  return (
    <Layout noTab title={t("mobile.projectDetail")}>
      <Tab data={tabs} value={activeTab} onChangeTab={handleTabChange} />
    </Layout>
  );
}
