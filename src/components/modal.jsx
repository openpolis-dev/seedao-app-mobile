import styled from "styled-components";
import {X} from "react-bootstrap-icons";

const Box = styled.div`
    position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`

const InnerBox = styled.div`
    background: #fff;
  padding:40px 20px 20px;
  border-radius: 10px;
  width: 80vw;
  position: relative;
`

const TopBox = styled.div`
    position: absolute;
    top: -5px;
  right: 10px;
  font-size: 30px;
`
export default function Modal({tips,show,handleClose}){
    return <>
        {
            show &&<Box>
        <InnerBox>
            <TopBox>
                <X className="iconBox" onClick={()=>handleClose()}/>
            </TopBox>
            <div>
                {tips}
            </div>
        </InnerBox>
    </Box>
        }
    </>
}
