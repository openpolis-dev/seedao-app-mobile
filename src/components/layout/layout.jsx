import styled from "styled-components";
import Header from "./header";
import TabBar from "./tabBar";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const OuterBox = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
`
const InnerBox = styled.div`
  flex-grow: 1;
  width: 100%;
  padding-top: ${props => props.noheader };
  padding-bottom: ${props => props.notab };

  
`
export default function Layout({children,noHeader,title,noTab, headBgColor}){


    const navigate = useNavigate();
    const userToken = useSelector(state=> state.userToken);

    useEffect(()=>{
        if(!userToken?.token){
            navigate("/login")
        }
    },[userToken])


    return <OuterBox>
        {
            !noHeader && <Header title={title} bgColor={headBgColor} />
        }
        <InnerBox notab={noTab? 0 : '90px'} noheader={noHeader? 0 : '60px'} >
            {children}
        </InnerBox>
        {
            !noTab && <TabBar />
        }
    </OuterBox>
}
