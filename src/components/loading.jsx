import styled from "styled-components";
import LogoImg from "../assets/Imgs/logo.png"
import {useEffect, useState} from "react";
import LoadingBox from "components/common/loading";

const Box = styled.div`
    width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
`
export default function Loading(){

    const [show,setShow] = useState(false)


    useEffect(() => {
        console.log(window.location.href)
        if(window.location.href.indexOf("login")>-1){
            setShow(true)
        }
    }, [window.location.href]);


    return <>
        {
            show && <Box>
                <img src={LogoImg} alt=""/>
            </Box>
        }
        {
            !show&& <Box>
                <LoadingBox />
            </Box>
        }

    </>
}
