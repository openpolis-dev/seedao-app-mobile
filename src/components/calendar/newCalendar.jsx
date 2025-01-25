import {useEffect, useState} from "react";
import { rrulestr } from 'rrule'
import styled from "styled-components";
import { Element, scroller,animateScroll } from 'react-scroll';
import CalendarItem from "./CalendarItem";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {getCalenderEvents} from "../../api/calendar";
import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import useToast from "../../hooks/useToast";
dayjs.extend(utc);
dayjs.extend(duration)


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
    white-space: nowrap;
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
  padding: 50px 20px 20px;
  
`

export default function NewCalendar(){
    const { i18n } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(2);
    const [eventList, setEventList] = useState([])
    const [list,setList] = useState([]);
    const [eventArr,setEventArr] = useState([]);

    const { Toast, toast } = useToast();

    useEffect(() => {
        getMonth()
        getCurrent()
        getEvent()
    }, []);

    useEffect(() => {
        ScrollToCenter()
    }, [currentMonth]);

    useEffect(() => {
        getCurrentEvent()
    }, [eventList,currentMonth]);

    const ScrollToCenter = () =>{
        const width = -(window.screen.width / 2) +40;
        setTimeout(()=>{
            scroller.scrollTo(currentMonth, {
                duration: 200,
                smooth: true,
                horizontal:true,
                offset:width,
                containerId:"innerContent"
            });
        },0)
    }

    useEffect(()=>{
        ScrollToToday()
    },[eventArr,currentMonth])

    const ScrollToToday = () =>{
        const month = dayjs().month();
        const date = dayjs().format('YYYYMMDD');
        if(month === currentMonth){
            setTimeout(()=>{
                scroller.scrollTo(date, {
                    duration: 200,
                    smooth: true,
                    offset: -150,
                    containerId:"inner"
                });
            },0)
        }else{
            animateScroll.scrollTo(0, {
                containerId:"inner",
                duration: 200,
                smooth: true
            });
        }
    }


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

        if(ruleStr){
            const dateFormat = dayjs(dStr).utc().format('YYYYMMDDTHHmmss');
            const rruleSet = rrulestr(`DTSTART:${dateFormat}Z\n${ruleStr}`, {forceset: true})
            const begin = dayjs().subtract(5,"month").toDate();
            const end = dayjs().add(6,"month").toDate();
            return rruleSet.between(begin, end);
        }
        else{
            const date = dayjs(dStr).utc().toDate();
            return [date]
        }
    }

    // const isMultiEvent = (startTime, endTime) => {
    //
    //     const startTimeFormat = dayjs(startTime);
    //     const endTimeFormat = dayjs(endTime)
    //     const hour1 =  dayjs.duration(endTimeFormat.diff(startTimeFormat)).asHours()
    //     let hour2 = !startTimeFormat.isSame(endTimeFormat, 'day') && endTimeFormat.hour() >= 12
    //     return hour1 >=24 || hour2
    // }


    const getEvent = async() =>{
        store.dispatch(saveLoading(true));
        try{
            let rt = await getCalenderEvents('','');


            const aaa = rt.data.items.filter((item)=>item.summary === "市政厅通气会： Queeny");
            console.log(aaa)

            const validTimeArr = rt.data.items.filter((item)=>item.status == "confirmed" || !item.originalStartTime);
            let eventArr = [];
            const inValidTimeArr = rt.data.items.filter((item)=>item.originalStartTime);
            validTimeArr.map((event)=>{


                // let isMultiEventRt = isMultiEvent(event.start?.dateTime,event.end?.dateTime)
                let eventStr =  formatDateTime(event.start?.dateTime,event.recurrence);
                let arr = eventStr.map((item)=> {
                    return {
                        dayTime:item,
                        event,
                        changedEvents: [],
                        cancelledEvents: [],
                    }
                })
                eventArr.push(...arr);
            })

            let changed = [];
            let cancelled = [];
            inValidTimeArr.map((event)=>{
                if (event.status == "cancelled") { //cancelled events
                    cancelled.push({
                        recurringEventId: event.recurringEventId,
                        originalStartTime: event.originalStartTime.dateTime ? dayjs(event.originalStartTime.dateTime) :"",
                    });
                } else if (event.status == "confirmed") { //changed events
                    console.log("-changed--",event)
                    changed.push({
                        recurringEventId: event.recurringEventId,
                        name: event.summary,
                        description: event.description,
                        location: event.location,
                        originalStartTime: event.originalStartTime.dateTime ? dayjs(event.originalStartTime.dateTime) : "",
                        newStartTime: event.start.dateTime ? dayjs(event.start.dateTime) : dayjs.parseZone(event.start.date),
                        newEndTime: event.end.dateTime ? dayjs(event.end.dateTime) : dayjs.parseZone(event.end.date),
                    });
                }
            })
            eventArr.forEach((event, idx, arr) => {
                if (event.event.recurrence) {
                    //push changed events
                    changed.filter(change => change.recurringEventId == event.event.id).forEach((change) => {
                        console.error("===arr[idx]==",arr[idx],change)
                        arr[idx].changedEvents.push(change);
                    });

                    //push cancelled events
                    cancelled.filter(cancel => cancel.recurringEventId == event.event.id).forEach((cancel) => {
                        arr[idx].cancelledEvents.push(cancel.originalStartTime);
                    });
                }
            });
            setEventList(eventArr)
        }catch (error) {
            console.log(error)
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        }finally {
            store.dispatch(saveLoading(false));
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

        let rt =  sortArr.map((item)=>{
            return {
                day:item,
                eventInfo:dateMap.get(item)
            }
        })

        setEventArr([...rt])

    }

    return <Box>
        <HeaderBox  id="innerContent">
            <TitleBox>
                {
                    list.map((item,index)=>(<Element name={`${item.month()}`} key={index}>
                        <li
                        className={currentMonth===item.month()?"active":""}
                        onClick={()=>handleCurrent(item.month())}>{item.format("MMM")}</li></Element>))
                }
            </TitleBox>
        </HeaderBox>
        <CList>
            {
                eventArr.map((item,index)=>( <Element  key={`calendar_${index}}`} name={`${item.day}`} ><CalendarItem detail={item} /></Element>))
            }
        </CList>
        {Toast}
    </Box>
}
