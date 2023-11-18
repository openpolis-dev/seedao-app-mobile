import {useEffect, useState} from "react";

import styled from "styled-components";


import CalendarItem from "./CalendarItem";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {getCalenderEvents} from "../../api/calendar";


const Box = styled.div`
    background: var(--background-color);
  display: flex;
  flex-direction: column;
  
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

    const getEvent = async() =>{

        try{
            let rt = await getCalenderEvents('','');

            console.table(rt.data.items.length)

            rt.data.items.map((event)=>{
                // let newEvent = {
                //     id: event.id,
                //     name: event.summary,
                //     startTime: event.start?.dateTime ,
                //     endTime: event.end?.dateTime,
                //     description: event.description,
                //     location: event.location,
                //     recurrence: event.recurrence,
                // };
                console.log(event)
            })


        }catch (e) {
            console.log(e)
        }

    }
    const handleCurrent = (month) =>{
        setCurrentMonth(month)
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
                [...Array(3)].map((item,index)=>( <CalendarItem key={`calendar_${index}}`}  />))
            }
        </CList>
    </Box>
}
