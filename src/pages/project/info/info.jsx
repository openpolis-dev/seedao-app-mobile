import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import {  useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "api/project";
import { useProjectContext, PROJECT_ACTIONS } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import ProjectMember from "./member";
import ProjectBasic from "./basic";
import ProjectProposal from "./proposal";
import ProjectAssets from "./asset";


export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { data },
    dispatch,
  } = useProjectContext();


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
  return (
    <Layout title={data?.name || t("mobile.projectDetail")}>
      <ProjectBasic />
      <ProjectMember />
    </Layout>
  );
}
