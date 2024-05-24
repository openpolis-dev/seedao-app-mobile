import styled from "styled-components";
import Header from "./header";
import TabBar from "./tabBar";
import { useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StickyHeader from "./StickyHeader";
import { savePath } from "../../store/reducer";
import store from "store";
import { isInPWA } from "utils";
import { checkTokenValid, clearStorage } from "utils/auth";

const OuterBox = styled.div`
  width: 100%;
  height: ${(props) => (props.isPwa === "true" ? "100vh" : "100%")};
  box-sizing: border-box;

  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
`;
const InnerBox = styled.div`
  /* flex-grow: 1; */
  width: 100%;
  height: ${(props) => `calc(100% - ${props.$sticky === "true" ? props.$notab : 0})`};
  padding-top: ${(props) => props.$paddingtop};
  padding-bottom: ${(props) => props.$notab};
  overflow-y: auto;
  box-sizing: border-box;
  overscroll-behavior: none;
`;
/**
 *
 * sticky: boolean
 * title: string
 * noTab: boolean
 * customTab: if noTab is true, customTab will not display
 * headBgColor: string
 * bgColor: string
 */
export default function Layout({
  children,
  noHeader,
  title,
  noTab,
  customTab,
  headBgColor,
  headStyle,
  bgColor,
  headColor,
  sticky,
  rightOperation,
  handleBack,
  headerProps,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userToken = useSelector((state) => state.userToken);
  const innerRef = useRef();

  const [pwaBtm, setPwaBtm] = useState(false);

  const location = useLocation();

  useEffect(() => {
    store.dispatch(savePath(location.pathname));
  }, [location]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile/.test(userAgent);
    const isPWA = isInPWA();

    setPwaBtm(isMobile && !isPWA);
  }, []);

  useEffect(() => {
    if (pathname === "/login") {
      return;
    }

    if (pathname.indexOf("profile")>-1 || pathname.indexOf("sns")>-1) {
      if (!checkTokenValid(userToken?.token, userToken?.token_exp)) {
        clearStorage();

        if (pathname === "/sns/register") {
          localStorage.setItem("before-login", `1_${window.location.search}`);
        }
        navigate("/login");
      }
    }

    // check token

  }, [userToken, pathname]);

  useEffect(() => {
    document.querySelector("body").style.background = bgColor || "#FFFFFF";
  }, [bgColor]);

  return (
    <OuterBox isPwa={isInPWA().toString()}>
      {!noHeader ? (
        sticky ? (
          <StickyHeader title={title} bgColor={bgColor} scrollRef={innerRef} />
        ) : (
          <Header
            title={title}
            bgColor={headBgColor}
            rightOperation={rightOperation}
            headColor={headColor}
            handleBack={handleBack}
            {...headStyle}
            headerProps={headerProps}
          />
        )
      ) : (
        <></>
      )}
      <InnerBox
        id="inner"
        ref={innerRef}
        $notab={noTab ? 0 : "70px"}
        $sticky="true"
        $paddingtop={noHeader || sticky ? "0" : "47px"}
      >
        {children}
      </InnerBox>
      {!noTab && (customTab || <TabBar />)}
    </OuterBox>
  );
}
