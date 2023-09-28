import styled from "styled-components";
import Header from "./header";
import TabBar from "./tabBar";

const OuterBox = styled.div`
  width: 100%;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  background: #f0f3f8;
`
const InnerBox = styled.div`
  padding-top: {$props => props.noHeader ? 0 : 50px};
  padding-bottom: {$props => props.noTab ? 0 : 80px};
  
`
export default function Layout({children,noHeader,title,noTab}){
    return <OuterBox>
        {
            !noHeader && <Header title={title} />
        }
        <InnerBox noTab noHeader >
            {children}
        </InnerBox>
        {
            !noTab && <TabBar />
        }
    </OuterBox>
}
