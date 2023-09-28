import React, { useEffect, useState } from "react";
import {
    Route,
    Routes,
    Navigate
} from "react-router-dom";
import Home from "pages/home";
import Login from "pages/Login";
// import MessagePage from "./message";
// import EventHandler from "./components/eventHandler";
// import InstallCheck from "./components/install";

function RouterLink() {
    // const [isInstalled, setIsInstalled] = useState(true);
    //
    // useEffect(() => {
    //     if (
    //         window.navigator?.standalone === true ||
    //         window.matchMedia("(display-mode: standalone)").matches
    //     ) {
    //         console.log("isInstalled: true. Already in standalone mode");
    //         setIsInstalled(true);
    //     } else {
    //         console.log("isInstalled: false");
    //         setIsInstalled(false);
    //     }
    //
    // }, []);

    return (
        <>
            {/*{!isInstalled && <InstallCheck />}*/}

            <Routes>
                <Route path="/" element={<Navigate to="/home" />}  />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                {/*<Route path="/message" element={<MessagePage />} />*/}
            </Routes>
            {/*<EventHandler />*/}
        </>
    );
}

export default RouterLink;
