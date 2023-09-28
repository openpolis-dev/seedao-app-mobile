import styled from "styled-components";
import {ChevronLeft} from "react-bootstrap-icons";
import {Row,Col} from "react-bootstrap";
import Loading from "./loading";
import {useNavigate} from "react-router-dom";


const Box = styled.div`
    position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  background: #fff;
  box-sizing: border-box;
 width: 100vw;
  padding: 10px;
`

const Rht = styled(Col)`
  text-align: right;
`

const Mid = styled(Col)`
    text-align: center;
`
export default function Header({title}){
    const navigate = useNavigate();

    const backTop = () =>{
        navigate(-1)
    }

    return <Box>
        <Row>
            <Col xs={2} onClick={()=>backTop()}><ChevronLeft /></Col>
            <Mid xs={8}>{title}</Mid>
            <Rht xs={2}>
                <Loading/>
            </Rht>
        </Row>
    </Box>
}

