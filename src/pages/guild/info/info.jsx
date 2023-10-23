import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGuildById } from "api/guild";
import { useGuildContext, GUILD_ACTIONS } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import GuildMember from "./member";
import GuildBasic from "./basic";


export default function GuildInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { data },
    dispatch,
  } = useGuildContext();


  useEffect(() => {
    const getProjectData = async () => {
      store.dispatch(saveLoading(true));
      try {
        const data = await getGuildById(id);
        console.log(`[pro-${id}]`, data);
        dispatch({ type: GUILD_ACTIONS.SET_DATA, payload: data.data });
      } catch (error) {
        console.error(error);
      } finally {
        store.dispatch(saveLoading(false));
      }
    };
    if (id) {
      getProjectData();
      dispatch({ type: GUILD_ACTIONS.SET_ID, payload: Number(id) });
    }
  }, [id, dispatch]);

  return (
    <Layout noTab title={data?.name || t("mobile.projectDetail")}>
      <GuildBasic />
      <GuildMember />
    </Layout>
  );
}
