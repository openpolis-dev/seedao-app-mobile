import {useEffect, useState} from "react";
import { rrulestr } from 'rrule'

import styled from "styled-components";


import CalendarItem from "./CalendarItem";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {getCalenderEvents} from "../../api/calendar";
import utc from "dayjs/plugin/utc"
dayjs.extend(utc);


const Box = styled.div`
    background: var(--background-color);
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

const HeaderBox = styled.div`
    overflow-x: auto;
  padding: 10px 0;
  position: fixed;
  background: var(--background-color);
  display: flex;
  width: 100vw;
  z-index: 9;
`

const TitleBox = styled.ul`
    display: flex;
  flex-wrap: nowrap;
  li{
    margin:0 20px;
    flex-shrink: 0;
    
    font-size: 14px;
    font-weight: 500;
    color: #9A9A9A;
    line-height: 23px;
    &.active{
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 23px;
    }
  }
`

const CList = styled.div`
  padding: 50px 24px 20px;
  
`

export default function NewCalendar(){
    const { i18n } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(2);

    const [eventList, setEventList] = useState([])

    const [list,setList] = useState([]);

    useEffect(() => {
        getMonth()
        getCurrent()
        getEvent()
    }, []);

    const getMonth = () =>{
        const Today = new Date().toDateString();
        const BeforeArr = new Array(5).fill().map((_,index)=>index);
        const BeforeMonth = BeforeArr.reverse();


        let BeforeStr =[];
        BeforeMonth.map((item)=>{
            let monthStr = dayjs(Today).subtract(item+1,"month").locale(i18n.language);
            BeforeStr.push(monthStr)
        })

        const AfterArr = new Array(6).fill().map((_,index)=>index);

        let AfterStr =[];
        AfterArr.map((item)=>{
            let monthStr = dayjs(Today).add(item+1,"month").locale(i18n.language);
            AfterStr.push(monthStr)
        })

        const TodayStr =  dayjs(Today).locale(i18n.language);

        const monthList = [...BeforeStr,TodayStr,...AfterStr]
        setList(monthList);
    }

    const getCurrent = () =>{
        const Today = new Date().toDateString();
        const month = dayjs(Today).month()
        setCurrentMonth(month)
    }

    const formatDateTime = (dStr,ruleStr) =>{

        const dateFormat = dayjs(dStr).utc().format('YYYYMMDDTHHmmss');

        const rruleSet = rrulestr(`DTSTART:${dateFormat}Z\n${ruleStr}`, {forceset: true})
        const begin = dayjs().subtract(5,"month").toDate();
        const end = dayjs().add(6,"month").toDate();

        return rruleSet.between(begin, end);
    }

    const getEvent = async() =>{
        try{
            let rt = await getCalenderEvents('','');

            const validTimeArr = rt.data.items.filter((item)=>item.status === "confirmed");

            let eventArr = [];

            validTimeArr.map((event)=>{
                let eventStr =  formatDateTime(event.start?.dateTime,event.recurrence);

                let arr = eventStr.map((item)=> {
                    return {
                        dayTime:item,
                        event
                    }
                })
                eventArr.push(...arr);
            })

            setEventList(eventArr)
        }catch (e) {
            console.log(e)
        }

    }
    const handleCurrent = (month) =>{
        setCurrentMonth(month)
    }

    const getCurrentEvent = () =>{

        let arr =[];
        eventList.map((item)=>{
            const month = dayjs(item.dayTime).month()
            if(month === currentMonth){
                arr.push(item)
            }
        })
        let dateMap = new Map();

        arr.map((item)=>{
            let day = dayjs(item.dayTime).format("YYYYMMDD");
            let events = dateMap.get(day)??[];
            events.push(item)
            dateMap.set(day,[...events])
        })

        let sortArr = Array.from(dateMap.keys()).sort()

        return sortArr.map((item)=>{
            return {
                day:item,
                eventInfo:dateMap.get(item)
            }
        })

    }

    return <Box>
        <HeaderBox>
            <TitleBox>
                {
                    list.map((item,index)=>(<li
                        key={index}
                        className={currentMonth===item.month()?"active":""}
                        onClick={()=>handleCurrent(item.month())}
                    >{item.format("MMM")}</li>))
                }
            </TitleBox>
        </HeaderBox>
        <CList>
            {
                getCurrentEvent().map((item,index)=>( <CalendarItem key={`calendar_${index}}`}  detail={item} />))
            }
        </CList>
    </Box>
}
