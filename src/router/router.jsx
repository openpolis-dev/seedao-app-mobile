import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Project from "pages/project";
import ProjectInfoRoot from "pages/project/info";

import Guild from "pages/guild";
import GuildInfoRoot from "pages/guild/info";

import Proposal from "../pages/proposal";
import ProposalCategory from "pages/proposal/category";
import ProposalThread from "pages/proposal/thread";

import My from "../pages/my";
import Board from "../pages/board";
import Setting from "../pages/setting";
import Assets from "../pages/assets";
import Profile from "../pages/profile";
import Vault from "../pages/vault";
import Privacy from "../pages/privacy";
import Calendar from "../pages/calendar";
import ProfileEdit from "../pages/profileEdit";
import Explore from "../pages/explore";
import Governance from "pages/governance";

import Pub from "../pages/Pub";
import PubDetail from "../pages/PubDetail";
import EventList from "pages/event/list";

// import MessagePage from "./message";
// import EventHandler from "./components/eventHandler";

function RouterLink() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project" element={<Project />} />
        <Route path="/project/info/:id" element={<ProjectInfoRoot />} />
        <Route path="/guild" element={<Guild />} />
        <Route path="/guild/info/:id" element={<GuildInfoRoot />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/proposal/category/:id" element={<ProposalCategory />} />
        <Route path="/proposal/thread/:id" element={<ProposalThread />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/user/edit" element={<ProfileEdit />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/event" element={<EventList />} />

        <Route path="/pub" element={<Pub />} />
        <Route path="/pubDetail/:id" element={<PubDetail />} />

        <Route path="/online-event" element={<Calendar />} />

        <Route path="/my" element={<My />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/board" element={<Board />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/vault" element={<Vault />} />
        <Route path="/privacy" element={<Privacy />} />

        {/*<Route path="/message" element={<MessagePage />} />*/}
      </Routes>
      {/*<EventHandler />*/}
    </>
  );
}

export default RouterLink;
