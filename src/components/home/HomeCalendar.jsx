import styled from "styled-components";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import 'dayjs/locale/zh';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {getCalenderEvents} from "../../api/calendar";

const Box = styled.div`
    margin: 15px 20px 0;
  background: #FFFFFF linear-gradient(180deg, #5200FF 0%, #5100FF 100%);
  border-radius: 16px;
  padding: 16px;
  color: #fff;
`

const Flexbox =styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
`

const DayBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 20px;
    .num{
      font-size: 44px;
      font-family: Poppins-SemiBold;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1em;
      margin-right: 6px;
    }
`

const TitleBox = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
  line-height: 1em;
`
const TipsBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(255,255,255,0.8);
  line-height: 22px;
`

const ListBox = styled.ul`
  margin-top: 12px;
    li{
      margin-bottom: 8px;
      padding: 8px 14px;
      border-radius: 4px;
      border-left: 4px solid #CE43FF;
      
      font-size: 15px;
      font-family: Poppins-SemiBold;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:nth-child(2){
        border-color: #F9B617;
      }
    }
  .time{
    margin-right: 10px;
  }
`
export default function HomeCalendar(){
    const { t,i18n } = useTranslation();

    const navigate = useNavigate();
    const [list,setList] = useState([])
    const getCalendar = async() =>{
        const Today = new Date().toDateString();
        let startTime = dayjs(Today).format();
        let endTime =  dayjs(Today).add(1, 'day').subtract(1,"second").format();

        try{
            let rt = await getCalenderEvents(startTime,endTime);
            let arr = rt.data.items.filter(item=>item.summary);
            let lArr = arr.slice(0,2);
            setList(lArr);
        }catch (e) {
            console.log(e)
        }
    }

    const switchDay = () =>{
        const date = new Date();
        return String(date.getDate()).padStart(2, '0');
    }

    const switchWeek =()=>{
        const date = new Date();
        return dayjs(date).locale(i18n.language).format("ddd");
    }
    const switchTime = (time) =>{
        const timeStr = new Date(time);
        return dayjs(timeStr).format('HH:mma');
    }

    useEffect(() => {
        getCalendar()
    }, []);

    const toGo = () =>{
        navigate("/calendar")
    }

    return <Box onClick={toGo}>
        <Flexbox>
            <div>
                <TitleBox>{t("home.title")}</TitleBox>
                <TipsBox>{t("home.tips")}</TipsBox>
            </div>
            <DayBox>
                <span className="num">{switchDay()}</span>
                <span>{switchWeek()}</span>
            </DayBox>
        </Flexbox>
        <ListBox>
            {
                list?.map((item,index)=>(<li key={index}>
                    <span className="time">{switchTime(item.start?.dateTime)}</span>
                    <span>{item.summary}</span>
                </li>))
            }
        </ListBox>
    </Box>
}
