import styled from "styled-components";
import Header from "./header";

const OuterBox = styled.div`
    padding: 50px 0 80px;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  background: #f0f3f8;
`
export default function Layout({children}){
    return <OuterBox>
        <Header />
        {children}
    </OuterBox>
}
