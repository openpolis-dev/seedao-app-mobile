import PlusWhite from "../../assets/Imgs/calendar/plus-white.svg";
import PlusImg from "../../assets/Imgs/calendar/plus.svg";
import TitleWhite from "../../assets/Imgs/calendar/title-white.svg";
import TitleImg from "../../assets/Imgs/calendar/title.svg";
import LocationWhite from "../../assets/Imgs/calendar/location-white.svg";
import LocationImg from "../../assets/Imgs/calendar/location.svg";
import MoreImg from "../../assets/Imgs/calendar/more.svg";
import MoreWhite from "../../assets/Imgs/calendar/more-white.svg";
import styled from "styled-components";
import {useState} from "react";


const EventBox= styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export default function CalendarItem(){
    const [index] = useState(0)
    const [currentEvent, setCurrentEvent] = useState(1);
    const [currentDay, setCurrentDay] = useState(2);

    const [more,setMore] = useState(false)


    return <DlBox key={`calendar_${index}}`}  className={currentDay===index? "activeBox":""}>
        <dt>11-01 周四</dt>
        <dd>
            <ul>
                {
                    [...Array(4)].map((innerItem,innerIndex)=><li key={`events_${innerIndex}}`}>
                        <EventBox>
                            <span>15:00-16:00 翻译公会 周会</span>
                            <img src={currentDay===index ?PlusWhite:PlusImg} alt=""/>
                        </EventBox>

                        {
                            currentEvent === innerIndex &&<EventDesc>
                                <div className="line">
                                    <div className="lft">
                                        <img src={currentDay===index?TitleWhite:TitleImg} alt=""/>
                                    </div>
                                    <div className="location">Alex 邀请您参加腾讯会议 会议主题：Web端原型修改</div>
                                </div>
                                <div className="line">
                                    <div className="lft">
                                        <img src={currentDay===index?LocationWhite:LocationImg} alt=""/>
                                    </div>
                                    <div className="location">http://meeting.tencent.com/dm/Dfsi31kwzdOV</div>
                                </div>
                            </EventDesc>
                        }

                    </li>)
                }
                <li className="moreLi">
                    <div>
                        剩余2项
                    </div>
                    <div>
                        <img src={currentDay===index?MoreWhite:MoreImg} alt=""/>
                    </div>
                </li>
            </ul>

        </dd>
    </DlBox>
}
