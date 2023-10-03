import Layout from "components/layout/layout";
import LogoImg from "../assets/images/logo.png";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import Metamask from "../components/login/metamask";
import {useNavigate} from "react-router-dom";
import Loading from "../components/layout/loading";
import Joyid from "../components/login/joyid";
import Unipass from "../components/login/unipass";

const Box = styled.div`
    display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`


const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  img{
    width: 50%;
    margin: 0 auto;
  }
`

const Tips = styled.div`
    font-size: 14px;
`
const BtnList = styled.ul`
    margin-top: 10px;
  li{
    margin-bottom: 20px;
  }
  .btn{
    border-radius: 30px;
    width: 200px;
    height: 36px;
    font-size: 14px;
  }
`

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:20px;
  min-height: 40px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
`

export default function Login() {
    const { t } = useTranslation();

  return (
    <Layout noHeader noTab>
        <FlexBox>
            <div />
            <Loading/>
        </FlexBox>

        <Box>
            <LogoBox>
                <img src={LogoImg} alt=""/>
            </LogoBox>
            <Tips>
                {t('mobile.my.connect')}
            </Tips>
            <BtnList>
                <li>
                    <Metamask />
                </li>
                <li>
                    <Unipass />
                </li>
                <li>
                    <Joyid />
                </li>
            </BtnList>
        </Box>

    </Layout>
  );
}
