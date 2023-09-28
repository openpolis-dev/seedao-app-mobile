import {useEffect} from "react";
import store from "../../store";
import {saveAccount} from "../../store/reducer";
import styled from "styled-components";

const Box = styled.div`
    background: #fff;
  position: fixed;
  padding: 20px;
  bottom: 0;
  left: 0;
  z-index: 9;
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  width: 100%;
`

export default function TabBar(){

    useEffect(() => {
        store.dispatch(saveAccount("123"))
    }, []);
    return <Box>TabBar</Box>
}
