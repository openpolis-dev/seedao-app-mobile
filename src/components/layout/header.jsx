import styled from "styled-components";
import { ChevronLeft } from "react-bootstrap-icons";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

const Back = styled.div`
  position: absolute;
  left: 20px;
`;
const HeaderBox = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
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

const Mid = styled.div`
  position: relative;
  font-family: "Poppins-SemiBold";
  font-size: 17px;
  font-weight: 600;
`;
const LoadingBox = styled.div`
  position: absolute;
  right: -70px;
  top: 0;
`
export default function Header({ title, bgColor }) {
  const navigate = useNavigate();

  const backTop = () => {
    navigate(-1);
  };

  return (
    <Box bgColor={bgColor}>
      <Back onClick={() => backTop()}>
        <ChevronLeft />
      </Back>
      <HeaderBox>
        <Mid>
          <span>{title}</span>
          <LoadingBox>
            <Loading />
          </LoadingBox>
        </Mid>
      </HeaderBox>
    </Box>
  );
}
