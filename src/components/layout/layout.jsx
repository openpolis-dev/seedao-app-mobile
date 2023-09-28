import styled from "styled-components";
import Header from "./header";
import TabBar from "./tabBar";

const OuterBox = styled.div`
  width: 100%;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  background: #f0f3f8;
  display: flex;
`
const InnerBox = styled.div`
  flex-grow: 1;
  padding-top: ${props => props.noheader };
  padding-bottom: ${props => props.notab };
  
`
export default function Layout({children,noHeader,title,noTab}){
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
