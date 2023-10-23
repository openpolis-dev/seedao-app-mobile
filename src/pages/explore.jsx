import Layout from "components/layout/layout";
import Tab from "../components/common/tab";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Project from "./project";
import Guild from "./guild";
export default function Explore(){
    const [list, setList] = useState([]);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const _list = [
            {
                label: t("menus.Project"),
                value: 0,
            },
            {
                label: t("menus.Guild"),
                value: 1,
            }
        ];
        setList(_list);
    }, [t]);

    const handleTabChange = (v) => {
        setActiveTab(v);
    };


    return <Layout title="Explore">
        <Tab data={list} value={activeTab} onChangeTab={handleTabChange} />

        {
            activeTab === 0 && <Project />
        }
        {
            activeTab === 1 && <Guild />
        }
    </Layout>
}
