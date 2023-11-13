import styled from "styled-components";
import {useEffect} from "react";
import axios from "axios";

const Box = styled.div`
    margin: 24px 20px 0;
  background: var(--primary-color);
  border-radius: 16px;
  padding: 16px;
  color: #fff;
`
export default function HomeCalendar(){
    const apiKey = 'AIzaSyDyZO-Xhx71aD0Rpv8EcwY2N5rsdBWG8hA';
    const getCalendar = async() =>{
        let rt = await axios.get('https://www.googleapis.com/calendar/v3/calendars/seedao.tech@gmail.com/events', {
            headers: {
                'apikey': apiKey
            }
        });
        console.log(rt)
    }

    useEffect(() => {
        getCalendar()
    }, []);
    return <Box>HomeCalendar</Box>
}
