import styled from "styled-components";
import {ChevronLeft} from "react-bootstrap-icons";
import {Row,Col} from "react-bootstrap";
import Loading from "./loading";

const Box = styled.div`
    position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  background: #fff;
  box-sizing: border-box;
 width: 100vw;
  padding: 10px 0;
`

const Rht = styled(Col)`
  text-align: right;
  padding-right: 20px;
`

const Mid = styled(Col)`
    text-align: center;
`
export default function Header(){
    return <Box>
        <Row>
            <Col xs={2}><ChevronLeft /></Col>
            <Mid xs={8}>Inner</Mid>
            <Rht xs={2}>
                <Loading/>
            </Rht>
        </Row>
    </Box>
}

