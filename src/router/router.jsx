import React, { useEffect, useState } from "react";
import {
    Route,
    Routes,
    Navigate
} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Project from "../pages/project";
import Proposal from "../pages/proposal";
import My from "../pages/my";
import Board from "../pages/board";
import Setting from "../pages/setting";
import Guild from "../pages/guild";
import Assets from "../pages/assets";
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
                <Route path="/project" element={<Project />} />
                <Route path="/proposal" element={<Proposal />} />
                <Route path="/guild" element={<Guild />} />
                <Route path="/assets" element={<Assets />} />


                <Route path="/my" element={<My />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/board" element={<Board />} />

                {/*<Route path="/message" element={<MessagePage />} />*/}
            </Routes>
            {/*<EventHandler />*/}
        </>
    );
}

export default RouterLink;