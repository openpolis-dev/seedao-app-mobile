import ReactGA from "react-ga4";
import router from "../router/router";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
ReactGA.initialize("G-584K59B1LH");

export default function RouterChecker(){
    let location = useLocation();


    useEffect(() => {


        document.title = `SEEDAO - ${(location.pathname.split("/")[1]).toUpperCase()}`;

        ReactGA.send({ hitType: "pageview", page: location.pathname });


    }, [location.pathname]);
    // ReactGA.event({
    //     category: "your category",
    //     action: "your action",
    //     label: "your label", // optional
    //     value: account, // optional, must be a number
    //     // nonInteraction: true, // optional, true/false
    //     // transport: "xhr", // optional, beacon/xhr/image
    // });
    // gtag.event({ action: gtag.EVENTS.LOGIN_SUCCESS, category: chooseWallet.value, value: account });
    return null;
}
