import styled from "styled-components";
import BgImg from "../../assets/Imgs/bg.png"
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getPublicity} from "../../api/publicity";
import useToast from "../../hooks/useToast";
import {useNavigate} from "react-router-dom";
import {formatTime} from "../../utils/time";

const Box = styled.div`
    border-radius: 16px;
    margin: 20px 20px 0;
    padding: 16px;
    color: #fff;
    background:url(${BgImg}) no-repeat right top;
`

const TitleBox = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1em;
`

const TipsBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  //color: rgba(255,255,255,0.8);
    color: #333;
  line-height: 22px;
`

const ListBox = styled.ul`
    li{
      padding: 2px 5px;
      font-size: 14px;
      font-family: Poppins-SemiBold;
      font-weight: 600;
      color: #333;
        display: flex;
        align-items: center;
        
    }
    .title{
        //white-space: nowrap;
        //overflow: hidden;
        //text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
    }
  .time{
    margin-left: 10px;
      font-size: 12px;
      white-space: nowrap;
  }
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Bulletin = () => {
    const { t } = useTranslation();
    const [list,setList] = useState([]);
    const { Toast, toast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        getList()

    }, []);

    const getList = async() =>{
        try {
            let rt = await getPublicity(1,2)
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
        <FlexBox>
            <TitleBox>{t("publicity.title")}</TitleBox>
            <TipsBox  onClick={()=>handleNav("/publicity")}>{t("publicity.view")} &gt;</TipsBox>
        </FlexBox>
        <ListBox>
            {
                list?.map((item,index)=>(<li key={index}>

                    <span className="title">{item?.title}</span>
                    <span className="time">{formatTime(item?.updateAt * 1000)}</span>
                </li>))
            }
        </ListBox>

    </Box>
}

export default Bulletin;
