import {X} from "react-bootstrap-icons"
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Box = styled.div`
`
const CloseBox = styled.div`
    font-size: 30px;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`
export default function Board(){
    const navigate = useNavigate();
    const toGo = (url) =>{
        navigate(url)
    }
    return <Box>
        <CloseBox onClick={()=>toGo("/")}>
            <X />
        </CloseBox>
        <div>
            Board
        </div>

    </Box>
}
