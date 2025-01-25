import Layout from "../components/layout/layout";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getUserLevel} from "../api/user";
import Notion from "./notion/notion";
import axios from "axios";
import styled from "styled-components";
import useToast from "../hooks/useToast";

const Box = styled.div`
    .notion-header{
        display: none;
    }
`


export default function Assistant(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [list, setList] = useState(null);
    const [level, setLevel] = useState("0");
    const { Toast, toast } = useToast();

    useEffect(() => {
        getLevel()
    }, []);

    const getLevel = async() =>{
        const res = await getUserLevel();
        const current_lv = res.data?.current_lv;
        setLevel(current_lv);
    }


    useEffect(() => {
        // if (pathname?.indexOf('notion') > -1 || pathname?.indexOf('assistant') > -1) {
        //   setArticleId("d498b5e6919d4f2295bb76f80c83c4bf");
        // }else {
        //   setArticleId('0bad66817c464f04962b797b47056241');
        // }

        let artId
        switch (level){
            case "2":
                artId = ("19e87f9a7afc40ba9aa9beccded3dd61");
                break;
            case "3":
                artId = ("2b78fc5a90584b5399bb0acb4404fd79");
                break;
            case "4":
                artId = ("c7e2c42b05d24d529757b115455d5644");
                break;
            case "5":
                artId = ("58272ec5de7d44ad9b665a11b1006ffb");
                break;
            case "6":
                artId = ("566965755bd74c94944695f689e21101");
                break;
            case "1":
            default:
                artId = ("cd2edf1da63f4b7188c81509deadabee");
                break;
        }
        getData(artId);

    }, [level]);

    const getData = async (articleId) => {
        // dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
            let result = await axios.get(`https://kind-emu-97.deno.dev/page/${articleId}`);
            setList(result.data);
        } catch (error) {
            console.log(error);
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        }
        // finally {
        //     dispatch({ type: AppActionType.SET_LOADING, payload: false });
        // }
    };

    return <Layout
        title={t('apps.assistant')}
        handleBack={() => {
            navigate("/home");
        }}
    >
        <Box>

            {list && <Notion recordMap={list} />}
        </Box>
        {Toast}
    </Layout>
}
