// import UserSNS from "pages/sns/userSNS";
import React from "react";
import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";


const Home = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/login"));
const Project = lazy(() => import("pages/project"));
const ProjectInfoRoot = lazy(() => import("pages/project/info/info"));
const Guild = lazy(() => import("pages/guild"));
const GuildInfoRoot = lazy(() => import("pages/guild/info/info"));
const Proposal = lazy(() => import("../pages/proposal"));
const ProposalCategory = lazy(() => import("pages/proposal/category"));
const ProposalThread = lazy(() => import("pages/proposal/thread"));
const Setting = lazy(() => import("../pages/setting"));
const Assets = lazy(() => import("../pages/vault/assets"));
const AssetsApplication = lazy(() => import("../pages/vault/application"));
const Profile = lazy(() => import("../pages/profile"));
const Calendar = lazy(() => import("../pages/calendar"));
const ProfileEdit = lazy(() => import("../pages/profileEdit"));
const Explore = lazy(() => import("../pages/explore"));
const Governance = lazy(() => import("pages/governance"));
const Pub = lazy(() => import("../pages/Pub"));
const PubDetail = lazy(() => import("../pages/PubDetail"));
const PubList = lazy(() => import("../pages/PubList"));
const EventList = lazy(() => import("pages/event/list"));
const EventInfoPage = lazy(() => import("pages/event/detail"));
const RankingPage = lazy(() => import("pages/ranking"));
const SNSEntrancePage = lazy(() => import("pages/sns/entrance"))
const RegisterSNS = lazy(() => import("pages/sns/register"))
const JoyIDRedirect = lazy(() => import("pages/joyRedirect"))

// import Home from "../pages/home";
// import Login from "../pages/login";
// import Project from "pages/project";
// import ProjectInfoRoot from "pages/project/info";

// import Guild from "pages/guild";
// import GuildInfoRoot from "pages/guild/info";

// import Proposal from "../pages/proposal";
// import ProposalCategory from "pages/proposal/category";
// import ProposalThread from "pages/proposal/thread";

// import My from "../pages/my";
// import Board from "../pages/board";
// import Setting from "../pages/setting";
// import Assets from "../pages/assets";
// import Profile from "../pages/profile";
// import Vault from "../pages/vault";
// import Privacy from "../pages/privacy";
// import Calendar from "../pages/calendar";
// import ProfileEdit from "../pages/profileEdit";
// import Explore from "../pages/explore";
// import Governance from "pages/governance";

// import Hub from "../pages/Hub";
// import PubDetail from "../pages/PubDetail";
// import PubList from "../pages/PubList";
// import EventList from "pages/event/list";
// import EventInfoPage from "pages/event/detail";
// import RankingPage from "pages/ranking";

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
        <Route path="/assets/application" element={<AssetsApplication />} />
        <Route path="/user/edit" element={<ProfileEdit />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/event/view" element={<EventInfoPage />} />
        <Route path="/ranking" element={<RankingPage />} />

        <Route path="/hub" element={<Pub />} />
        <Route path="/hubList" element={<PubList />} />
        <Route path="/hubDetail/:id" element={<PubDetail />} />

        <Route path="/calendar" element={<Calendar />} />

        {/* <Route path="/my" element={<My />} /> */}
        <Route path="/setting" element={<Setting />} />
        {/* <Route path="/board" element={<Board />} /> */}
        <Route path="/user/profile" element={<Profile />} />
        {/* <Route path="/user/vault" element={<Vault />} /> */}
        {/* <Route path="/privacy" element={<Privacy />} /> */}

        {/*<Route path="/message" element={<MessagePage />} />*/}

        <Route path="/sns" element={<SNSEntrancePage />} />
        <Route path="/sns/register" element={<RegisterSNS />} />
        {/* <Route path="/sns/user" element={<UserSNS />} /> */}
        {/* redirect */}
        <Route path="/redirect" element={<JoyIDRedirect />} />
      </Routes>
      {/*<EventHandler />*/}
    </>
  );
}

export default RouterLink;
