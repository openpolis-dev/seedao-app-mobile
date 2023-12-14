import PlusWhite from "../../assets/Imgs/calendar/plus-white.svg";
import PlusImg from "../../assets/Imgs/calendar/plus.svg";
import TitleWhite from "../../assets/Imgs/calendar/title-white.svg";
import TitleImg from "../../assets/Imgs/calendar/title.svg";
import LocationWhite from "../../assets/Imgs/calendar/location-white.svg";
import LocationImg from "../../assets/Imgs/calendar/location.svg";
import MoreImg from "../../assets/Imgs/calendar/more.svg";
import MoreWhite from "../../assets/Imgs/calendar/more-white.svg";
import SubImg from "../../assets/Imgs/calendar/sub.svg";
import SubWhite from "../../assets/Imgs/calendar/sub-white.svg";
import styled from "styled-components";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";


const EventBox= styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  span{
    font-size: 14px;
  }
  img{
    margin-top: 8px;
  }
`

const EventDesc = styled.div`
    margin-top: 12px;
  .line{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    opacity: 0.8;
    margin-bottom: 9px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .lft{
    padding:0 7px 0 0 ;
  }
  .location{
    word-break: break-all;
    font-size: 12px;
    flex-grow: 1;
    padding-top: 3px;
  }
`



const DlBox = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 18px 18px 5px;
    margin-bottom: 12px;

  dt{
    font-size: 14px;
    font-weight: 500;
    color: #9A9A9A;
    line-height: 18px;
  }
  li{
    border-bottom: 1px solid rgba(126,123,136,0.12);
    padding: 17px 0;
    &:last-child{
      border-bottom: 0;
    }
  }
  .moreLi{
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 12px;
    font-weight: 400;
    color: #9A9A9A;
    line-height: 16px;
  }
    &.activeBox{
      background: var(--primary-color);
      color: #fff;
      dt{
        color: #fff;
      }
      li{
        border-bottom:1px solid rgba(255,255,255,0.12);
        &:last-child{
          border-bottom: 0;
        }
      }
      .moreLi{
        color: #fff;
        opacity: 0.8;
      }
    }
`

const LineBox = styled.div`
  margin-right: 30px;
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  .time{
    flex-shrink: 0;
    margin-right: 14px;
  }
`


export default function CalendarItem({detail}){
    const { t,i18n } = useTranslation();
    const [index] = useState(0)
    const [currentDay, setCurrentDay] = useState();
    const [list, setList] = useState([]);
    const [showList, setShowList] = useState([]);
    const [more,setMore] = useState(false);
    const SliceNum = 3;

    useEffect(() => {
        formatDay()
    }, [detail]);

    useEffect(() => {

        let arr = !more ? list : list.slice(0,SliceNum)
        setShowList([...arr])
    }, [more,list]);

    const formatDay = () =>{
        const arr = detail.eventInfo;
        setList(arr.map(item=>{
            return{
                ...item,
                status:false
            }
        }));
        setMore(arr.length > SliceNum)
        let cDay = dayjs().format("YYYYMMDD")
        setCurrentDay(cDay);
    }

    const getTime = (item) =>{
        const startTime = item.event.start.dateTime;
        const endTime = item.event.end.dateTime;
        const sTime = dayjs(startTime).format("HH:mm");
        const eTime = dayjs(endTime).format("HH:mm");
        return `${sTime} - ${eTime}`
    }


    const switchWeek =()=>{
        const date = dayjs(detail.day, 'YYYYMMDD');
        return date.locale(i18n.language).format("MM-DD ddd");
    }

    const handleShow = (index,desc,location) =>{
        if(!desc && !location ) return;
        const arr = [...list];
        arr[index].status = !arr[index].status;

        setList(arr);
    }

    const handleMore = () =>{
        setMore(!more);
    }

    return <DlBox key={`calendar_${index}}`}  className={currentDay=== detail.day? "activeBox":""}>
        <dt>{switchWeek()}</dt>

        <dd>
            <ul>
                {
                    showList.map((innerItem,innerIndex)=><li key={`events_${detail.day}_${innerIndex}}`}>
                        <EventBox onClick={()=>handleShow(innerIndex,innerItem.event.description,innerItem.event.location)}>
                            <LineBox>
                                <div className="time">{getTime(innerItem)} </div>
                                <div>{innerItem.event.summary}</div>
                            </LineBox>

                            {
                                !innerItem.status && (!!innerItem.event.description || !!innerItem.event.location) && <img src={currentDay===detail.day ?PlusWhite:PlusImg} alt=""/>
                            }
                            {
                                innerItem.status && (!!innerItem.event.description || !!innerItem.event.location) && <img src={currentDay===detail.day ?SubWhite:SubImg} alt=""/>
                            }
                        </EventBox>

                        {
                            innerItem.status &&<EventDesc>
                                {
                                    !!innerItem.event.description &&<div className="line">
                                        <div className="lft">
                                            <img src={currentDay===detail.day ?TitleWhite:TitleImg} alt=""/>
                                        </div>
                                        <div className="location"  dangerouslySetInnerHTML={{__html: innerItem.event.description}}></div>
                                    </div>
                                }
                                {
                                    !!innerItem.event.location &&<div className="line">
                                        <div className="lft">
                                            <img src={currentDay===detail.day?LocationWhite:LocationImg} alt=""/>
                                        </div>
                                        <div className="location">{innerItem.event.location}</div>
                                    </div>
                                }

                            </EventDesc>
                        }

                    </li>)
                }
                {
                   more &&<li className="moreLi" onClick={()=>handleMore()}>
                        <div>
                            {
                                t("Calendar.more", { item: list.length - SliceNum  })
                            }
                        </div>
                        <div>
                            <img src={currentDay===index?MoreWhite:MoreImg} alt=""/>
                        </div>
                    </li>
                }

            </ul>

        </dd>
    </DlBox>
}
