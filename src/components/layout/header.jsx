import styled from "styled-components";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import BackSVG from "components/svgs/back";
import DetailModal from "../detailModal";

const Back = styled.div`
  position: absolute;
  left: 20px;
  top: calc(7px + env(safe-area-inset-top));
`;
const HeaderBox = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 47px;
  line-height: 47px;
  color: ${(props) => props.$headColor || "var(--font-color)"};
`;
const Box = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: calc(47px + env(safe-area-inset-top));
  z-index: 9;
  background: ${(props) => props.$bgColor || "var(--background-color-1)"};
  box-sizing: border-box;
  width: 100vw;
  padding-inline: 20px;
  padding-top: env(safe-area-inset-top);
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
  top: env(safe-area-inset-top);
  padding-top: 10px;
`;
export default function Header({ title, bgColor, headColor, rightOperation, handleBack, ...props }) {
  const navigate = useNavigate();

  const backTop = () => {
    handleBack ? handleBack() : navigate(-1);
  };

  return (
    <Box $bgColor={bgColor} {...props}>
      <Back onClick={() => backTop()}>
        <BackSVG color={headColor} />
      </Back>
        <DetailModal />
      <HeaderBox $headColor={headColor}>
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
