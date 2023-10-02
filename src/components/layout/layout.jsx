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
  background: #f0f3f8;
  display: flex;
`
const InnerBox = styled.div`
  flex-grow: 1;
  width: 100%;
  padding-top: ${props => props.noheader };
  padding-bottom: ${props => props.notab };
  
`
export default function Layout({children,noHeader,title,noTab}){


    const navigate = useNavigate();
    const userToken = useSelector(state=> state.userToken);

    useEffect(()=>{
        if(!userToken?.token){
            navigate("/login")
        }
    },[userToken])


    return <OuterBox>
        {
            !noHeader && <Header title={title} />
        }
        <InnerBox notab={noTab? 0 : '80px'} noheader={noHeader? 0 : '50px'} >
            {children}
        </InnerBox>
        {
            !noTab && <TabBar />
        }
    </OuterBox>
}
