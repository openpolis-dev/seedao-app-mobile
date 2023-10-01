import { X } from "react-bootstrap-icons";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowIcon from "assets/images/arrow.svg";

export default function Board() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toGo = (url) => {
    navigate(url);
  };
  return (
    <Box>
      <CloseBox onClick={() => toGo("/")}>
        <X />
      </CloseBox>
      <ContentBox>
        <JoinUs>{t("mobile.onBoard.join")}</JoinUs>
        <TextBox>
          <p>{t("mobile.onBoard.enter")}</p>
          <p>{t("mobile.onBoard.tip")}</p>
        </TextBox>
        <ArrowBox>
          <img src={ArrowIcon} alt="" />
        </ArrowBox>
        <DeschoolLink href="https://deschool.app/origin/learn" target="_blank">
          Deschool
        </DeschoolLink>
      </ContentBox>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f9c5d1;
  background-image: linear-gradient(315deg, #f9c5d1 0%, #9795ef 74%);
  text-align: center;
  color: #fff;
`;
const CloseBox = styled.div`
  font-size: 30px;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: calc(100vh - 200px);
`;

const JoinUs = styled.div`
  width: 70%;
  height: 76px;
  line-height: 76px;
  font-size: 46px;
  text-align: center;
  background-color: #9163fe;
  color: #fff;
  margin-inline: auto;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2px;
`;

const ArrowBox = styled.div`
  img {
    transform: scale(1.7);
    height: 100px;
    margin-inline: auto;
  }
`;

const TextBox = styled.div``;

const DeschoolLink = styled.a`
  border-radius: 8px;
  border: 2px solid #9163fe;
  height: 76px;
  line-height: 76px;
  font-size: 36px;
  display: inline-block;
  width: 50%;
  color: #9163fe;
  margin-inline: auto;
  font-weight: 800;
`;
