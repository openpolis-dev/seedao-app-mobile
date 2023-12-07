import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import styled, { css } from "styled-components";

const Box = styled.div`
  background: #fff;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
    .calendar-title{
        font-family: 'Jost-ExtraBold';
    }
  .innerDay{
    height: 100%;
  }
  .isEvent{
    height: 100%;
  }
    .event{

      height: 100%;
      &>div:first-child{
        height: 100%;
      }
    }
    .event-text{
      height: 100%;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding:3px 0 3px 14px;
      &>span:nth-child(2){
        display: none;
        margin-left: -8px;
        font-size: 10px;
      }
      &>span:nth-child(3){
          display: block;
        margin-left: -8px;
        font-size: 10px;
        width: 100%;
        white-space:pre-wrap;
        word-break: break-all;
        padding: 0;
        margin: 0;
      }
     
    }
    .tooltip{
        &>div>div:first-child{
            top:10px;
          right:20px;
        }
        h2{
            font-size: 20px;
            padding: 20px;
            background: #f0f3f8;
        }
        .display-linebreak{
            width: 100%;
            white-space: nowrap;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        .location{
            border-bottom: 1px solid #eee;
            padding: 20px;
        }
        .description{
            align-items: flex-start;
            border-bottom: 1px solid #eee;
            padding: 20px;
        }
        .calendarName{
            border-bottom: 1px solid #eee;
            background: #f0f3f8;
            margin-top: -13px;
            padding: 20px;
        }
        .calendarName + a{
          padding: 20px;
        }
        a:hover{
            color: var(--bs-primary)
        }
        
    }
    
`
const API_KEY = "AIzaSyALdB9mkCt4WF-qk3wC8127n-s3qhVQdUs";
let calendars = [
    {
        calendarId: "c704ce5098512b0b0d70722e6430af4221e3c9ebc6d1e72aa70b82c80bb6999f@group.calendar.google.com",
        color: "#B241D1",
    },

];

let styles = {
    calendar: {
        borderWidth: "0",
        background:"#fff"
    },
    event:{
        fontSize:"12px"
    },
    eventCircle:{
        top:"2px",
        width:"8px"
    },
    tooltip:{
        width:"100vw",
        height:"100vh",
        padding:"0",
        background: "#fff",
        border:0
    },
    today: css`
    color: var(--bs-primary);
    border: 1px solid var(--bs-primary);
  `,
};

const language = "EN";

export default function CalendarBox(){

return (
    <Box>
        <Calendar
            apiKey={API_KEY}
            calendars={calendars}
            styles={styles}
            language={language}
        />
    </Box>
);
}

