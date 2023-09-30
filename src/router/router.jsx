import React, { useEffect, useState } from "react";
import {
    Route,
    Routes,
    Navigate
} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Project from "pages/project";
import ProjectInfoRoot from "pages/project/info";

import Proposal from "../pages/proposal";
import ProposalCategory from "pages/proposal/category";
import ProposalThread from "pages/proposal/thread";

import My from "../pages/my";
import Board from "../pages/board";
import Setting from "../pages/setting";
import Guild from "../pages/guild";
import Assets from "../pages/assets";
import Profile from "../pages/profile";
import Vault from "../pages/vault";
import Privacy from "../pages/privacy";

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
                <Route path="/project/info/:id" element={<ProjectInfoRoot />} />
                <Route path="/proposal" element={<Proposal />} />
                <Route path="/proposal/category/:id" element={<ProposalCategory />} />
                <Route path="/proposal/thread/:id" element={<ProposalThread />} />
                <Route path="/guild" element={<Guild />} />
                <Route path="/assets" element={<Assets />} />


                <Route path="/my" element={<My />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/board" element={<Board />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/value" element={<Vault />} />
                <Route path="/privacy" element={<Privacy />} />

                {/*<Route path="/message" element={<MessagePage />} />*/}
            </Routes>
            {/*<EventHandler />*/}
        </>
    );
}

export default RouterLink;
