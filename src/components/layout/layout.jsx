import styled from "styled-components";
import Header from "./header";

const OuterBox = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  background: #f0f3f8;
`
const InnerBox = styled.div`
  padding: 50px 0 80px;
  height: 100%;
  background: #f00;
`
export default function Layout({children,noHeader}){
    return <OuterBox>
        {
            !noHeader && <Header />
        }

        <InnerBox>
            {children}
        </InnerBox>

    </OuterBox>
}
