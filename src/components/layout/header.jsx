import styled from "styled-components";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import BackSVG from "components/svgs/back";

const Back = styled.div`
  position: absolute;
  left: 20px;
  top: 7px;
`;
const HeaderBox = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${(props) => props.headColor || "var(--font-color)"};
`;
const Box = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 47px;
  line-height: 47px;
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
  right: -24px;
  top: 3px;
`;
const OperateBox = styled.div`
  position: absolute;
  right: 20px;
  top: 0;
`;
export default function Header({ title, bgColor, headColor, rightOperation, handleBack }) {
  const navigate = useNavigate();

  const backTop = () => {
    handleBack ? handleBack() : navigate(-1);
  };

  return (
    <Box bgColor={bgColor}>
      <Back onClick={() => backTop()}>
        <BackSVG color={headColor} />
      </Back>
      <HeaderBox headColor={headColor}>
        <Mid>
          <span>{title}</span>
          <LoadingBox>
            <Loading />
          </LoadingBox>
        </Mid>
      </HeaderBox>
      <OperateBox>{rightOperation}</OperateBox>
    </Box>
  );
}
