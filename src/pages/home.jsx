import Layout from "components/layout/layout";
import styled from "styled-components";
import { useTranslation } from 'react-i18next';

import StickyHeader from "../components/layout/StickyHeader";
import Adv from "../components/home/Adv";
import HomeCalendar from "../components/home/HomeCalendar";
import AppList from "../components/home/appList";

const BoxInner = styled.div`
    display: flex;
  flex-direction: column;
  min-height: 100%;
  box-sizing: border-box;
  background: var( --background-color);
`



export default function Home(){

    const { t } = useTranslation();


    return <Layout noHeader>
        <StickyHeader title={t("Menus.Square")} bgcolor="var(--background-color)" />
        <BoxInner>
            <Adv />
            <HomeCalendar />
            <AppList />

        </BoxInner>
    </Layout>
}
