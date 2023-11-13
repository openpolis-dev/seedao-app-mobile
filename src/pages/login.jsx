import Layout from "components/layout/layout";
import LogoImg from "../assets/Imgs/loginLogo.png";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Metamask from "../components/login/metamask";
import Joyid from "../components/login/joyid";
import Unipass from "../components/login/unipass";
import {useState} from "react";
import SwitchLan from "../components/common/switchLan";
import AppConfig from "../AppConfig";

const Box = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  img {
    width: 70%;
    margin: 0 auto;
  }
`;

const Tips = styled.div`
  font-size: 24px;
  font-family: 'Poppins-SemiBold';
  margin: 10% 24px 5%;
`;
const BtnList = styled.ul`
  margin: 0 24px;
  li {
    margin-bottom: 20px;
    background: #f7f7f9;
    border-radius: 16px;
    padding: 10px;

    dl{
      display: flex;
      align-items: center;
      justify-content: space-between; 
      padding: 6px;
    }
    .logo{
      margin-right: 12px;
      background: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 56px;
      }
    }
    dt{
      display: flex;
      align-items: center;
      span{
        font-size: 15px;
        font-family: Poppins-SemiBold;
        font-weight: 600;
        line-height: 22px;
      }
    }
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  min-height: 40px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
`;

const LanguageBox = styled.div`
  font-size: 14px;
  span{
    margin-right: 5px;
  }
`

export default function Login() {
  const { t,i18n } = useTranslation();
  const[show,setShow]= useState(false);



  const returnLan = () =>{
    const arr = AppConfig.Lan.filter(item=>item.value === i18n.language )
    return arr[0].name
  };
  const showBtm = () =>{
    setShow(true)
  }
  const handleClose = () =>{
    setShow(false)
  }


  return (
    <Layout noHeader noTab>
      {/*<SwitchLan show={show} handleClose={handleClose} />*/}
      {/*<FlexBox>*/}
      {/*  <LanguageBox onClick={()=>showBtm()}>*/}
      {/*    <span>{returnLan()}</span>*/}
      {/*  </LanguageBox>*/}
      {/*</FlexBox>*/}

      <Box>
        <LogoBox>
          <img src={LogoImg} alt="" />
        </LogoBox>
        <Tips>{t("General.connect")}</Tips>
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
