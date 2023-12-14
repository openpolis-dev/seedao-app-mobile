import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Animation from 'components/sns/animation';
import LogoImg from 'assets/Imgs/snsLogo.svg';
import { useTranslation } from 'react-i18next';

const Box = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
`;
const TopBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const TitleBox = styled.div`
  margin: 43px 0 15px;
  font-size: 38px;
  font-weight: 900;
  color: #3f3f3f;
  line-height: 50px;
  font-family: "Poppins-SemiBold";
  text-align: center;
`;

const TipBox = styled.div`
  margin:0 auto 23vh;
  color: #3f3f3f;
  width: 92%;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
`;

const ButtonBox = styled.div`
  width: 89.7vw;
  height: 44px;
  background: #4D00FF;
  border-radius: 16px ;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 30px;
  font-size: 14px;
`;
export default function SNSEntrancePage() {
  const { t } = useTranslation();
    return (
      <Box>
        <TopBox>
          <img src={LogoImg} alt="" />
          <TitleBox>{t("SNS.EntranceTitle")}</TitleBox>
          <TipBox>{t("SNS.EntranceDesc")}</TipBox>
          <Link to="/sns/register">
            <ButtonBox>{t("SNS.Start")}</ButtonBox>
          </Link>
        </TopBox>
        <Animation />
      </Box>
    );
}
