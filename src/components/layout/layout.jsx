import styled from "styled-components";
import Header from "./header";
import TabBar from "./tabBar";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StickyHeader from "./StickyHeader";

const OuterBox = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* display: flex; */
`;
const InnerBox = styled.div`
  /* flex-grow: 1; */
  width: 100%;
  height: 100%;
  padding-top: ${(props) => props.paddingTop};
  padding-bottom: ${(props) => props.notab};
  overflow-y: auto;
  box-sizing: border-box;
`;
/**
 *
 * sticky: boolean
 * title: string
 * noTab: boolean
 * headBgColor: string
 * bgColor: string
 */
export default function Layout({
  children,
  noHeader,
  title,
  noTab,
  headBgColor,
  bgColor,
  headColor,
  sticky,
  rightOperation,
  handleBack,
}) {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.userToken);
  const innerRef = useRef();

  useEffect(() => {
    if (!userToken?.token) {
      navigate("/login");
    }
  }, [userToken]);

  useEffect(() => {
    document.querySelector("body").style.background = bgColor || "#FFFFFF";
  }, [bgColor]);

  return (
    <OuterBox>
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
          />
        )
      ) : (
        <></>
      )}
      <InnerBox id="inner" ref={innerRef} notab={noTab ? 0 : "70px"} paddingTop={noHeader || sticky ? "0" : "47px"}>
        {children}
      </InnerBox>
      {!noTab && <TabBar />}
    </OuterBox>
  );
}
