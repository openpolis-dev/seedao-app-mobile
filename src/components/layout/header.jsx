import styled from "styled-components";
import { ChevronLeft } from "react-bootstrap-icons";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Col = styled.div``;
const Box = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 60px;
  line-height: 60px;
  z-index: 9;
  background: ${(props) => props.bgColor || "var(--background-color-1)"};
  box-sizing: border-box;
  width: 100vw;
  padding-inline: 20px;
`;

const Rht = styled(Col)`
  text-align: right;
`;

const Mid = styled(Col)`
  text-align: center;
  font-family: "Poppins-SemiBold";
  font-size: 17px;
  font-weight: 600;
`;
export default function Header({ title, bgColor }) {
  const navigate = useNavigate();

  const backTop = () => {
    navigate(-1);
  };

  return (
    <Box bgColor={bgColor}>
      <Row>
        <Col xs={2} onClick={() => backTop()}>
          <ChevronLeft />
        </Col>
        <Mid xs={8}>{title}</Mid>
        <Rht xs={2}>
          <Loading />
        </Rht>
      </Row>
    </Box>
  );
}
