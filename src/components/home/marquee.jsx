import React, {useEffect, useState} from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {getPublicity} from "../../api/publicity";
import { formatTime } from "utils/time";
import useToast from "../../hooks/useToast";
import {useTranslation} from "react-i18next";


const Box = styled.div`
    height: 30px;
    background: #fff;
    margin-top: 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    
    .outer{
        height: 30px;
        width: calc(100vw - 60px);
        
    }
    .inner{
        margin-right: 30px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
        .time{
            color: #9a9a9a;
        }
    }
`

const Lft = styled.div`
`

const Rht = styled.div`
    background: #fff;
    display: inline-block;
    flex-shrink: 0;
    box-shadow: -5px 0 10px rgba(0,0,0,0.2);
    padding: 5px 10px;
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    z-index: 999;
    
`


const NewsTicker = () =>{
    const navigate = useNavigate();
    const [list,setList] = useState([]);
    const { Toast, toast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        getList()

    }, []);

    const getList = async() =>{
        try {
            let rt = await getPublicity(1,5)
            const {data:{rows}} = rt;
            setList(rows)
        }catch(error){
            console.error(error)
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        }
    }

    const handleNav = (url) =>{
        navigate(url)
    }

    return <Box>
        <Lft>
            <Marquee direction="left"  autoFill={true} className="outer" >
                {
                    list.map((item, index) => (
                        <div key={index} onClick={()=>handleNav("/publicity/detail/"+item?.id)} className="inner">
                            <span>{item?.title}</span>
                            <span className="time">{formatTime(item?.updateAt * 1000)}</span>
                        </div>))
                }

            </Marquee>
        </Lft>
        <Rht onClick={()=>handleNav("/publicity")}>
            {t("publicity.view")} &gt;
        </Rht>
        {Toast}
    </Box>
}


export default NewsTicker;
