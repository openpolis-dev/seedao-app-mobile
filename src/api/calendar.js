import axios from "axios";

const apiKey = 'AIzaSyDyZO-Xhx71aD0Rpv8EcwY2N5rsdBWG8hA';

export const getCalenderEvents = (startTime,endTime) => {

    const str = startTime&&endTime ? `&timeMax=${encodeURIComponent(endTime)}&timeMin=${encodeURIComponent(startTime)}`:""

    return axios.get(`https://www.googleapis.com/calendar/v3/calendars/seedao.tech@gmail.com/events?key=${apiKey}&maxResults=1000${str}`);
};
