import { useMemo } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HomeImg from "../../assets/Imgs/home.svg";
import HomeHover from "../../assets/Imgs/home_active.png";

import GoverImg from "../../assets/Imgs/govern.svg";
import GoverHover from "../../assets/Imgs/govern_active.png";

import ExploreImg from "../../assets/Imgs/explore.svg";
import ExploreHover from "../../assets/Imgs/explore_active.png";

const Box = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  height: 70px;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
`;

const ItemBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .nor {
    display: block;
  }
  .act {
    display: none;
  }

  a {
    width: 50%;
    color: #9a9a9a;
    display: inline-block;
    border: 0;
    user-select: none;
    &:hover,&:active,&:focus{
      background: transparent;
    }
    &.active {
      color: var(--font-color);
      .nor {
        display: none;
      }
      .act {
        display: block;
      }
    }
    &:focus-visible{
      outline: none!important;

    }
 
  }
  dl {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    

  }
  dt {
    img {
      width: 24px;
      margin-bottom: 7px;
    }
  }
  dd {
    font-size: 12px;
  }
`;

export default function TabBar() {
  const { t } = useTranslation();
  const { pathname } = useLocation()
  const checkIsActive = (list) => {
    return list.some(item=>pathname.includes(item)) ? "active" : ""
  }
  const active_tabs = useMemo(() => {
    const governance_list = ["governance", "proposal", "assets","ranking","profile"];
    const home_list = ["home", "calendar", "sns"];
    const explore_list = ["explore", "project", "guild", "event","pub"];
    return [checkIsActive(governance_list), checkIsActive(home_list), checkIsActive(explore_list)];
  }, [pathname]);
  return (
    <Box className="tabBarBox">
      <ItemBox>
        <NavLink className={active_tabs[0]} to="/governance">
          <dl>
            <dt>
              <img src={GoverImg} className="nor" alt="" />
              <img src={GoverHover} className="act" alt="" />
            </dt>
            <dd>{t("Menus.Governance")}</dd>
          </dl>
        </NavLink>
        <NavLink className={active_tabs[1]} to="/home">
          <dl>
            <dt>
              <img src={HomeImg} className="nor" alt="" />
              <img src={HomeHover} className="act" alt="" />
            </dt>
            <dd>{t("Menus.Square")}</dd>
          </dl>
        </NavLink>

        <NavLink className={active_tabs[2]} to="/explore">
          <dl>
            <dt>
              <img src={ExploreImg} className="nor" alt="" />
              <img src={ExploreHover} className="act" alt="" />
            </dt>
            <dd>{t("Menus.Explore")}</dd>
          </dl>
        </NavLink>

        {/*<NavLink className={({ isActive }) => isActive ?"active":""} to="/assets">*/}
        {/*    <dl>*/}
        {/*        <dt>*/}
        {/*            <Person />*/}
        {/*        </dt>*/}
        {/*        <dd>{t('Menus.assets')}</dd>*/}
        {/*    </dl>*/}
        {/*</NavLink>*/}
        {/*<NavLink className={({ isActive }) => isActive ?"active":""} to="/user/profile">*/}
        {/*    <dl>*/}
        {/*        <dt>*/}
        {/*            <Person />*/}
        {/*        </dt>*/}
        {/*        <dd>{t('mobile.my.my')}</dd>*/}
        {/*    </dl>*/}
        {/*</NavLink>*/}
      </ItemBox>
    </Box>
  );
}
