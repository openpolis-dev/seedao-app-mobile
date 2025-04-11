import Layout from "components/layout/layout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import Adv from "../components/home/Adv";
import HomeCalendar from "../components/home/HomeCalendar";
import AppList from "../components/home/appList";
import Event from "../components/home/event";
import Hub from "../components/home/pub";
import NewsTicker from "../components/home/marquee";
import Bulletin from "../components/home/bulletin";

const BoxInner = styled.div`
  display: flex;
  flex-direction: column;
x
  box-sizing: border-box;
  background: var(--background-color);
`;

export default function Home() {
  const { t } = useTranslation();

  return (
    <Layout sticky title={t("Menus.Square")} bgColor="var(--background-color)">
      <BoxInner>
        {/*<Adv />*/}
        {/*<NewsTicker />*/}
        <HomeCalendar />
        <Bulletin />
        <AppList />
        <Event />
        <Hub />
      </BoxInner>
    </Layout>
  );
}
