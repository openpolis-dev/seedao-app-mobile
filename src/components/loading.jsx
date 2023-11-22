import styled from "styled-components";
import LogoImg from "../assets/Imgs/logo.png"

const Box = styled.div`
    width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  
`
export default function Loading(){
    return <Box>
        <img src={LogoImg} alt=""/>
    </Box>
}
