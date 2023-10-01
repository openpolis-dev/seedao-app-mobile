import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGuildById } from "api/guild";
import { useGuildContext, GUILD_ACTIONS } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import GuildMember from "./member";
import GuildBasic from "./basic";
import GuildProposal from "./proposal";
import GuildAssets from "./asset";

const TABS_VALUE = {
  INFOMATION: 0,
  MEMBER: 1,
  ASSET: 2,
  PROPOSAL: 3,
};

export default function GuildInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { data },
    dispatch,
  } = useGuildContext();

  const [activeTab, setActiveTab] = useState(TABS_VALUE.INFOMATION);

  const tabs = useMemo(() => {
    return [
      {
        label: t("Guild.ProjectInformation"),
        value: TABS_VALUE.INFOMATION,
      },
      {
        label: t("Guild.Members"),
        value: TABS_VALUE.MEMBER,
      },
      {
        label: t("Guild.Asset"),
        value: TABS_VALUE.ASSET,
      },
      {
        label: t("Guild.ProjectProposal"),
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
  const getTabContent = () => {
    switch (activeTab) {
      case TABS_VALUE.INFOMATION:
        return <GuildBasic />;
      case TABS_VALUE.MEMBER:
        return <GuildMember />;
      case TABS_VALUE.ASSET:
        return <GuildAssets />;
      case TABS_VALUE.PROPOSAL:
        return <GuildProposal />;
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
